import { ComposableArrayProps, ComposableContext, ComposableObjectProps, ComposableReturn, ComposableWithoutProps, DeepApplyThisType } from './types-handling.ts';
import { MethodOptions, ComputedOptions } from 'vue';

declare function vuelve<Props = {}, Data = {}, Computed extends ComputedOptions = {}, Methods extends MethodOptions = {}, Args extends any[] = any[]>(composable: DeepApplyThisType<ComposableWithoutProps<Props, Data, Computed, Methods>, ComposableContext<Props, Data, Computed, Methods, Args>>): (...args: Args) => ComposableReturn<Data, Computed, Methods, Args>;
declare function vuelve<Props extends string, Data, Computed extends ComputedOptions, Methods extends MethodOptions, Args extends any[]>(composable: DeepApplyThisType<ComposableArrayProps<Props, Data, Computed, Methods>, ComposableContext<Props, Data, Computed, Methods, Args>>): (...args: Args) => ComposableReturn<Data, Computed, Methods, Args>;
declare function vuelve<Props = {}, Data = {}, Computed extends ComputedOptions = ComputedOptions, Methods extends MethodOptions = MethodOptions, Args extends any[] = any[]>(composable: DeepApplyThisType<ComposableObjectProps<Props, Data, Computed, Methods>, ComposableContext<Props, Data, Computed, Methods, Args>>): (...args: Args) => ComposableReturn<Data, Computed, Methods, Args>;
export default vuelve;
