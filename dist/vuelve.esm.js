/*
 * vuelve
 * A declarative syntax for the Composition API in Vue 3.
 * git+https://github.com/dashersw/vuelve.git
 * v1.1.0
 * MIT License
 */

import { ref, watch, watchEffect, computed, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onErrorCaptured, onRenderTracked, onRenderTriggered, onActivated, onDeactivated, onServerPrefetch } from 'vue';
import cloneDeep from 'lodash.clonedeep';

var vue3LifecycleHooks = {
  mounted: onMounted,
  beforeUpdate: onBeforeUpdate,
  updated: onUpdated,
  beforeUnmount: onBeforeUnmount,
  unmounted: onUnmounted,
  errorCaptured: onErrorCaptured,
  renderTracked: onRenderTracked,
  renderTriggered: onRenderTriggered,
  activated: onActivated,
  deactivated: onDeactivated,
  serverPrefetch: onServerPrefetch,
};

function vuelve(composable) {
  return function setup() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var variables = {};
    var methods = {};
    var computeds = {};

    var context = {};
    args.forEach(function (arg, i) {
      variables[composable.props[i]] = arg;
    });

    Object.keys(composable.data || {}).forEach(function (key) {
      variables[key] = ref(cloneDeep(composable.data[key]));
    });

    Object.assign(context, variables);

    if (composable.methods)
      { Object.keys(composable.methods).forEach(function (key) {
        methods[key] = function () {
          var methodArgs = [], len = arguments.length;
          while ( len-- ) methodArgs[ len ] = arguments[ len ];

          return composable.methods[key].apply(context, methodArgs);
        };
      }); }

    Object.assign(context, methods);

    Object.keys(vue3LifecycleHooks).forEach(function (lifecycleHook) {
      if (composable[lifecycleHook]) {
        var vue3LifecycleHook = vue3LifecycleHooks[lifecycleHook];

        vue3LifecycleHook(function () {
          var lifecycleArgs = [], len = arguments.length;
          while ( len-- ) lifecycleArgs[ len ] = arguments[ len ];

          return composable[lifecycleHook].apply(context, lifecycleArgs);
        });
      }
    });

    if (composable.watch) {
      Object.entries(composable.watch).forEach(function (ref) {
        var key = ref[0];
        var value = ref[1];

        watch(variables[key], value);
      });
    }

    if (composable.watchEffect) {
      Object.values(composable.watchEffect).forEach(function (value) {
        watchEffect(value.bind(context));
      });
    }

    if (composable.computed) {
      Object.keys(composable.computed).forEach(function (key) {
        computeds[key] = computed(composable.computed[key].bind(context));
      });
    }

    return Object.assign({}, variables,
      methods,
      computeds)
  }
}

export default vuelve;
