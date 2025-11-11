// SPDX-License-Identifier: GPL-3.0-or-later

//    ----------------------------------------------------------------------
//    Copyright © 2024, 2025
//                Jiang Jie
//    Copyright © 2025
//                Pellegrino Prevete
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


import * as fs from '../src/mod.ts';

function run() {
  fs.emptyDirSync(
    fs.ROOT_DIR);
  fs.mkdirSync(
    '/happy/opfs');
  fs.writeFileSync(
    '/happy/opfs/a.txt',
    'hello opfs');
  fs.moveSync(
    '/happy/opfs/a.txt',
    '/happy/b.txt');
  fs.moveSync(
    '/happy/opfs/a.txt',
    '/happy/b.txt');
  fs.copySync(
    '/happy/opfs',
    '/happy/opfs-1');
  fs.moveSync(
    '/happy/opfs',
    '/happy/opfs-2');
  fs.moveSync(
    '/happy/op-fs',
    '/happy/op-fs-1');
  fs.writeFileSync(
    '/happy/op-fs/fs.txt',
    'hello opfs');
  fs.appendFileSync(
    '/happy/b.txt',
    new TextEncoder().encode(
          ' happy opfs'));
  const
    statRes =
      fs.statSync(
        '/happy/opfs/a.txt');
  console.assert(
    statRes.isErr());
  console.assert(
    fs.readFileSync(
      '/happy/b.txt').unwrap().byteLength === 21);
  console.assert(
    fs.readBlobFileSync(
      '/happy/b.txt').unwrap().size === 21);
  console.assert(
    fs.readTextFileSync(
      '//happy///b.txt//').unwrap() === 'hello opfs happy opfs');
  console.assert(
    fs.removeSync(
      '/happy/not/exists').isOk());
  console.assert(
    fs.removeSync(
      '/happy/opfs/exists').isOk());
  console.assert(
    fs.removeSync(
      '/happy/opfs').isOk());
  console.assert(
    !fs.existsSync(
      '/happy/opfs').unwrap());
  console.assert(
    fs.existsSync(
      '/happy/b.txt').unwrap());
  console.assert(
    fs.isFileHandleLike(
      fs.statSync(
        '/happy/b.txt').unwrap()));
  console.assert(
    fs.readJsonFileSync<string>(
      '/happy/b.txt').isErr());
  fs.emptyDirSync(
    '/not-exists');
  // Zip/Unzip
  console.assert(
    fs.zipSync(
      '/happy',
      '/happy.zip').isOk());
  console.assert(
    fs.zipSync(
      '/happy').unwrap().byteLength === fs.readFileSync(
                                          '/happy.zip').unwrap().byteLength);
  console.assert(
    fs.unzipSync(
      '/happy.zip',
      '/happy-2').isOk());
  // Temp
  fs.mkTempSync().inspect(
    path => {
      console.assert(
        path.startsWith(
          '/tmp/tmp-'));
    });
  const
    expired =
    new Date();
  fs.mkTempSync(
    { basename:
        'opfs',
      extname:
        '.txt' }).inspect(
    path => {
      console.assert(
        path.startsWith(
          '/tmp/opfs-'));
      console.assert(
        path.endsWith(
          '.txt'));
    });
  fs.mkTempSync(
    { isDirectory:
        true,
      basename:
        '' }).inspect(
    path => {
      console.assert(
        path.startsWith(
          '/tmp/'));
    });
  console.assert(
    fs.readDirSync(
      fs.TMP_DIR).unwrap().length === 3);
  fs.pruneTempSync(
    expired).inspectErr(
    err => {
      console.error(
        err);
    });
  console.assert(
    fs.readDirSync(
      fs.TMP_DIR).unwrap().length <= 2);
  fs.deleteTempSync();
  console.assert(
    ! fs.existsSync(
        fs.TMP_DIR).unwrap());
  // Copy
  fs.mkdirSync(
    '/happy/copy');
  console.assert(
    ( fs.copySync(
        '/happy/b.txt',
        '/happy-2')).isErr());
  console.assert(
    ( fs.copySync(
        '/happy',
	'/happy-copy') ).isOk());
  fs.appendFileSync(
    '/happy-copy/b.txt',
    ' copy');
  console.assert(
    ( fs.readFileSync(
        '/happy-copy/b.txt') ).unwrap().byteLength === 26);
  fs.appendFileSync(
    '/happy/op-fs-1/fs.txt',
    ' copy');
  fs.copySync(
    '/happy',
    '/happy-copy',
    { overwrite:
        false });
  console.assert(
    ( fs.readFileSync(
        '/happy-copy/b.txt') ).unwrap().byteLength === 26);
  fs.writeFileSync(
    '/todo.json',
    JSON.stringify(
      { title:
          'happy-opfs' }));
  console.assert(
    fs.readJsonFileSync<{
      title:
        string;
    }>('/todo.json').unwrap().title === 'happy-opfs');
  for ( const { path, handle } of fs.readDirSync(
                                    fs.ROOT_DIR,
                                    { recursive:
                                        true }).unwrap() ) {
    if ( fs.isFileHandleLike(
           handle) ) {
      let
        _line,
	_msg;
      _msg = [
        "Path:",
        `  ${path}`,
        "Kind:",
        `  ${handle.kind}`,
        "Name:",
        `  ${handle.name}`,
        "Type:",
        `  ${handle.type}`,
        "Size:",
        `  ${handle.size}`,
        "Last Modified:",
        `  ${handle.lastModified}`
      ]
      for ( _line of _msg ) {
        console.log(
          _line);
      }
    }
    else {
      let
        _line,
	_msg;
      _msg = [
        "Path:",
        `  ${path}`,
        "Kind:",
        `  ${handle.kind}`,
        "Name:",
        `  ${handle.name}`
      ]
      for ( _line of _msg ) {
        console.log(
          _line);
      }
    }
  }
  // Comment this line to
  // view using OPFS Explorer
  fs.removeSync(
    fs.ROOT_DIR);
}

export async function
  testSync() {
    console.log(
      'Start synchronous operations test.');
    await fs.connectSyncAgent(
      { worker:
          new Worker(
            new URL(
              'worker.ts',
              import.meta.url),
	    { type:
                'module' }),
        // SharedArrayBuffer size between main thread and worker
        bufferLength:
          10 * 1024 * 1024,
        // max wait time at main thread per operation
        opTimeout:
          3000 });
    run();
}
