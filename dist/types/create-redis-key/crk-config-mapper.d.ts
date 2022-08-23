import { Path_GetFirstPart, Path_GetRest, JoinStringArray, JoinStringArrayMax10, Prev } from '../object-utils';
import { RedisKeyTemplateArrayElements, RedisKeyParam } from './crk-redis-key-config';
export declare type ScopeToKeys<T extends Record<string, any>, X extends Record<string, any> = T, AggregatedPath extends string = '', D extends number = 10> = [D] extends [never] ? never : 'SCOPE_FIRST_PART' extends keyof T ? {
    [K in Exclude<keyof T, 'SCOPE_FIRST_PART'>]: K extends string ? 'SCOPE_FIRST_PART' extends keyof T[K] ? ScopeToKeys<T[K], X, `${AggregatedPath extends '' ? '' : `${AggregatedPath}.`}${K}`> : RedisKeyTemplateString_FromPath__Main<X, `${AggregatedPath extends '' ? '' : `${AggregatedPath}.`}${K}`> : never;
} : never;
export declare type RedisKeyTemplateString_FromPath__Main<KeyRegistry extends Record<string, any>, Path extends string> = KeyRegistry['SCOPE_FIRST_PART'] extends readonly any[] ? `${JoinStringArray<KeyRegistry['SCOPE_FIRST_PART']> extends '' ? '' : `${JoinStringArray<KeyRegistry['SCOPE_FIRST_PART']>}:`}${RedisKeyTemplateString_FromPath__FromScope<KeyRegistry, Path>}` : never;
export declare type RedisKeyTemplateString_FromPath__FromScope<KeyRegistry extends Record<string, any>, Path extends string, PathFirst_ObjType = TypeOfPathObject<KeyRegistry, Path_GetFirstPart<Path>>> = PathFirst_ObjType extends 'scope' ? `${Join_RedisKeyTemplateArray<KeyRegistry[Path_GetFirstPart<Path>]['SCOPE_FIRST_PART']>}:${RedisKeyTemplateString_FromPath__FromScope<KeyRegistry[Path_GetFirstPart<Path>], Path_GetRest<Path>>}` : PathFirst_ObjType extends 'leaf' ? `${Join_RedisKeyTemplateArray<KeyRegistry[Path_GetFirstPart<Path>]>}` : never;
export declare type Join_RedisKeyTemplateArray<arr extends readonly RedisKeyTemplateArrayElements[]> = arr['length'] extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 ? `${JoinStringArrayMax10<RedisKeyTemplateArray_ToStringArray<arr, 10>>}` : never;
export declare type RedisKeyTemplateArray_ToStringArray<T extends readonly RedisKeyTemplateArrayElements[], D extends Prev[number] = 4> = [D] extends [never] ? never : T extends any ? TailOfArray<T> extends [] ? [makeString_StringOrRedisKeyParam<T[0]>] : T['length'] extends 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 ? readonly [
    makeString_StringOrRedisKeyParam<T[0]>,
    ...RedisKeyTemplateArray_ToStringArray<TailOfArray<T>>
] : never : never;
export declare type TailOfArray<T extends readonly RedisKeyTemplateArrayElements[]> = T extends readonly RedisKeyTemplateArrayElements[] ? T extends readonly [infer _First, ...infer Rest] ? Rest : [] : [];
export declare type makeString_StringOrRedisKeyParam<T extends string | RedisKeyParam> = T extends string ? `${T}` : T extends RedisKeyParam ? `%${T['name']}%` : never;
export declare type TypeOfPathObject<obj, path extends string> = path extends keyof obj ? path extends 'SCOPE_FIRST_PART' ? 'scope-first-part' : obj[path] extends readonly RedisKeyTemplateArrayElements[] ? 'leaf' : 'scope' : 'not-key';
