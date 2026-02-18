/**
 * Migration registry — ordered list of all migrations.
 * NEVER delete entries. Consumers could be on any version.
 */

import * as m0010 from './0.0.10.js'
import * as m0016 from './0.0.16.js'
import * as m0017 from './0.0.17.js'
import * as m0018 from './0.0.18.js'
import * as m0019 from './0.0.19.js'
import * as m0020 from './0.0.20.js'
import * as m0021 from './0.0.21.js'
import * as m0022 from './0.0.22.js'
import * as m0023 from './0.0.23.js'
import * as m0024 from './0.0.24.js'
import * as m0025 from './0.0.25.js'
import * as m0026 from './0.0.26.js'

/** Migrations sorted by version (ascending). */
export const migrations = [m0010, m0016, m0017, m0018, m0019, m0020, m0021, m0022, m0023, m0024, m0025, m0026]
