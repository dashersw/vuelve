# vuelve

[![npm version](https://badge.fury.io/js/vuelve.svg)](https://badge.fury.io/js/vuelve)
[![Build Status](https://travis-ci.org/dashersw/vuelve.svg?branch=main)](https://travis-ci.org/dashersw/vuelve)
[![Coverage Status](https://coveralls.io/repos/github/dashersw/vuelve/badge.svg)](https://coveralls.io/github/dashersw/vuelve)
[![dependencies Status](https://david-dm.org/dashersw/vuelve/status.svg)](https://david-dm.org/dashersw/vuelve)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/dashersw/vuelve/main/LICENSE)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdashersw%2Fvuelve.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdashersw%2Fvuelve?ref=badge_shield)

Vuelve allows you to create declarative composables in Vue 3.

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

Before we start, let's have a look at an example that uses the canonical Composition API. The following example is taken from the [Composition API Introduction in Vue.js documentation](https://v3.vuejs.org/guide/composition-api-introduction.html).

`useUserRepositories.vue` (The composable)

```js
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch } from 'vue'

export default function useUserRepositories(user) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)
  watch(user, getUserRepositories)

  return {
    repositories,
    getUserRepositories,
  }
}
```

`UserRepositories.vue` (The component that uses the composable)

```js
import useUserRepositories from './useUserRepositories'
import { toRefs } from 'vue'

export default {
  props: { user: String },
  setup(props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    return { repositories }
  },
}
```

Now let's see how we can improve this imperative, single-scope code in the composable.

`useUserRepositories.js`

```js
import { fetchUserRepositories } from '@/api/repositories'

// use the native export syntax instead of returning variables
export const repositories = []
// exported variables are automatically converted to refs, so no need to explicitly declare refs

export async function getUserRepositories() {
  // access props and exported variables on the this object
  this.repositories.value = await fetchUserRepositories(user.value)
}

export default {
  props: ['user'], // declare your parameters as props
  mounted: getUserRepositories, // easily declare your lifecycle hooks
  watch: {
    user: getUserRepositories,
  },
}
```

Here we make use of the `export` keyword instead of arbitrary return statements, and we have real scope in the module where we clearly differentiate between the variables and functions we export, local variables, reactive variables, and lifecycle hooks. Notice how we didn't have to pollute our application logic with imperative lifecycle calls, but were able to separate them. Also notice that our composable is now free of its Vue dependency and is a plain JavaScript file. Theoretically, this allows us to easily migrate this composable to another environment.

Now let's have a look at how we can use this in our component.

`UserRepositories.vue`

```js
// import Vuelve in your component
import vuelve from 'vuelve'
// import the composable using the "* as" syntax
import { * as useUserRepositories } from './useUserRepositories'
import { toRefs } from 'vue'

export default {
  props: { user: String },
  setup() {
    const { user } = toRefs(props)

    // use Vuelve on the composable
    const { repositories, getUserRepositories } = vuelve(useUserRepositories)(user)

    return { repositories }
  }
}
```

Here you can see that we had to slightly change how we import our composable and how we convert it back to the regular Composition API with Vuelve.

One might want to hide the complexity of importing and using Vuelve in one's components, and might want to prefer to tuck this complexity inside the composable. This approach also has the added benefit of being a drop-in replacement for the Composition API.

In order to allow this, Vuelve supports two additional syntaxes. In the future we wish to settle on one syntax, but before that we'd like to see which syntax the community adopts.

### Syntax 2

`useUserRepositories.js`

```js
import vuelve from 'vuelve'

import { fetchUserRepositories } from '@/api/repositories'

// declare the variable locally
const repositories = []

async function getUserRepositories() {
  // access props and returned variables on the this object
  this.repositories.value = await fetchUserRepositories(user.value)
}

export default vuelve({
  props: ['user'], // declare your parameters as props
  mounted: getUserRepositories, // easily declare your lifecycle hooks
  watch: {
    user: getUserRepositories,
  },
  returns: { repositories, getUserRepositories }, // define your returns declaratively
})
```

`UserRepositories.vue`

```js
import useUserRepositories from './useUserRepositories'
import { toRefs } from 'vue'

export default {
  props: { user: String },
  setup(props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    return { repositories }
  },
}
```

As you can see, `UserRepositories.vue` is exactly the same as the original version that uses the composable made with Composition API. In this case, Vuelve composables are a drop-in replacement.

If you don't prefer `returns` keyword in your composables, Vuelve supports a third syntax:

### Syntax 3

`useUserRepositories.js`

```js
import vuelve from 'vuelve'

import { fetchUserRepositories } from '@/api/repositories'

// declare the variable locally
const repositories = []

async function getUserRepositories() {
  // access props and returned variables on the this object
  this.repositories.value = await fetchUserRepositories(user.value)
}

export default vuelve(
  {
    props: ['user'], // declare your parameters as props
    mounted: getUserRepositories, // easily declare your lifecycle hooks
    watch: {
      user: getUserRepositories,
    },
  },
  { repositories, getUserRepositories } // define your returns declaratively)
)
```

Notice here that the returns object is passed as the second parameter to Vuelve.

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
