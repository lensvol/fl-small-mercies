build_dist:
	mkdir -p dist
	cp src/early_sniffer.js dist/early_sniffer.js
	cp src/background.html dist/background.html
	cp -rf src/css dist/
	cp -rf src/images dist/
	npx webpack

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
	cd $(TMPDIR) && zip -r -FS $(PWD)/$(NAME)-v$(VERSION)$(SUFFIX).zip . --exclude '*.git*' -x '*.idea*' -x '*screenshot*' -x 'node-compile-cache/*'
	rm -rf $(TMPDIR)

extension: MANIFEST := "manifest.json"
extension: SUFFIX := ""
extension: assemble_zip
