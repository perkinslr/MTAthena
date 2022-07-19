#!/usr/bin/python3

import sys
import zipfile
import json
import hashlib
__license__ = 'zlib'

source = sys.argv[1]
library = sys.argv[2]
target = sys.argv[3]
if source == target:
    raise SystemExit("Cannot use the same file for source and target")


def copyCampaign(cmpgn, context, names, md5hash, libcontent, target):
    with zipfile.ZipFile(target, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as target:
        for n in names:
            with target.open(n, 'w') as f:
                with cmpgn.open(n, 'r') as s:
                    f.write(s.read())
        with target.open("libraries/libraries.json", 'w') as f:
            f.write(json.dumps(context, indent=4).encode('utf-8'))
        with target.open(f"libraries/assets/{md5hash}", 'w') as f:
            f.write(libcontent)


with open(library, 'rb') as _library:
    libcontent = _library.read()
    md5hash = hashlib.md5(libcontent).hexdigest()

with zipfile.ZipFile(library) as library:
    manifest = json.loads(library.open('library.json').read().decode('utf-8'))
    name = manifest['name']

with zipfile.ZipFile(source) as cmpgn:
    names = cmpgn.namelist()
    if 'libraries/libraries.json' in names:
        names.remove('libraries/libraries.json')
        context = json.loads(cmpgn.open('libraries/libraries.json').read().decode('utf-8'))
        libraries = context['libraries']
    else:
        libraries = []
        context = dict(libraries = libraries)
    
    for idx, lbry in enumerate(libraries):
        lib_name = lbry['details']['name']
        old_md5hash = lbry['md5Hash']
        if lib_name == name:
            print("Library already in campaign")
            if old_md5hash == md5hash:
                print("Library already up to date")
                raise SystemExit(0)
            else:
                print("Updating library")
                names.remove(f"libraries/assets/{old_md5hash}")
                libraries[idx]['details'] = manifest
                libraries[idx]['md5Hash'] = md5hash
                copyCampaign(cmpgn, context, names, md5hash, libcontent, target)
                raise SystemExit(0)
    print("Adding to library")
    libraries.append(
        dict(details=manifest,
             md5Hash=md5hash))

        
    copyCampaign(cmpgn, context, names, md5hash, libcontent, target)
    raise SystemExit(0)
