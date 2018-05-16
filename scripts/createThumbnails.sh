#!/usr/bin/env bash
# Purpose: Create thumbnails of images if none already exists

SCRIPT_DIRECTORY=$(cd `dirname $0` && pwd)
MEDIA_DIRECTORY=$SCRIPT_DIRECTORY/../media/orig
THUMB_DIRECTORY=$SCRIPT_DIRECTORY/../media/thumb

for IMG in $(find $MEDIA_DIRECTORY -type f -name '*.png' -or -name '*.jpg');
do
  FILE="${IMG/$MEDIA_DIRECTORY/}"
  DIR=$(dirname "${FILE}")

  mkdir -p $THUMB_DIRECTORY$DIR

  THUMB=$THUMB_DIRECTORY$FILE
  
  if [ ! -f $THUMB ]; then
    echo $FILE
    cp $IMG $THUMB
    mogrify -strip -quality 80 -filter Lanczos -resize "500x500^" "$THUMB"
  fi
done