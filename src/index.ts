/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
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
  Ref,
} from 'vue'
import cloneDeep from 'lodash.clonedeep'
import { isArray, isFunction } from './utils.ts'
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
  Args extends any[] = any[]
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
  Args extends any[] = any[]
>(
  composable: DeepApplyThisType<
    ComposableWithoutProps<Props, Data, Computed, Methods>,
    ComposableContext<Props, Data, Computed, Methods, Args>
  >
): (...args: Args) => ComposableReturn<Data, Computed, Methods, Args>

function vuelve<
  Props extends string,
  Data,
  Computed extends ComputedOptions,
  Methods extends MethodOptions,
  Args extends any[]
>(
  composable: DeepApplyThisType<
    ComposableArrayProps<Props, Data, Computed, Methods>,
    ComposableContext<Props, Data, Computed, Methods, Args>
  >
): (...args: Args) => ComposableReturn<Data, Computed, Methods, Args>

function vuelve<
  Props = {},
  Data = {},
  Computed extends ComputedOptions = {},
  Methods extends MethodOptions = {},
  Args extends any[] = any[]
>(
  composable: DeepApplyThisType<
    ComposableObjectProps<Props, Data, Computed, Methods>,
    ComposableContext<Props, Data, Computed, Methods, Args>
  >
): (...args: Args) => ComposableReturn<Data, Computed, Methods, Args>

function vuelve<
  PropNames extends string = string,
  Props = {},
  Data = {},
  Computed extends ComputedOptions = {},
  Methods extends MethodOptions = {},
  Args extends any[] = any[]
>(composable: Composable<PropNames, Props, Data, Computed, Methods, Args>) {
  return function setup(...args: Args) {
    let props = {} as Record<string, Ref<any>>
    let data = {} as Record<string, Ref<any>>
    let methods = {} as Record<string, Function>
    let computeds = {} as Record<string, ComputedRef<any>>

    const context = {} as ComposableContext<any, any, any, any, any>

    if (composable.props) {
      const isComposablePropsArray = isArray(composable.props)
      const propKeys = isComposablePropsArray ? composable.props : Object.keys(composable.props)
      const getPropType = (key: number) => Object.values(composable.props as object)[key] as Function

      args?.forEach((arg, i) => {
        if (isComposablePropsArray) {
          /*
            For like this:
            const composable = vuelve({
              props: ['count'],
            })
          */
          const propName = (composable.props as string[])[i]

          if (propName) {
            props = {
              ...props,
              [propName]: arg,
            }
          }
        } else {
          /*
            For like this:
            const composable = vuelve({
              props: {
                count: Number,
              },
            })
          */
          const propKey = (propKeys as string[])[i]
          const propType = getPropType(i)

          // Check argument type is correct
          if (propKey && propType) {
            if (arg.constructor.name !== propType.name) {
              throw new TypeError(
                `Invalid prop: type check failed for prop "${propKey}". Expected ${propType?.name}, got ${arg.constructor.name}`
              )
            }

            props = {
              ...props,
              [propKey]: arg,
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
          data = {
            ...data,
            [key]: refValue,
          }
        })
      }
    }

    Object.assign(context, data, props)

    if (composable.methods) {
      Object.entries(composable.methods).forEach(([methodName, methodHandler]) => {
        methods = {
          ...methods,
          [methodName]: methodHandler.bind(context),
        }
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
          computeds = {
            ...computeds,
            [key]: computed(composableComputedFunction.bind(context)),
          }
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
