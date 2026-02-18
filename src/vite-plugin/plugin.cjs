const fs = require('fs')
const path = require('path')

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8'))

const VIRTUAL_MODULE_ID = 'virtual:canvai-manifests'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

function canvaiPlugin() {
  let projectsDir

  function findManifests() {
    if (!fs.existsSync(projectsDir)) return []

    return fs.readdirSync(projectsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => path.join(projectsDir, d.name, 'manifest.ts'))
      .filter(p => fs.existsSync(p))
  }

  function generateModule(manifests) {
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
      server.watcher.add(projectsDir)

      server.watcher.on('all', (_event, filePath) => {
        if (filePath.endsWith('manifest.ts') && filePath.startsWith(projectsDir)) {
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

module.exports = { canvaiPlugin }
