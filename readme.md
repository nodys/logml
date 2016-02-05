# logml
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]

[npm-image]: https://img.shields.io/npm/v/logml.svg?style=flat
[npm-url]: https://npmjs.org/package/logml
[downloads-image]: https://img.shields.io/npm/dm/logml.svg?style=flat
[downloads-url]: https://npmjs.org/package/logml

Extract and plot logical model from graphml

## Requirements

- [Fortran](https://gcc.gnu.org/wiki/GFortranDistros)
- [NodeJS](https://nodejs.org)

## Installation

#### Fortran

**For Linux**, install [gfortran](https://gcc.gnu.org/wiki/GFortranDistros)

```bash
sudo apt-get update
sudo apt-get install gfortran
```

**For OSX**, Check that `gcc` (that comes with gfortran) has been correctly
installed. If not, install it via brew:

```bash
brew install gcc
```

#### NodeJS

Just install the last stable version from https://nodejs.org, or use [Node Version Manager](https://github.com/creationix/nvm)

#### Logml

To install logml, just run the following command :

```bash
npm install -g logml
```

Now you can use the `logml` command:

```bash
logml --help
```


## Usage

```bash
logml --help

    Usage: logml <input>

    Options:

      -h, --help             output usage information
      -V, --version          output the version number
      -d, --dolphin          Output an human readable version of the parsed graph
      -i, --iterations <n>   The number of iterations performed during a run
      -o, --output <folder>  The output folder
      -w, --watch            Watch for any changes and update the output (if input is a file)
      -v, --verbose          Print out informations on build (activate --verbose)
      -s, --server [port]    Create a plotting server (activate --verbose)
      -p, --open             Open url on start
      -f --faster            Prevent some size optimisation, faster, bigger (stronger)
      --silent               Prevent verbose mode
```

## Exemple

```bash
logml mylogicalgraph.graphml -o ./tmp -wsvp
```

---

License: [MIT](./LICENSE) - Novadiscovery

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
