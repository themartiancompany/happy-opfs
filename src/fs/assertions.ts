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

import invariant from 'tiny-invariant';
import { ROOT_DIR } from './constants.ts';

/**
 * Asserts that the provided path is an absolute path.
 *
 * @param path - The file path to validate.
 * @throws Will throw an error if the path is not an absolute path.
 */
export function
  assertAbsolutePath(
    path:
      string): void {
    invariant(
    typeof path === 'string',
    () => `Path must be a string but received ${ path }`);
    invariant(
      path[
        0] === ROOT_DIR,
      () => `Path must start with / but received ${ path }`);
}

/**
 * Asserts that the provided URL is a valid file URL.
 *
 * @param fileUrl - The file URL to validate.
 * @throws Will throw an error if the URL is not a valid file URL.
 */
export function
  assertFileUrl(
    fileUrl:
      string): void {
    invariant(
      typeof fileUrl === 'string',
      () => `File url must be a string ` +
            `but received ${ fileUrl }`);
}
