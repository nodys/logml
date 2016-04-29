# Logml
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]

[npm-image]: https://img.shields.io/npm/v/logml.svg?style=flat
[npm-url]: https://npmjs.org/package/logml
[downloads-image]: https://img.shields.io/npm/dm/logml.svg?style=flat
[downloads-url]: https://npmjs.org/package/logml

Logml is a logical modelling framework based on the Boolean network theory where classic Boolean operators are replaced with fuzzy operators and where edges are  tuned  in  order  to  adapt  the  speed  and  the strength  of  the  signal  that  they transmit.

This tool is an adaptation of a methodology developed at [Novadiscovery](http://www.novadiscovery.com/) and freely accessible at:

[Poret, A., Monteiro Sousa, C., Boissel, J.-P.: Enhancing boolean networks with fuzzy operators and edge tuning.arXiv:1407.1135 (2014)](https://arxiv.org/abs/1407.1135v5)


## Installation

### Requirements

- [Fortran](https://gcc.gnu.org/wiki/GFortranDistros)
- [NodeJS](https://nodejs.org)


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

To install Logml, just run the following command :

```bash
npm install -g logml
```

Now you can use the `logml` command:

```bash
logml --help
```



## Usage

The Logml modelling and simulation tool takes a logical graph (.graphml format) as input. The tool will automatically parse the graph and generate the corresponding code. The logical model is then executed and results are plotted via a dedicated web interface.

### Logical graph

A logical graph is a special type of diagramatic structure in which entities are linked by logical relations symbolized by the logic operators: `AND`, `OR` and `NOT`.

We use for that the [yED graph editor](https://www.yworks.com/downloads#yEd) (which is freely available and runs on all major platforms), and the [following graphical ontology](test/fixtures/graphml/graphical_ontology.graphml):

![](http://nodys.github.io/logml/images/Graphical_ontology.png)

Please find bellow an example of a logical graph, which will be used throughout this tutorial:

![](http://nodys.github.io/logml/images/example.png)

In order to ensure the proper functioning of Logml tool, the following instructions must be observed carefully during the creation of the logical graph in [yED](https://www.yworks.com/products/yed).

#### Annotation of nodes

Each node of the graph (entity) need to be annotated (in yED, right click on the node > `properties` > `data`) with its qualitative initial values (integers only, and between 0 and 5). The node initial states are defined as following:

| Annotation | Meaning   |
|:-----------|:----------|
| `v0=5`     | full      |
| `v0=4`     | much more |
| `v0=3`     | much      |
| `v0=2`     | few       |
| `v0=1`     | fewer     |
| `v0=0`     | none      |

Please find below an example of node annotation:

![](http://nodys.github.io/logml/images/node-annotation.png)

#### Annotation of edges

Each edge need to be annotated (in yED, right click on the edge > `properties` > `general`) with its `p` value and its `q` value (integers only, and between 0 and 5).

+ For each edges, `p` is the portion of its value which is updated at each iteration:

| Annotation | Meaning       |
|:-----------|:--------------|
| `p=5`      | instantaneous |
| `p=4`      | faster        |
| `p=3`      | fast          |
| `p=2`      | slow          |
| `p=1`      | slower        |
| `p=0`      | down          |

+ For each edges, `q` is the the weakening of its value at each iteration:

| Annotation | Meaning |
|:-----------|:--------|
| `q=5`      | strong  |
| `q=4`      | weaker  |
| `q=3`      | weak    |
| `q=2`      | faint   |
| `q=1`      | fainter |
| `q=0`      | down    |

Please find below an example of edge annotation:

![](http://nodys.github.io/logml/images/edge-annotation.png)

#### Annotation of perturbed nodes

Identify nodes that will be the subject of a disturbance by annotating (in yED, right click on the entity > `properties` > `data`) with:

+ the strength of the disturbance applied to the node. The disturbed states will be defined as following (integers only, and between 0 and 5):

| Annotation | Meaning   |
|:-----------|:----------|
| `pwd=5`    | full      |
| `pwd=4`    | much more |
| `pwd=3`    | much      |
| `pwd=2`    | few       |
| `pwd=1`    | fewer     |
| `pwd=0`    | none      |

+ the interval of iterations at which disturbances begin and end respectively. The intervals will be defined as following (integers only, and between 0 and 100):

`int=20,60`: in this case, perturbations will start after 20% of iterations, and will stop after 60% of iterations.

An example is presented in the following screenshot:

![](http://nodys.github.io/logml/images/pert-nodes-annotation.png)

### Run Logml

```bash
logml --help

    Usage: logml <input>

    Options:

      -h, --help             Output usage information
      -V, --version          Output the version number
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
