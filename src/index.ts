import {
  ref,
  onMounted,
  watch,
  computed,
  watchEffect,
  ComputedRef,
  WatchSource,
  ComputedGetter,
  WatchCallback,
  WatchEffect,
} from 'vue'
import cloneDeep from 'lodash.clonedeep'

export interface Composable {
  props?: string[]
  computed?: Record<string, ComputedGetter<unknown>>
  watch?: Record<string, WatchCallback<readonly (object | WatchSource<unknown>)[]>>
  mounted?: () => unknown
  watchEffect?: Record<string, WatchEffect>
  returns?: Record<string, unknown>
  default?: Composable
}

type SetupReturn<T extends Composable, U = void> = U extends void ? (T['returns'] extends object ? T['returns'] : T) : U

export default function vuelve<T extends Composable, U = void>(
  composable: T,
  obj?: U
): (...args: unknown[]) => SetupReturn<T, U> {
  const localObj = obj || composable.returns || composable
  const localComposable = obj ? composable : composable.default || composable

  const exports = Object.keys(localObj)

  const variables: Record<string, unknown> = {}
  const methods: Record<string, () => unknown> = {}
  const computeds: Record<string, ComputedRef<unknown>> = {}

  return function setup(...args) {
    args.forEach((arg, i) => {
      if (localComposable.props) {
        variables[localComposable.props[i]] = arg
      }
    })

    Object.entries(localObj).forEach(([key, value]) => {
      if (key == 'default') return

      // bind context variables to methods
      if (typeof value === 'function') {
        methods[key] = value.bind(variables)
      }
      // clone data variables
      else variables[key] = ref(cloneDeep(value))
    })

    if (localComposable.mounted) {
      onMounted(methods[localComposable.mounted.name])
    }

    if (localComposable.watch) {
      Object.entries(localComposable.watch).forEach(([key, value]) => {
        watch(variables[key] as readonly (object | WatchSource<unknown>)[], methods[value.name])
      })
    }

    if (localComposable.watchEffect) {
      Object.values(localComposable.watchEffect).forEach(value => {
        watchEffect(methods[value.name])
      })
    }

    if (localComposable.computed) {
      Object.keys(localComposable.computed).forEach(key => {
        computeds[key] = computed(methods[key])
      })
    }

    const returns = {} as Record<string, unknown>

    exports.forEach(key => {
      if (key == 'default') return

      if (key in variables) returns[key] = variables[key]
      if (key in methods) returns[key] = methods[key]
      if (key in computeds) returns[key] = computeds[key]
    })

    return returns as SetupReturn<T, U>
  }
}
