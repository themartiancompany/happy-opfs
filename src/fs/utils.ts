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


import { join, SEPARATOR } from '@std/path/posix';
import { TMP_DIR } from './constants.ts';
import type { FileSystemFileHandleLike, FileSystemHandleLike, TempOptions } from './defines.ts';

/**
 * Generate a temporary path but not create it.
 *
 * @param options - Options and flags.
 * @returns The temporary path.
 */
export function generateTempPath(options?: TempOptions): string {
    const {
        isDirectory = false,
        basename = 'tmp',
        extname = '',
    } = options ?? {};

    const base = basename ? `${ basename }-` : '';
    const ext = isDirectory ? '' : extname;

    // use uuid to generate a unique name
    return join(TMP_DIR, `${ base }${ crypto.randomUUID() }${ ext }`);
}

/**
 * Check whether the path is a temporary path.
 * @param path - The path to check.
 * @returns `true` if the path is a temporary path otherwise `false`.
 */
export function isTempPath(path: string): boolean {
    return path.startsWith(`${ TMP_DIR }${ SEPARATOR }`);
}

/**
 * Serialize a `FileSystemHandle` to plain object.
 * @param handle - `FileSystemHandle` object.
 * @returns Serializable version of FileSystemHandle that is FileSystemHandleLike.
 */
export async function toFileSystemHandleLike(handle: FileSystemHandle): Promise<FileSystemHandleLike> {
    const { name, kind } = handle;

    if (isFileHandle(handle)) {
        const file = await handle.getFile();
        const { size, lastModified, type } = file;

        const fileHandle: FileSystemFileHandleLike = {
            name,
            kind,
            type,
            size,
            lastModified,
        };

        return fileHandle;
    }

    const handleLike: FileSystemHandleLike= {
        name,
        kind,
    };

    return handleLike;
}

/**
 * Whether the handle is a file.
 * @param handle - The handle which is a FileSystemHandle.
 * @returns `true` if the handle is a file, otherwise `false`.
 */
export function isFileHandle(handle: FileSystemHandle): handle is FileSystemFileHandle {
    return handle.kind === 'file';
}

/**
 * Whether the handle is a directory.
 * @param handle - The handle which is a FileSystemHandle.
 * @returns `true` if the handle is a directory, otherwise `false`.
 */
export function isDirectoryHandle(handle: FileSystemHandle): handle is FileSystemDirectoryHandle {
    return handle.kind === 'directory';
}

/**
 * Whether the handle is a file-like.
 * @param handle -  The handle which is a FileSystemHandleLike.
 * @returns `true` if the handle is a file, otherwise `false`.
 */
export function isFileHandleLike(handle: FileSystemHandleLike): handle is FileSystemFileHandleLike {
    return handle.kind === 'file';
}

/**
 * Gets the data of a file handle.
 * @param handle - The file handle.
 * @returns A promise that resolves to the data of the file.
 */
export async function getFileDataByHandle(handle: FileSystemFileHandle): Promise<Uint8Array> {
    const file = await handle.getFile();
    const ab = await file.arrayBuffer();
    return new Uint8Array(ab);
}
