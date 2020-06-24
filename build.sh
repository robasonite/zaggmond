#!/bin/bash

# Scrub build directory first
rm -rf build/*

# Copy files
cp -r fonts build/
cp -r img build/
cp -r sounds build/
cp -r js build
cp index.html build/

# Compress game
cd build/js
terser sketch.js -c toplevel,sequences=false,drop_console=true --mangle > build.js
cp build.js sketch.js
