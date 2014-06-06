LIB = lib
SRC = src
LIB_SOURCES = $(SRC)/$(LIB)/shiorijk.coffee $(SRC)/$(LIB)/shiorijk-container.coffee $(SRC)/$(LIB)/shiorijk-shiori-parser.coffee
TARGETS = $(LIB)/shiorijk.js

all: $(TARGETS)

clean :
	rm  $(TARGETS)

$(LIB)/shiorijk.js: $(LIB_SOURCES)
	coffee -cmbj $@ $^

test:
	mocha test

doc: ../../gh-pages/doc/index.html
doc/index.html:  $(LIB_SOURCES)
	codo --name "ShioriJK" --title "ShioriJK Documentation" -o ../../gh-pages/doc src

.PHONY: test doc
