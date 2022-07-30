build_dist:
	mkdir -p dist
	cp src/background.html dist/background.html
	cp -rf src/css dist/
	cp -rf src/images dist/
	tsc --pretty --project .

clean:
	rm -rf dist

assemble_zip:	TMPDIR := $(shell mktemp -d 2>/dev/null || mktemp -d -t 'mytmpdir')
assemble_zip:	VERSION := $(shell jq .version package.json)
assemble_zip:	NAME := $(shell jq .name package.json)
assemble_zip:	PWD := $(shell pwd)

assemble_zip: build_dist
	cp -rf dist $(TMPDIR)
	cp $(MANIFEST) $(TMPDIR)/manifest.json
	cp -rf images $(TMPDIR)
	cp LICENSE $(TMPDIR)
	cd $(TMPDIR) && zip -r -FS $(PWD)/$(NAME)-v$(VERSION)$(SUFFIX).zip . --exclude '*.git*' -x '*.idea*' -x '*screenshot*'
	rm -rf $(TMPDIR)

extension_v2: MANIFEST := "manifest.json"
extension_v2: SUFFIX := ""
extension_v2: assemble_zip

extension_v3: MANIFEST := "manifest_v3.json"
extension_v3: SUFFIX := "_chrome"
extension_v3: assemble_zip