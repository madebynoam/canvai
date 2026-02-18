import { type Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8'))

const VIRTUAL_MODULE_ID = 'virtual:canvai-manifests'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

/**
 * Vite plugin that auto-discovers project manifests in src/projects/\*\/manifest.ts
 * and exposes them via a virtual module import.
 *
 * Usage in app code:
 *   import { manifests } from 'virtual:canvai-manifests'
 *   // manifests: ProjectManifest[]
 */
export function canvaiPlugin(): Plugin {
  let projectsDir: string

  function findManifests(): string[] {
    if (!fs.existsSync(projectsDir)) return []

    const filterProject = process.env.CANVAI_PROJECT

    return fs.readdirSync(projectsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .filter(d => !filterProject || d.name === filterProject)
      .map(d => path.join(projectsDir, d.name, 'manifest.ts'))
      .filter(p => fs.existsSync(p))
  }

  function generateModule(manifests: string[]): string {
    if (manifests.length === 0) {
      return 'export const manifests = [];\n'
    }

    const imports = manifests.map((m, i) =>
      `import manifest_${i} from '${m.replace(/\\/g, '/')}'`
    ).join('\n')

    const exports = manifests.map((_, i) => `manifest_${i}`).join(', ')

    return `${imports}\nexport const manifests = [${exports}];\n`
  }

  return {
    name: 'canvai-manifests',

    config() {
      return {
        define: {
          '__CANVAI_VERSION__': JSON.stringify(pkg.version),
        },
      }
    },

    configResolved(config) {
      projectsDir = path.resolve(config.root, 'src/projects')
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return generateModule(findManifests())
      }
    },

    configureServer(server) {
      // Watch the projects directory for new/removed manifests
      server.watcher.add(projectsDir)

      server.watcher.on('all', (event, filePath) => {
        if (filePath.endsWith('manifest.ts') && filePath.startsWith(projectsDir)) {
          // Invalidate the virtual module so it regenerates
          const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID)
          if (mod) {
            server.moduleGraph.invalidateModule(mod)
            server.ws.send({ type: 'full-reload' })
          }
        }
      })
    },
  }
}
