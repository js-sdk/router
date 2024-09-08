.DEFAULT_GOAL := publishable

ENV=development

NPMFLAGS?=

CHECK_VERSION=`bash ./maintainance.bash`

.PHONY: build
build:
	npx swc ./index.js --env-name $(ENV) -o main.js

check-version:
	@if [ "$(CHECK_VERSION)" = "1" ]; then \
		echo "invalid version."; exit 1; \
	fi

.PHONY: all
all: build
	@echo "$(CHECK_VERSION)"

.PHONY: test
test: all
	npx jest test.js $(NPMFLAGS)

.PHONY: dev
dev:
	NPMFLAGS="--watchAll" make -C . -k test

publishable: test check-version build
