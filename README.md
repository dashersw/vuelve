# vuelve

[![npm version](https://badge.fury.io/js/vuelve.svg)](https://badge.fury.io/js/vuelve)
[![Build Status](https://travis-ci.org/dashersw/vuelve.svg?branch=main)](https://travis-ci.org/dashersw/vuelve)
[![Coverage Status](https://coveralls.io/repos/github/dashersw/vuelve/badge.svg)](https://coveralls.io/github/dashersw/vuelve)
[![dependencies Status](https://david-dm.org/dashersw/vuelve/status.svg)](https://david-dm.org/dashersw/vuelve)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/dashersw/vuelve/main/LICENSE)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdashersw%2Fvuelve.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdashersw%2Fvuelve?ref=badge_shield)

Vuelve enables the creation of declarative composables in Vue 3, offering a smooth transition for Vue 2 codebases by emulating the Options API.

## Motivation

Composition in software is an ideal way to build scalable solutions, and it's often preferred to other methods of code sharing. However, declarative programming is a better ideal. The more we can get away from imperative programming, the easier our programs become to reason about.

Vue 2 was a great step in the right direction with its declarative Options API. Vue 3, in this regard, is a step back, because it requires you to implement all the functionality in an imperative way. You are forced to use a single scope for all your variables and methods, and even worse, to mix the declaration of your lifecycle hooks with your business logic.

We believe this leads to a confusion in bigger codebases, and a better solution can exist, merging the best of both worlds. Enter Vuelve.

## Installation

Install Vuelve via npm:

```sh
$ npm i vuelve
```

## Usage

Let's explore transitioning from the Composition API to a more declarative approach using Vuelve, using a simple useMouse composable from the [Composables guide in Vue.js documentation](https://vuejs.org/guide/reusability/composables) as our starting point.

### Original Composition API Example:

The mouse.js composable tracks mouse movements.

`mouse.js` (The composable)

```js
import { ref, onMounted, onUnmounted } from 'vue'

export default function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```

Used in `MouseTracker.vue` to display the mouse position:

```html
<script setup>
import useMouse from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

### Transforming with Vuelve:

Transform mouse.js into a declarative composable, improving maintainability and readability.

`mouse.js`

```js
import vuelve from 'vuelve'

export default vuelve({
  data: { x: 0, y: 0 },
  methods: {
    update(event) {
      this.x.value = event.pageX
      this.y.value = event.pageY
    },
  },
  mounted() {
    window.addEventListener('mousemove', this.update)
  },
  unmounted() {
    window.removeEventListener('mousemove', this.update)
  },
})
```

This transformation retains the functionality while adopting a more intuitive, Vue 2-like syntax. It facilitates a smoother development experience, particularly in larger applications where the clarity and separation of concerns offered by declarative programming can significantly reduce complexity.

Since this is a drop-in replacement, the component that uses this composable will remain the same.

## Future work

Vuelve is not complete in its support for all lifecycle hooks the Composition API provides. We are still working on adding more functionality and the goal is to support 100% of the Composition API syntax.

Since Vuelve is declarative in its nature, there will be certain tricks that you won't be able to do with Vuelve which would be possible with the raw Composition API, but this would involve depending too much on imperative order of execution, and we believe this is a bad practice.

## Contribution

We are looking for contributors actively to bring missing features of the Composition API into Vuelve. Furthermore, as the community adopts Composition API, we need to expand our examples of declarative composables.

If you would like to see a feature implemented or want to contribute a new feature, you are welcome to open an issue to discuss it and we will be more than happy to help.

If you choose to make a contribution, please fork this repository, work on a feature and submit a pull request. We offer timely and thoughtful code reviews.

## License

MIT License

Copyright (c) 2020 Armagan Amcalar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
