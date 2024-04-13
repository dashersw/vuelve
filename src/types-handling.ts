/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ComponentObjectPropsOptions,
  ComponentOptionsWithArrayProps,
  ComponentOptionsWithObjectProps,
  ComponentOptionsWithoutProps,
  ComputedOptions,
  ComputedRef,
  ExtractPropTypes,
  MethodOptions,
  Ref,
  UnwrapRef,
} from 'vue'
import { ComposableLifecycleHook } from './lifecycle.ts'

export type Prettify<T> = { [K in keyof T]: T[K] } & {}

/**
 * Converts an array of strings to an object, each string as a key mapped to 'any' type.
 *
 * @template T - The array of strings.
 * @example
 * ```ts
 * type Props = ['title', 'count']
 * type PropsObject = ArrayToPropsObject<Props>
 * // Result: PropsObject is { title: any, count: any }
 * ```
 */
export type ArrayToPropsObject<T extends readonly string[]> = {
  [P in T[number]]: any
}

export type ComposableContext<Props, Data, Computed, Methods> = Props extends string[]
  ? ArrayToPropsObject<Props>
  : Props &
      {
        [K in keyof Methods]: Methods[K] & ((...args: any[]) => any)
      } &
      {
        [K in keyof Data]: Ref<UnwrapRef<Data[K]>>
      } &
      { [K in keyof Computed]: ComputedRef<Computed[K]> }

/**
 * Options for a vuelve function that define the props, data, computed, and methods of the component & vue3 lifecycle hooks
 */
export type ComposableOptions<Props, Data, Computed, Methods> = {
  props?: Props
  data?: Data | (() => Data)
  watch?: Record<keyof Data, (this: ComposableContext<Props, Data, Computed, Methods>, ...args: any[]) => any>
  watchEffect?: Record<string, (this: ComposableContext<Props, Data, Computed, Methods>) => any>
} & ComposableLifecycleHook<Props, Data, Computed, Methods>

/**
 * Options for a vuelve function without props
 *
 * @example
 * ```ts
 * const composable = vuelve({
 *  data() {
 *    return { count: 0 }
 *  },
 *  computed: {
 *    titleWithCount() {
 *      return `${this.title} ${this.count.value}`
 *    },
 *  },
 * })
 * ```
 */
export type ComposableWithoutProps<
  Props = {},
  Data = {},
  Computed extends ComputedOptions = {},
  Methods extends MethodOptions = {}
> = ComponentOptionsWithoutProps<any, any, Data, Computed, Methods, any, any, any, any, any, any, any, any> &
  ComposableOptions<Props, Data, Computed, Methods>

/**
 * Options for a vuelve function with props as an array of strings
 *
 * @example
 * ```ts
 * const composable = vuelve({
 *  props: ['title', 'count'],
 *  data() {
 *    return { count: 0 }
 *  },
 *  computed: {
 *    titleWithCount() {
 *      return `${this.title} ${this.count.value}`
 *    },
 *  },
 * })('Hello', 1)
 * ```
 */
export type ComposableArrayProps<
  PropNames extends string = string,
  Data = {},
  Computed extends ComputedOptions = {},
  Methods extends MethodOptions = {}
> = ComponentOptionsWithArrayProps<any, any, Data, Computed, Methods, any, any, any, any, any, any, any, any> &
  ComposableOptions<PropNames, Data, Computed, Methods>

/**
 * Options for a vuelve function with props as an object
 *
 * @example
 * ```ts
 * const composable = vuelve({
 *  props: {
 *    title: String,
 *  },
 *  data() {
 *    return { count: 0 }
 *  },
 *  computed: {
 *    titleWithCount() {
 *      return `${this.title} ${this.count.value}`
 *    },
 *  },
 * })('Count')
 * ```
 */
export type ComposableObjectProps<
  PropsOptions = ComponentObjectPropsOptions,
  Data = {},
  Computed extends ComputedOptions = {},
  Methods extends MethodOptions = {},
  Props = Prettify<Readonly<ExtractPropTypes<PropsOptions>>>
> = ComponentOptionsWithObjectProps<any, any, Data, Computed, Methods, any, any, any, any, any, any, any, any> &
  ComposableOptions<Props, Data, Computed, Methods>

/**
 * Returns the type of the return value of a vuelve function
 */
export type ComposableReturn<Data, Computed, Methods, Args> = {
  [K in keyof Data]: Ref<UnwrapRef<Data[K]>>
} &
  {
    [K in keyof Computed]: Ref<UnwrapRef<Computed[K]>>
  } &
  {
    [K in keyof Methods]: Methods[K]
  } &
  {
    [K in keyof Args]?: Args[K] extends Ref ? UnwrapRef<Args[K]> : Args[K]
  }
