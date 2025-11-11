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


import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const
  input =
    'src/mod.ts';

/**
 * @type {import('rollup').ExternalOption}
 */
const
  external = [
    /^@std\/path/,
    'happy-rusty',
    'tiny-invariant',
    '@happy-ts/fetch-t',
    'tiny-future',
    'fflate/browser',
  ];

/**
 * @type {import('rollup').RollupOptions[]}
 */
export default [
  { input,
    plugins: [
      esbuild(
        { target:
            'esnext'}),
    ],
    output: [
      { file:
          'dist/main.cjs',
        format:
          'cjs',
        sourcemap:
          true },
      { file:
          'dist/main.mjs',
        format:
          'esm',
        sourcemap:
          true },
    ],
    external,
    treeshake:
      'smallest' },
  { input,
    plugins: [
      dts(),
    ],
    output:
      { file:
          'dist/types.d.ts',
        format:
          'esm',
        sourcemap:
          true },
      external,
      treeshake:
        'smallest' },
];
