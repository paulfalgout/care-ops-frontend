[![CircleCI](https://circleci.com/gh/RoundingWell/care-ops-frontend.svg?style=svg)](https://circleci.com/gh/RoundingWell/care-ops-frontend)
[![codecov](https://codecov.io/gh/RoundingWell/care-ops-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/RoundingWell/care-ops-frontend)
[![Cypress.io tests](https://img.shields.io/badge/cypress.io-tests-green.svg?style=flat-square)](https://dashboard.cypress.io/#/projects/ep9zr6/runs)

# Getting Started: Frontend

Documentation for the RoundingWell frontend can be found within `README.md` files throughout this repo.

## Dependencies & Installation

We use [npm](npmjs.com) for our package manager

### Node

You will need [Node.js](http://www.nodejs.org). It is recommended that devs [install nvm](https://github.com/creationix/nvm#install-script) the node version manager. NVM allows you to change node versions on the fly.

## Installing Project Dependencies

Then you will need to run
```
$ npm i
```

# Important Dependencies

- [Underscore](https://underscorejs.org/)
- [Backbone](https://backbonejs.org/)
- [Backbone.Radio](https://github.com/marionettejs/backbone.radio)
- [Marionette](https://marionettejs.com/)
- [Marionette.Toolkit](https://github.com/RoundingWellOS/marionette.toolkit)
  Toolkit adds the App class for an Application tree. Each App has a lifecycle and an attached state model.
  Apps are best for requesting data, packaging it and choosing the correct views to show.
  Toolkit also comes with Component for making generic encapsulated components such as datepickers or other widgets.
  In this program [Apps have been made async by default](https://github.com/RoundingWellOS/marionette.toolkit/blob/master/docs/async-app-start.md).

  A typical app will look like:

```js
  const MyApp = Toolkit.App.extend({
    onBeforeStart(options) {
      this.setView(new MyLayoutView());
      this.showChildView('header', options.headerText);
      this.showView();
    },
    beforeStart() {
      return Radio.request('entities', 'data');
    },
    onStart(options, data) {
      this.showChildView('content', new DataView({ model: data }));
    }
  });
```

Components should be configurable but not built to be extended. They can also act as a wrapper for 3rd party widgets such as jquery plugins.
A component controls a region and a view combined with a state model, providing a consistent API for interaction.

- [Backbone.Store](https://github.com/RoundingWellOS/backbone.store)
  A small but important library that ensures there is only a single instance of a model in memory. It is used for both server models and to sync state models across applications.

```js
const MyModel = Backbone.Model.extend({...});

const MyUniqueModel = Backbone.Store(MyModel);

const myUniqueModel = new MyUniqueModel({ id: '1', foo: 'bar' });
const sameModel = new MyUniqueModel({ id: '1' });
sameModel.get('foo') === 'bar'; // true

const nonUnique = new MyModel({ id: '1' });
nonUnique.get('foo') === 'bar'; // false
```

- [Store.js](https://github.com/marcuswestin/store.js#readme)
  A library for accessing localstorage across browsers

## Feature Flags

Feature Flags are intended to protect users from new code that isn't fully baked or to allow for gradual rollout.

https://github.com/RoundingWell/RWell/wiki/Feature-Flags#frontend

### Using Feature Flags

Flags are best used such that a minimal amount of changes are made when the flag is being removed.

```javascript
// Bad
function foo() {
  if (flag) {
    doNew();
  } else {
    doOld();
  }
}

// Good
function foo() {
  if (!flag) {
    doOld();
    return;
  }
  doNew();
}
```

It also may be better to duplicate larger areas of code for fewer easier to remove flags.

```javascript
// Bad
function foo() {
  if (flag) foo();
  bar();
  baz();
  if (!flag) bazinga();
  quxx();
}

// Good
function foo() {
  if (!flag) {
    bar();
    baz();
    bazinga();
    quxx();
    return;
  }

  foo();
  bar();
  baz();
  quxx();
}
```

# Code Standards

Outside of linting there are some recommendations for code standards that will help in long term maintenance.
- SASS follows a general [BEM format](http://getbem.com/). Ideally do not make deep elements, but start a new block if additional descriptors are needed.
- [Favor object composition over class inheritance](https://medium.com/javascript-scene/10-interview-questions-every-javascript-developer-should-know-6fa6bdf5ad95#.haauzmicp)
- Within reason functions should ideally accomplish one task in less than 10 lines unless logically trivial. If it is getting to big, break up the function.
- Similarly modules should ideally get no larger than 300 lines or so. This is a general guideline and not a rule.
- Use only .js- prefixed selectors if at all possible from the code. Do not use style classes, ids, or tagnames if it can be avoided.
- Utilize the ui hash on views and avoid using the $el if possible. Never use $ directly within a view. Worst case use this.$el or this.$.
- The view should have say over only the DOM inside its own template or in the case of a CollectionView sometimes its direct children. Avoid allowing deep reaching within the DOM or anything external changing the DOM besides the view itself.
- Anything AJAX should happen within the entities service only.
- Generally it is better to store state on a state model than to append a property to an instance.
- Events and handlers should be named `verb:subject` or `context:verb:subject` based on what happened not what will happen ie:

```js
triggers: {
  'click .js-button1': 'show:modal' // bad
  'click .js-button2': 'click:button2' // good
},
childViewTriggers: {
  'click:button': 'button:clicked', // bad
  'click:button': 'listItem:click:button' //good
},
onShowModal() {
  console.log('The naming of this handler suggest a modal was just shown');
},
onClickButton2() {
  this.showModal(); // It's ok for a handler to simply call a single action
}
```

Use guards to handle the exception on functions when possible ie:

```js
// Good
doFoo(options) {
  if (!options.bar) {
    this.doSomethingElse();
    return;
  }

  return 'Foo:' + options.bar;
}

// Bad
doFoo(options) {
  if (options.bar) {
    return 'Foo:' + options.bar
  } else {
    this.doSomethingElse()
  }
}
```

# An Open Source Culture

It is our intention to open source by default.  Ideally any generic solution can be extracted, well documented, and tested.  Open sourcing encourages better code, collaboration with outside developers, and potentially free battle-testing, bugfixes and features from the public.
- [The Case for Open Source](https://opensource.org/advocacy/case_for_business.php)
- [The Culture of Open Source](https://www.thoughtworks.com/insights/blog/culture-open-source)

## Our Libraries

Libraries for public consumption are licensed with the [MIT License](https://opensource.org/licenses/MIT).

Currently our OS projects are available mainly at https://github.com/RoundingWellOS

Each project contains its own documentation for contributions.

## Other Libraries

Additionally we actively encourage contributing to other projects.  Don't know where to start?  Look at documentation or tests for any of the libraries we use.
