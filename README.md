# catalyst-toggle-mixin

[![Travis](https://img.shields.io/travis/catalyst/catalyst-toggle-mixin/master.svg?style=flat-square)](https://travis-ci.org/catalyst/catalyst-toggle-mixin)
[![David](https://img.shields.io/david/catalyst/catalyst-toggle-mixin.svg?style=flat-square)](https://david-dm.org/catalyst/catalyst-toggle-mixin)
[![David](https://img.shields.io/david/dev/catalyst/catalyst-toggle-mixin.svg?style=flat-square)](https://david-dm.org/catalyst/catalyst-toggle-mixin?type=dev)
[![npm (scoped)](https://img.shields.io/npm/v/@catalyst-elements/catalyst-toggle-mixin.svg?style=flat-square)](https://www.npmjs.com/package/@catalyst-elements/catalyst-toggle-mixin)
[![Bower not supported](https://img.shields.io/badge/bower-not_supported-red.svg?style=flat-square)]()
[![Polymer 2 not supported](https://img.shields.io/badge/Polymer_2-not_supported-red.svg?style=flat-square)]()
[![Polymer 3 support pending](https://img.shields.io/badge/Polymer_3-support_pending-yellow.svg?style=flat-square)]()

[API documentation ↗](https://catalyst.github.io/CatalystElementsBundle/#/classes/CatalystToggleMixin)

`<catalyst-toggle-mixin>` is a mixin that provides an element with toggle behavior.

## Installation

Install with npm:

```sh
npm install --save @catalyst-elements/catalyst-toggle-mixin
```

Install with yarn:

```sh
yarn add @catalyst-elements/catalyst-toggle-mixin
```

Please note that this package is not compatible with Bower.

## Usage

### As a Module (Recommend)

```js
import CatalystToggleMixin from './node_modules/@catalyst-elements/catalyst-toggle-mixin/catalyst-toggle-mixin.js';

class MyToggleElement extends CatalystToggleMixin(HTMLElement) {
  constructor() {
    super();
    // ...
  }

  // ...
}
```

### As a Script

```html
<script src="node_modules/@catalyst-elements/catalyst-toggle-mixin/catalyst-toggle-mixin.es5.min.js"></script>
<script>
  var SuperClass = window.CatalystElements.CatalystToggleMixin(HTMLElement);

  function MyToggleElement() {
    SuperClass.call(this);
    // ...
  };
  MyToggleElement.prototype = Object.create(SuperClass.prototype);
  MyToggleElement.prototype.constructor = MyToggleElement;

  // ...
</script>
```

Please note that this script has been transpiled to es5 and thus use of `custom-elements-es5-adapter.js` or an equivalent library is required. See [es5 support](https://github.com/catalyst/CatalystElements/wiki/Browser-Compatibility#es5-support) on the Catalyst Elements wiki for details.

## Contributions

Contributions are most welcome.

Please read our [contribution guidelines](./CONTRIBUTING.md).
