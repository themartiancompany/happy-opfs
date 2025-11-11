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


import { Err, Ok, RESULT_VOID, type AsyncIOResult, type AsyncVoidIOResult } from 'happy-rusty';
import invariant from 'tiny-invariant';
import { TMP_DIR } from './constants.ts';
import type { TempOptions } from './defines.ts';
import { createFile, mkdir, readDir, remove } from './opfs_core.ts';
import { generateTempPath, isFileHandle } from './utils.ts';

/**
 * Create a temporary file or directory.
 *
 * @param options - Options and flags.
 * @returns A promise that resolves the result of the temporary file or directory path.
 */
export async function mkTemp(options?: TempOptions): AsyncIOResult<string> {
    const {
        isDirectory = false,
    } = options ?? {};

    const path = generateTempPath(options);
    const res = await (isDirectory ? mkdir : createFile)(path);

    return res.and(Ok(path));
}

/**
 * Delete the temporary directory and all its contents.
 * @returns A promise that resolves to an `AsyncVoidIOResult` indicating whether the temporary directory was successfully deleted.
 */
export function deleteTemp(): AsyncVoidIOResult {
    return remove(TMP_DIR);
}

/**
 * Prune the temporary directory and delete all expired files.
 * @param expired - The date to determine whether a file is expired.
 * @returns A promise that resolves to an `AsyncVoidIOResult` indicating whether the temporary directory was successfully pruned.
 */
export async function pruneTemp(expired: Date): AsyncVoidIOResult {
    invariant(expired instanceof Date, () => `Expired must be a Date but received ${ expired }`);

    const readDirRes = await readDir(TMP_DIR, {
        recursive: true,
    });

    return readDirRes.andThenAsync(async entries => {
        try {
            for await (const { handle } of entries) {
                if (isFileHandle(handle) && (await handle.getFile()).lastModified <= expired.getTime()) {
                    // TODO ts not support yet
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    await (handle as any).remove();
                }
            }
        } catch (e) {
            return Err(e as DOMException);
        }

        return RESULT_VOID;
    });
}
