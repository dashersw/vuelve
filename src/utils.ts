/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable valid-typeof */

import { PropType } from 'vue'

type Data = Record<string, unknown>

type DefaultFactory<T> = (props: Data) => T | null | undefined

interface PropOptions<T = any, D = T> {
  type?: PropType<T> | true
  required?: boolean
  default?: D | DefaultFactory<D> | null | undefined | object
  validator?(value: unknown, props: Data): boolean
}

export const isFunction = (val: unknown): val is Function => typeof val === 'function'

export const { isArray } = Array

export function isPropOptions(value: any): value is PropOptions {
  return (
    typeof value === 'object' &&
    (value.type === undefined || typeof value.type === 'function' || value.type === true) &&
    (value.required === undefined || typeof value.required === 'boolean') &&
    (value.default === undefined ||
      typeof value.default === 'function' ||
      typeof value.default === value.type.name.toLowerCase())
  )
}
