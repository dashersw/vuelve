/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import {
  ref,
  watch,
  computed,
  watchEffect,
  WatchCallback,
  WatchEffect,
  ComputedRef,
  MethodOptions,
  ComputedOptions,
  ComponentObjectPropsOptions,
  Ref,
} from 'vue'
import cloneDeep from 'lodash.clonedeep'
import { isArray, isFunction, isPropOptions } from './utils.ts'
import {
  ComposableArrayProps,
  ComposableContext,
  ComposableObjectProps,
  ComposableReturn,
  ComposableWithoutProps,
  DeepApplyThisType,
} from './types-handling.ts'
import { vue3LifecycleHooks } from './lifecycle.ts'

type Composable<
  PropNames extends string,
  Props = {},
  Data = {},
  Computed extends ComputedOptions = ComputedOptions,
  Methods extends MethodOptions = MethodOptions,
  Args extends Record<string, any> = Record<string, any>
> =
  | DeepApplyThisType<
      ComposableWithoutProps<Props, Data, Computed, Methods>,
      ComposableContext<Props, Data, Computed, Methods, Args>
    >
  | DeepApplyThisType<
      ComposableArrayProps<PropNames, Data, Computed, Methods>,
      ComposableContext<Props, Data, Computed, Methods, Args>
    >
  | DeepApplyThisType<
      ComposableObjectProps<Props, Data, Computed, Methods>,
      ComposableContext<Props, Data, Computed, Methods, Args>
    >
function vuelve<
  Props = {},
  Data = {},
  Computed extends ComputedOptions = {},
  Methods extends MethodOptions = {},
  Args extends Record<string, any> = Record<string, any>
>(
  composable: DeepApplyThisType<
    ComposableWithoutProps<Props, Data, Computed, Methods>,
    ComposableContext<Props, Data, Computed, Methods, Args>
  >
): (args?: Args) => ComposableReturn<Data, Computed, Methods, Args>

function vuelve<
  Props extends string,
  Data,
  Computed extends ComputedOptions,
  Methods extends MethodOptions,
  Args extends Record<string, any> = Record<string, any>
>(
  composable: DeepApplyThisType<
    ComposableArrayProps<Props, Data, Computed, Methods>,
    ComposableContext<Props, Data, Computed, Methods, Args>
  >
): (args?: Args) => ComposableReturn<Data, Computed, Methods, Args>

function vuelve<
  Props extends ComponentObjectPropsOptions = {},
  Data = {},
  Computed extends ComputedOptions = {},
  Methods extends MethodOptions = {},
  Args extends Record<string, any> = Record<string, any>
>(
  composable: DeepApplyThisType<
    ComposableObjectProps<Props, Data, Computed, Methods>,
    ComposableContext<Props, Data, Computed, Methods, Args>
  >
): (args?: Args) => ComposableReturn<Data, Computed, Methods, Args>

function vuelve<
  PropNames extends string = string,
  Props = {},
  Data = {},
  Computed extends ComputedOptions = {},
  Methods extends MethodOptions = {},
  Args extends Record<string, any> = Record<string, any>
>(composable: Composable<PropNames, Props, Data, Computed, Methods, Args>) {
  return function setup(args?: Args) {
    const props = {} as Record<string, Ref<any> | undefined>
    const data = {} as Record<string, Ref<any>>
    const methods = {} as Record<string, Function>
    const computeds = {} as Record<string, ComputedRef<any>>

    const context = {} as ComposableContext<any, any, any, any, any>

    if (composable.props) {
      const isComposablePropsArray = isArray(composable.props)
      const propKeys = isComposablePropsArray ? Object.values(composable.props) : Object.keys(composable.props)

      propKeys.forEach(propKey => {
        if (isComposablePropsArray) {
          /*
            For like this:
            const composable = vuelve({
              props: ['count'],
            })
          */
          if (args && args[propKey]) {
            props[propKey] = args[propKey]
          }
        } else {
          const prop = (composable.props as Record<string, any>)[propKey]

          if (isPropOptions(prop)) {
            /*
            For like this:
              const composable = vuelve({
                props: {
                  count: {
                    type: Number,
                    default: 0,
                  },
                },
              })
            */
            if (args && args[propKey]) {
              if (!prop.type || prop.type === true) {
                // If prop type is not defined, then we can't check the type
                props[propKey] = args[propKey]
              } else if (typeof prop.type == 'function') {
                // If prop type is defined, then we can check the type and throw an error if it's not the same
                if (prop.type.name === args[propKey].constructor.name) {
                  props[propKey] = args[propKey]
                } else {
                  throw new TypeError(
                    `Invalid prop: type check failed for prop "${propKey}". Expected ${prop.type?.name}, got ${args[propKey].constructor.name}`
                  )
                }
              }
            } else if (prop.default) {
              // If prop is not provided, then we can use the default value
              const defaultValue = isFunction(prop.default) ? prop.default() : prop.default
              props[propKey] = defaultValue
            } else if (prop.required) {
              // If prop is required but not provided, then we throw an error
              throw new Error(`${propKey} is required but not provided.`)
            }
          }

          if (!isPropOptions(prop)) {
            /*
              For like this:
              const composable = vuelve({
                props: {
                  count: Number,
                },
              })
            */

            if (args && args[propKey]) {
              if (prop.name === args[propKey].constructor.name) {
                props[propKey] = args[propKey]
              } else {
                throw new TypeError(
                  `Invalid prop: type check failed for prop "${propKey}". Expected ${prop.name}, got ${args[propKey].constructor.name}`
                )
              }
            }
          }
        }
      })
    }

    if (composable.data) {
      if (isFunction(composable.data)) {
        const dataObject = (composable.data as Function)()

        Object.entries(dataObject).forEach(([key, value]) => {
          const refValue = ref(cloneDeep(value))
          data[key] = refValue
        })
      }
    }

    Object.assign(context, data, props)

    if (composable.methods) {
      Object.entries(composable.methods).forEach(([methodName, methodHandler]) => {
        methods[methodName] = methodHandler.bind(context)
      })
    }

    Object.assign(context, methods)

    Object.entries(vue3LifecycleHooks).forEach(([lifecycleHookName, vue3LifecycleHook]) => {
      const lifecycleHookNameKey = lifecycleHookName as keyof typeof vue3LifecycleHooks

      if (composable[lifecycleHookNameKey]) {
        const composableFunction = composable[lifecycleHookNameKey] as Function
        vue3LifecycleHook((...lifecycleArgs: any[]) => composableFunction.apply(context, lifecycleArgs))
      }
    })

    if (composable.watch) {
      Object.entries(composable.watch).forEach(([key, value]) => {
        const watchCallback = value as WatchCallback

        const watchedData = context[key]

        if (watchedData) {
          watch(watchedData, watchCallback.bind(context))
        }
      })
    }

    if (composable.watchEffect) {
      Object.values(composable.watchEffect).forEach(value => {
        const watchEffectFunction = value as WatchEffect
        watchEffect(watchEffectFunction.bind(context))
      })
    }

    if (composable.computed) {
      Object.keys(composable.computed).forEach(key => {
        const composableComputedFunction =
          composable.computed && (composable.computed[key as keyof typeof composable.computed] as Function)
        if (composableComputedFunction) {
          computeds[key] = computed(composableComputedFunction.bind(context))
        }
      })
    }

    return {
      ...props,
      ...data,
      ...methods,
      ...computeds,
    } as ComposableReturn<Data, Computed, Methods, Args>
  }
}

export default vuelve
