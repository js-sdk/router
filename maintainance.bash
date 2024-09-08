#!/bin/bash

VERBOSE=1

case $1 in
    -v) VERBOSE=0;;
esac

last_version() {
    git describe --tags --abbrev=0
};

last_version_hash() {
    last_version | xargs -ITAG git log -1 --format="%H" TAG
}

current_hash() {
    git log -1 --format="%H"
}

log() {
    test $VERBOSE -eq "0" && echo $1
}

if test "`last_version_hash`" != "`current_hash`"; then
    log "missing version bump.";
    echo 1;
else
    log "releasable.";
    echo 0;
fi
