start:
	@node irc_viewer

deps:
	@npm install

build:
	@coffee -c -o ./ src/