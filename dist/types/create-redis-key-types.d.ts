import { Path_GetFirstPart, Path_GetRest, JoinStringArray, JoinStringArrayMax10, Prev } from './object-utils';
export declare type RedisKeyParam<Name extends string = string> = {
    name: Name;
    validator?: (value: string | RegExp) => boolean;
};
export declare type RedisKeyTemplateArrayElements = string | RedisKeyParam;
export declare type RedisKeyTemplateArray = Array<string | RedisKeyParam>;
export declare type RedisKeyScope = {
    SCOPE_FIRST_PART: RedisKeyTemplateArray;
    [key: string]: ScopeOrKeyTemplate;
};
export declare type ScopeOrKeyTemplate = RedisKeyTemplateArray | RedisKeyScope;
export declare type RedisKeyTemplateString<T extends string> = T;
export declare type ScopeToKeys<T extends Record<string, any>, X extends Record<string, any> = T, AggregatedPath extends string = '', D extends number = 10> = [D] extends [never] ? never : 'SCOPE_FIRST_PART' extends keyof T ? {
    [K in Exclude<keyof T, 'SCOPE_FIRST_PART'>]: K extends string ? 'SCOPE_FIRST_PART' extends keyof T[K] ? ScopeToKeys<T[K], X, `${AggregatedPath extends '' ? '' : `${AggregatedPath}.`}${K}`> : RedisKeyTemplateFromPath2<X, `${AggregatedPath extends '' ? '' : `${AggregatedPath}.`}${K}`> : never;
} : never;
export declare type getRedisKeyParamsFromTemplateString<T extends string, _D extends number = 10> = T extends `${string}%${infer ParamName}%${infer Rest}` ? [ParamName, ...getRedisKeyParamsFromTemplateString<Rest>] : [];
export declare type getRequiredParamsFromTemplateString<T extends string> = T extends `${string}%${infer _ParamName}%${infer _Rest}` ? {
    [K in getRedisKeyParamsFromTemplateString<T>[number]]: string;
} : null;
export declare type RedisKeyTemplateFromPath1<KeyRegistry extends Record<string, any>, Path extends string, PathFirst_ObjType = TypeOfPathObject<KeyRegistry, Path_GetFirstPart<Path>>> = PathFirst_ObjType extends 'scope' ? `${JoinKeyTemplate<KeyRegistry[Path_GetFirstPart<Path>]['SCOPE_FIRST_PART']>}:${RedisKeyTemplateFromPath1<KeyRegistry[Path_GetFirstPart<Path>], Path_GetRest<Path>>}` : PathFirst_ObjType extends 'leaf' ? `${JoinKeyTemplate<KeyRegistry[Path_GetFirstPart<Path>]>}` : never;
export declare type RedisKeyTemplateFromPath2<KeyRegistry extends Record<string, any>, Path extends string> = KeyRegistry['SCOPE_FIRST_PART'] extends readonly any[] ? `${JoinStringArray<KeyRegistry['SCOPE_FIRST_PART']> extends '' ? '' : `${JoinStringArray<KeyRegistry['SCOPE_FIRST_PART']>}:`}${RedisKeyTemplateFromPath1<KeyRegistry, Path>}` : never;
export declare type JoinKeyTemplate<arr extends readonly RedisKeyTemplateArrayElements[]> = arr['length'] extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 ? `${JoinStringArrayMax10<StringArrayify<arr, 10>>}` : never;
export declare type GetRedisKeyParamName<T> = T extends RedisKeyParam<infer Name> ? Name : never;
export declare type StringArrayify<T extends readonly RedisKeyTemplateArrayElements[], D extends Prev[number] = 4> = [D] extends [never] ? never : T extends any ? TailOfArray<T> extends [] ? [makeString_StringOrRedisKeyParam<T[0]>] : T['length'] extends 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 ? readonly [
    makeString_StringOrRedisKeyParam<T[0]>,
    ...StringArrayify<TailOfArray<T>>
] : never : never;
export declare type TailOfArray<T extends readonly RedisKeyTemplateArrayElements[]> = T extends readonly RedisKeyTemplateArrayElements[] ? T extends readonly [infer _First, ...infer Rest] ? Rest : [] : [];
export declare type makeString_StringOrRedisKeyParam<T extends string | RedisKeyParam> = T extends string ? `${T}` : T extends RedisKeyParam ? `%${T['name']}%` : never;
export declare type TypeOfPathObject<obj, path extends string> = path extends keyof obj ? path extends 'SCOPE_FIRST_PART' ? 'scope-first-part' : obj[path] extends readonly RedisKeyTemplateArrayElements[] ? 'leaf' : 'scope' : 'not-key';
