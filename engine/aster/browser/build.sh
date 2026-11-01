#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../../.."
# Validated with Emscripten 3.1.6 / Clang 15. Generated output is committed so
# ordinary Sites builds do not install or invoke a compiler toolchain.
python engine/aster/browser/reference.py
em++ -std=c++20 -O2 -s DISABLE_EXCEPTION_CATCHING=0 \
 -s MODULARIZE=1 -s EXPORT_ES6=1 -s EXPORT_NAME=createAster \
 -s ENVIRONMENT=web,worker,node -s ALLOW_MEMORY_GROWTH=1 \
 -s MAXIMUM_MEMORY=67108864 \
 -s EXPORTED_FUNCTIONS='["_replay","_malloc","_free"]' \
 -s EXPORTED_RUNTIME_METHODS='["UTF8ToString"]' \
 -Iengine/aster/include engine/aster/src/book.cpp engine/aster/src/itch.cpp \
 engine/aster/browser/adapter.cpp -o public/aster/engine.js
node tests/aster-wasm.mjs
