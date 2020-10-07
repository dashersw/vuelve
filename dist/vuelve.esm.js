/*
 * vuelve
 * A declarative syntax for the Composition API in Vue 3.
 * git+https://github.com/dashersw/vuelve.git
 * v0.1.0
 * MIT License
 */

import { ref, onMounted, watch, watchEffect, computed } from 'vue';
import cloneDeep from 'lodash.clonedeep';

function vuelve(composable, obj) {
  var localObj = obj;
  var localComposable = composable;

  if (!localObj && !localComposable.returns) {
    localObj = localComposable;
    localComposable = localComposable.default;
  } else {
    localObj = localObj || localComposable.returns;
  }

  var exports = Object.keys(localObj);

  var variables = {};
  var methods = {};
  var computeds = {};

  return function setup() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    args.forEach(function (arg, i) {
      variables[localComposable.props[i]] = arg;
    });

    Object.keys(localObj).forEach(function (key) {
      if (key == 'default') { return }

      // bind context variables to methods
      if (typeof localObj[key] === 'function') {
        methods[key] = localObj[key].bind(variables);
      }
      // clone data variables
      else { variables[key] = ref(cloneDeep(localObj[key])); }
    });

    if (localComposable.mounted) {
      onMounted(methods[localComposable.mounted.name]);
    }

    if (localComposable.watch) {
      Object.entries(localComposable.watch).forEach(function (ref) {
        var key = ref[0];
        var value = ref[1];

        watch(variables[key], methods[value.name]);
      });
    }

    if (localComposable.watchEffect) {
      Object.values(localComposable.watchEffect).forEach(function (value) {
        watchEffect(methods[value.name]);
      });
    }

    if (localComposable.computed) {
      Object.keys(localComposable.computed).forEach(function (key) {
        computeds[key] = computed(methods[key]);
      });
    }

    var returns = {};

    exports.forEach(function (key) {
      if (key == 'default') { return }

      if (key in variables) { returns[key] = variables[key]; }
      if (key in methods) { returns[key] = methods[key]; }
      if (key in computeds) { returns[key] = computeds[key]; }
    });

    return returns
  }
}

export default vuelve;
