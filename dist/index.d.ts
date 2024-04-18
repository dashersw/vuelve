import { onErrorCaptured, onActivated, onDeactivated, ComputedGetter, WatchCallback, WatchSource, WatchEffect, ComputedRef, Ref } from 'vue';

declare const vue3LifecycleHooks: {
    mounted: (hook: () => any, target?: import('vue').ComponentInternalInstance | null | undefined) => false | Function | undefined;
    beforeUpdate: (hook: () => any, target?: import('vue').ComponentInternalInstance | null | undefined) => false | Function | undefined;
    updated: (hook: () => any, target?: import('vue').ComponentInternalInstance | null | undefined) => false | Function | undefined;
    beforeUnmount: (hook: () => any, target?: import('vue').ComponentInternalInstance | null | undefined) => false | Function | undefined;
    unmounted: (hook: () => any, target?: import('vue').ComponentInternalInstance | null | undefined) => false | Function | undefined;
    errorCaptured: typeof onErrorCaptured;
    renderTracked: (hook: (e: import('vue').DebuggerEvent) => void, target?: import('vue').ComponentInternalInstance | null | undefined) => false | Function | undefined;
    renderTriggered: (hook: (e: import('vue').DebuggerEvent) => void, target?: import('vue').ComponentInternalInstance | null | undefined) => false | Function | undefined;
    activated: typeof onActivated;
    deactivated: typeof onDeactivated;
    serverPrefetch: (hook: () => any, target?: import('vue').ComponentInternalInstance | null | undefined) => false | Function | undefined;
};
export type Composable = {
    [K in keyof typeof vue3LifecycleHooks]?: (this: Composable, ...args: any[]) => any;
} & {
    props?: string[];
    data?: Record<string, unknown>;
    methods?: Record<string, (...args: any[]) => any>;
    computed?: Record<string, ComputedGetter<unknown>>;
    watch?: Record<string, WatchCallback<readonly (object | WatchSource<unknown>)[]>>;
    watchEffect?: Record<string, WatchEffect>;
};
type ComposableReturn<T extends Composable> = {
    [P in keyof T['data']]?: Ref<T['data'][P]>;
} & {
    [P in keyof T['methods']]: T['methods'][P];
} & {
    [P in keyof T['computed']]: ComputedRef<(...args: any[]) => any>;
};
export default function vuelve<T extends Composable>(composable: T): (...args: any[]) => ComposableReturn<T>;
export {};
