import type { ProjectManifest } from '../../runtime/types'
import { Tokens } from './pages/tokens'
import { Components } from './pages/components'
import { LpHeroEditorial } from './pages/lp-hero-editorial'
import { LpHeroCentered } from './pages/lp-hero-centered'

const manifest: ProjectManifest = {
  id: 'b1a2c3d4-ui01-4dev-test-bryllenui0001',
  project: 'bryllen-ui',
  components: {
    'tokens': Tokens,
    'components': Components,
    'lp-hero-editorial': LpHeroEditorial,
    'lp-hero-centered': LpHeroCentered,
  },
}

export default manifest
