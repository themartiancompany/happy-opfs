// SPDX-License-Identifier: GPL-3.0-or-later

//    ----------------------------------------------------------------------
//    Copyright © 2024, 2025
//                Jiang Jie
//
//    All rights reserved
//    ----------------------------------------------------------------------
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <https://www.gnu.org/licenses/>.


export { ABORT_ERROR,
         TIMEOUT_ERROR } from '@happy-ts/fetch-t';

/**
 * A constant representing the error thrown when a
 * file or directory is not found.
 *
 * Name of DOMException.NOT_FOUND_ERR.
 */
export
  const
    NOT_FOUND_ERROR =
      'NotFoundError' as const;

/**
 * A constant representing the root directory path.
 */
export
  const
    ROOT_DIR =
      '/' as const;

/**
 * A constant representing the current directory path.
 */
export
  const
    CURRENT_DIR =
      '.' as const;

/**
 * A constant representing the temporary directory path.
 */
export
  const
    TMP_DIR =
      '/tmp' as const;
