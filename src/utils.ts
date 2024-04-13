/* eslint-disable @typescript-eslint/ban-types */
export const isFunction = (val: unknown): val is Function => typeof val === 'function'

export const { isArray } = Array
