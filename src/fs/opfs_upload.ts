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


import { fetchT, type FetchResponse, type FetchTask } from '@happy-ts/fetch-t';
import { basename } from '@std/path/posix';
import { Err } from 'happy-rusty';
import { assertFileUrl } from './assertions.ts';
import type { UploadRequestInit } from './defines.ts';
import { createAbortError } from './helpers.ts';
import { readBlobFile } from './opfs_ext.ts';

/**
 * Uploads a file from the specified path to a URL.
 *
 * @param filePath - The path of the file to upload.
 * @param fileUrl - The URL where the file will be uploaded.
 * @param requestInit - Optional request initialization parameters.
 * @returns A promise that resolves to an `AsyncIOResult` indicating whether the file was successfully uploaded.
 */
export function uploadFile(filePath: string, fileUrl: string, requestInit?: UploadRequestInit): FetchTask<Response> {
    type T = Response;

    assertFileUrl(fileUrl);

    let aborted = false;

    let fetchTask: FetchTask<T>;

    const response = (async (): FetchResponse<T> => {
        const fileRes = await readBlobFile(filePath)

        return fileRes.andThenAsync(async file => {
            // maybe aborted
            if (aborted) {
                return Err(createAbortError());
            }

            const {
                // default file name
                filename = basename(filePath),
                ...rest
            } = requestInit ?? {};

            const formData = new FormData();
            formData.append(filename, file, filename);

            fetchTask = fetchT(fileUrl, {
                method: 'POST',
                ...rest,
                abortable: true,
                body: formData,
            });

            return fetchTask.response;
        });
    })();

    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        abort(reason?: any): void {
            aborted = true;
            fetchTask?.abort(reason);
        },

        get aborted(): boolean {
            return aborted;
        },

        get response(): FetchResponse<T> {
            return response;
        },
    };
}
