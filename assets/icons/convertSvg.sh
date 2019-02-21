#!/bin/bash

INPUT="app.svg"

OUTPUT_NAME="app"
OUTPUT_SIZE=(16 24 32 48 64 96 128 256 512)
OUTPUT_SIZE_ICONSET=(16 32 128 256 512 1024)
OUTPUT_ICONSET="${OUTPUT_NAME}.iconset"

INKSCAPE_CDE=""

ICNS_INPUTS=""

for size in ${OUTPUT_SIZE[*]}; do
    if [ -f "${OUTPUT_NAME}_${size}.png" ]; then
        rm -f "${OUTPUT_NAME}_${size}.png"
    fi
    INKSCAPE_CDE=${INKSCAPE_CDE}"
    --export-png ${OUTPUT_NAME}_${size}.png -w ${size} ${INPUT}"
done

INKSCAPE_CDE=${INKSCAPE_CDE}"
    --export-png ${OUTPUT_NAME}.png -w 1024 ${INPUT}"

if [ -d ${OUTPUT_ICONSET} ]; then
    rm -Rf ${OUTPUT_ICONSET}
fi

mkdir ${OUTPUT_ICONSET}
for size in ${OUTPUT_SIZE_ICONSET[*]}; do
    retinasize=$((2*size))
    INKSCAPE_CDE=${INKSCAPE_CDE}"
    --export-png ${OUTPUT_ICONSET}/${OUTPUT_NAME}_${size}x${size}.png -w ${size} ${INPUT}"
    ICNS_INPUTS="${ICNS_INPUTS} ${OUTPUT_ICONSET}/${OUTPUT_NAME}_${size}x${size}.png"
done

echo ""
echo "Make all ${OUTPUT_NAME}*.png"
inkscape --shell <<COMMANDS
${INKSCAPE_CDE}
quit
COMMANDS

echo ""
echo "Make ${OUTPUT_NAME}.ico"
convert -background none -define 'icon:auto-resize=16,24,32,64' ${INPUT} ${OUTPUT_NAME}.ico

echo ""
echo "Make ${OUTPUT_NAME}.icns"
png2icns ${OUTPUT_NAME}.icns ${ICNS_INPUTS}

if [ -d ${OUTPUT_ICONSET} ]; then
    rm -Rf ${OUTPUT_ICONSET}
fi
