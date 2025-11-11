# SPDX-License-Identifier: GPL-3.0-or-later

#    ----------------------------------------------------------------------
#    Copyright © 2024, 2025  Pellegrino Prevete
#
#    All rights reserved
#    ----------------------------------------------------------------------
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <https://www.gnu.org/licenses/>.

PREFIX ?= /usr/local
_PROJECT=happy-opfs
DOC_DIR=$(DESTDIR)$(PREFIX)/share/doc/$(_PROJECT)
USR_DIR=$(DESTDIR)$(PREFIX)
BIN_DIR=$(DESTDIR)$(PREFIX)/bin
LIB_DIR=$(DESTDIR)$(PREFIX)/lib/$(_PROJECT)
MAN_DIR?=$(DESTDIR)$(PREFIX)/share/man
NODE_DIR=$(PREFIX)/lib/node_modules/$(_PROJECT)
BUILD_NPM_DIR=build

_INSTALL_FILE=\
  install \
    -vDm644
_INSTALL_EXE=\
  install \
    -vDm755
_INSTALL_DIR=\
  install \
    -vdm755

DOC_FILES=\
  $(wildcard \
      *.rst) \
  $(wildcard \
      *.md)
SCRIPT_FILES=\
  $(wildcard \
      $(_PROJECT)/*)

all: build-man build-npm

check: shellcheck

shellcheck:

	shellcheck \
	  -s \
	    "bash" \
	  $(SCRIPT_FILES)

install: install-man install-npm

publish: publish-npm

build-man:

	mkdir \
	  -p \
	  "build/man"
	rst2man \
	  "man/$(_PROJECT).1.rst" \
	  "build/man/$(_PROJECT).1"

build-npm:

	mkdir \
	  -p \
	  "build/man"; \
	_files=( \
	  "README.md" \
	  "README.cn.md" \
	  "COPYING" \
	  "AUTHORS.rst" \
	  "docs" \
	  "eslint.config.mjs" \
	  "jsr.json" \
	  "package.json" \
	  "rollup.config.mjs" \
	  "src" \
	  "tests" \
	  "tsconfig.json" \
	  "typedoc.json" \
	) ; \
	mkdir \
	  -p \
	  "build"; \
	rst2man \
	  "man/$(_PROJECT).1.rst" \
	  "build/man/$(_PROJECT).1"; \
	cp \
	  -r \
	  "$${_files[@]}" \
	  "build"; \
	cd \
	  "build"; \
	_version="$$( \
	  npm \
	    view \
	      "$$(pwd)" \
	      "version")"; \
        npm \
	  install; \
	npm \
	  run \
	    "build"; \
	rm \
	  -rf \
	  "node_modules"; \
	npm \
	  pack; \
	mv \
	  "$(_PROJECT)-$${_version}.tgz" \
	  ".."

install-npm:

	_npm_opts=( \
	  -g \
	  --prefix \
	    "$(USR_DIR)" \
	); \
	_version="$$( \
	  npm \
	    view \
	      "$$(pwd)" \
	      "version")"; \
	npm \
	  install \
	    "$${_npm_opts[@]}" \
	    "$(_PROJECT)-$${_version}.tgz"; \
	$(_INSTALL_DIR) \
	  "$(DESTDIR)$(PREFIX)/lib"; \
	ln \
	  -s \
	  "$(NODE_DIR)" \
	  "$(LIB_DIR)" || \
	true

publish-npm:

	cd \
	  "build"; \
	npm \
	  publish \
	  --access \
	    "public"

install-man:

	$(_INSTALL_DIR) \
	  "$(MAN_DIR)/man1"
	rst2man \
	  "man/$(_PROJECT).1.rst" \
	  "$(MAN_DIR)/man1/$(_PROJECT).1"

.PHONY: check build-man build-npm install install-man install-npm publish-npm shellcheck
