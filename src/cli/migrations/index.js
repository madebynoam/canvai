/**
 * Migration registry — ordered list of all migrations.
 * NEVER delete entries. Consumers could be on any version.
 */

import * as m0010 from './0.0.10.js'

/** Migrations sorted by version (ascending). */
export const migrations = [m0010]
