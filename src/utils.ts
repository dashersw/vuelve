/* eslint-disable @typescript-eslint/ban-types */
import { PropType } from 'vue'
type Data = Record<string, unknown>

type DefaultFactory<T> = (props: Data) => T | null | undefined

interface PropOptions<T = any, D = T> {
  type?: PropType<T> | true | null
  required?: boolean
  default?: D | DefaultFactory<D> | null | undefined | object
  validator?(value: unknown, props: Data): boolean
}

export const isFunction = (val: unknown): val is Function => typeof val === 'function'

export const { isArray } = Array

export function isPropOptions(value: any): value is PropOptions {
  return (
    typeof value === 'object' &&
    (value.type === undefined || typeof value.type === 'function' || value.type === true || value.type === null) &&
    (value.required === undefined || typeof value.required === 'boolean') &&
    (value.default === undefined || typeof value.default === 'function' || typeof value.default === 'object') &&
    (value.validator === undefined || typeof value.validator === 'function')
  )
}
