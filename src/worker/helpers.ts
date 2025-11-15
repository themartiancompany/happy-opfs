// SPDX-License-Identifier: GPL-3.0-or-later

/**    ----------------------------------------------------------------------
 *     Copyright ©
 *       Jiang Jie
 *         2024, 2025
 *       Pellegrino Prevete
 *         2025
 * 
 *     All rights reserved
 *     ----------------------------------------------------------------------
 * 
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 * 
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 * 
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { TIMEOUT_ERROR } from '../fs/constants.ts';
import type { ErrorLike,
              FileLike } from '../fs/defines.ts';

/**
 * Serialize an `Error` to plain object.
 * @param error - `Error` object.
 * @returns Serializable version of Error.
 */
export
  function
    serializeError(
      error:
        Error |
        null):
      ErrorLike |
      null {
    return error ?
           { name:
               error.name,
             message:
               error.message } :
           error;
}

/**
 * Deserialize an `Error` from plain object.
 * @param error - Serializable version of Error.
 * @returns `Error` object.
 */
export
  function
    deserializeError(
      error:
        ErrorLike):
      Error {
    const
      err =
        new Error(
          error.message);
    err.name =
      error.name;
    return err;
}

/**
 * Serialize a `File` to plain object.
 * @param file - `File` object.
 * @returns Serializable version of File.
 */
export
  async function
    serializeFile(
      file:
        File):
      Promise<FileLike> {
    const
      ab =
        await file.arrayBuffer();
    return {
      name:
        file.name,
      type:
        file.type,
      lastModified:
        file.lastModified,
      size:
        ab.byteLength,
      data:
        ab,
    };
}

/**
 * Deserialize a `File` from plain object.
 * @param file - Serializable version of File.
 * @returns `File` object.
 */
export
  function
    deserializeFile(
      file:
        FileLike):
      File {
      const
        blob =
          new Blob(
            [ file.data ]);
    return new File(
      [ blob ],
      file.name,
      { type:
          file.type,
        lastModified:
          file.lastModified });
}

/**
 * Global timeout of per sync I/O operation.
 */
let
  globalOpTimeout =
    1000;

/**
 * Set global timeout of per sync I/O operation.
 * @param timeout - Timeout in milliseconds.
 */
export
  function
    setGlobalOpTimeout(
      timeout:
        number):
      void {
    globalOpTimeout =
      timeout;
}

/**
 * Sleep until a condition is met.
 * @param condition - Condition to be met.
 */
export
  function
    sleepUntil(
      condition:
        () => boolean) {
      const
        start =
          Date.now();
      while ( !condition() ) {
        if ( Date.now() - start > globalOpTimeout ) {
          const
            error =
              new Error(
                'Operating Timeout');
          error.name =
            TIMEOUT_ERROR;
          throw error;
        }
    }
}
