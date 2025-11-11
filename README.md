[comment]: <> (SPDX-License-Identifier: GPL-3.0)

[comment]: <> (-------------------------------------------------------------)
[comment]: <> (Copyright © 2024, 2025)
[comment]: <> (            Jiang Jie)
[comment]: <> (Copyright © 2025)
[comment]: <> (            Pellegrino Prevete)
[comment]: <> (All rights reserved)
[comment]: <> (-------------------------------------------------------------)

[comment]: <> (This program is free software: you can redistribute)
[comment]: <> (it and/or modify it under the terms of the GNU)
[comment]: <> (General Public License as published by the Free)
[comment]: <> (Software Foundation, either version 3 of the License.)

[comment]: <> (This program is distributed in the hope that it will be useful,)
[comment]: <> (but WITHOUT ANY WARRANTY; without even the implied warranty of)
[comment]: <> (MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the)
[comment]: <> (GNU General Public License for more details.)

[comment]: <> (You should have received a copy of the GNU General Public)
[comment]: <> (License along with this program.)
[comment]: <> (If not, see <https://www.gnu.org/licenses/>.)

# Use OPFS happily

[![NPM version](
  https://img.shields.io/npm/v/@themartiancompany/happy-opfs.svg)](
    https://npmjs.org/package/@themartiancompany/happy-opfs)
[![NPM downloads](
  https://badgen.net/npm/dm/@themartiancompany/happy-opfs)](
    https://npmjs.org/package/@themartiancompany/happy-opfs)

---

## [中文](README.cn.md)

---

This is a browser-compatible fs module based
on the
[Origin private file system](
  https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system)
(OPFS), which references the
[Deno Runtime File System](
  https://deno.land/api#File_System) and
[Deno @std/fs](
  https://jsr.io/@std/fs)
APIs.

## Installation

### From source

To install a locally built version of the
library run

```bash
$ make \
    all
```

An `happy-opfs-<version>.tgz` npm archive will be generated
in the root of the repository.

To install the library system-wide run

```bash
# make \
    install-npm
```

To download the library from npm run

```bash
npm \
  install \
  --save \
    "@themartiancompany/happy-opfs"
```

To install it as system package from the
[Ur](
  https://github.com/themartiancompany/ur)
run

```bash
ur \
  "nodejs-happy-opfs"
```

A mirror of the Ur universal recipe
has been made available on The Martian
Company's Github at
[`nodejs-happy-opfs-ur`](
  https://github.com/themartiancompany/nodejs-happy-opfs-ur).

## What's the OPFS

OPFS stands for *origin private file system* 
and it is a file system API for manipulating local
files in a browser environment.

## Why happy-opfs

There are significant differences between the
standard OPFS API and familiar file system APIs
based on path operations, such as Node.js and Deno.
The purpose of this project is to implement an API
similar to Deno's in the browser, allowing for
convenient file operations.

The return values of asynchronous APIs are of the
[Result](
  https://github.com/JiangJie/happy-rusty)
type, similar to Rust's `Result` enum type,
providing a more user-friendly error handling approach.

## Why Reference Deno Instead of Node.js

- The early versions of the Node.js fs API were based
  on callback syntax, although newer versions support
  Promise syntax.
  On the other hand, the Deno fs API was designed from
  the beginning with Promise syntax. Therefore, Deno has
  less historical baggage, making it a more suitable choice
  for implementing a native-compatible API.
- Deno natively supports TypeScript, while Node.js
  currently does not without the use of additional tools.

## Synchronous support

> [!NOTE]
The asynchronous interface is to be preferred
because the main thread does not provide a synchronous interface,
so in order to force the implementation of synchronous syntax,
the I/O operation needs to be moved a
[`Worker`](
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API),
and the main thread needs to be blocked until the
`Worker` completes its I/O operation, which obviously
causes performance loss.

Also since the `Worker` needs to be started first
the synchronous interface can only be used after start completion,
such that any reading and writing before that will fail.

**Please note** that in order to share data
between the main thread and the `Worker`,
`SharedArrayBuffer` needs to be used and so
two additional `HTTP Response Headers` are required for this:
`'Cross-Origin-Opener-Policy': 'same-origin'`
and
`'Cross-Origin-Embedder-Policy': 'require-corp'`,
otherwise a `ReferenceError: SharedArrayBuffer is not defined`
error will be thrown.

The headers are automatically respectively by
Parcel and Serve in the Typescript and
Javascript examples below.

## Examples

To visually inspect file system status in-browser
it is available the
[OPFS Explorer](
  https://chromewebstore.google.com/detail/acndjpgkpaclldomagafnognkcgjignd)
extension.

### Javascript

If you are looking for an example of how
to write a full computer application
composed of only Bash programs and
Node modules but which runs the
same and with zero modifications
regardless of whether it has available
for display a terminal or a browser window,
you can look at the
[Ahsi](
  https://github.com/themartiancompany/ahsi)
program, written using the
[Crash Javascript](
  https://github.com/themartiancompany/crash-js)
and
[Crash Bash](
  https://github.com/themartiancompany/crash-bash)
libraries.

Refer to the Ahsi repository for more information
about installing and running it.

### Typescript

Typescript asynchronous
([tests/async.ts](
  tests/async.ts))
and synchronous examples 
([tests/sync.ts](
  tests/sync.ts))
are made available in the `tests` directory.

To build them and make them available in an
HTTP server run

```bash
npm \
  run \
    start
```

then open
[https://localhost:8443/](
  https://localhost:8443/)
in your browser and open the developer
tools to observe the console output.

## Documentation

Module API is in the
[docs](
  docs/README.md)
directory.

## License

This software repository, based on
[Happy OPFS](
  https://github.com/JianJie/happy-opfs)
by Jian Jie is released by Pellegrino Prevete
under the terms of the GNU General Public License version 3.
