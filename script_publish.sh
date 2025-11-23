#!/bin/sh

PKG=$1
FULL_PKG="@anylab/${PKG}"

cd packages/$PKG
yarn workspace $FULL_PKG build
yarn npm publish --access=public
