/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-mixed-spaces-and-tabs */
import {
	Path_GetFirstPart,
	Path_GetRest,
	JoinStringArray,
	JoinStringArrayMax10,
	Prev,
} from './object-utils';

export type RedisKeyParam<Name extends string = string> = {
	name: Name;
	validator?: (value: string | RegExp) => boolean;
};

export type RedisKeyTemplateArrayElements = string | RedisKeyParam;

export type RedisKeyTemplateArray = Array<string | RedisKeyParam>;

export type RedisKeyScope = {
	SCOPE_FIRST_PART: RedisKeyTemplateArray;
	[key: string]: ScopeOrKeyTemplate;
};

export type ScopeOrKeyTemplate = RedisKeyTemplateArray | RedisKeyScope;

export type RedisKeyTemplateString<T extends string> = T;

// !!!!!!!!!!!!!
export type ScopeToKeys<
	T extends Record<string, any>,
	X extends Record<string, any> = T,
	AggregatedPath extends string = '',
	D extends number = 10
> = [D] extends [never]
	? never
	: 'SCOPE_FIRST_PART' extends keyof T
	? {
			[K in Exclude<keyof T, 'SCOPE_FIRST_PART'>]: K extends string
				? 'SCOPE_FIRST_PART' extends keyof T[K]
					? ScopeToKeys<
							T[K],
							X,
							`${AggregatedPath extends '' ? '' : `${AggregatedPath}.`}${K}`
					  >
					: RedisKeyTemplateFromPath2<
							X,
							`${AggregatedPath extends '' ? '' : `${AggregatedPath}.`}${K}`
					  >
				: never;
	  }
	: never;

// * Works
export type getRedisKeyParamsFromTemplateString<
	T extends string,
	_D extends number = 10
> = T extends `${string}%${infer ParamName}%${infer Rest}`
	? [ParamName, ...getRedisKeyParamsFromTemplateString<Rest>]
	: [];
export type getRequiredParamsFromTemplateString<T extends string> =
	T extends `${string}%${infer _ParamName}%${infer _Rest}`
		? {
				[K in getRedisKeyParamsFromTemplateString<T>[number]]: string;
		  }
		: null;

// * Works
export type RedisKeyTemplateFromPath1<
	KeyRegistry extends Record<string, any>,
	Path extends string,
	PathFirst_ObjType = TypeOfPathObject<KeyRegistry, Path_GetFirstPart<Path>>
> = PathFirst_ObjType extends 'scope'
	? `${JoinKeyTemplate<
			KeyRegistry[Path_GetFirstPart<Path>]['SCOPE_FIRST_PART']
	  >}:${RedisKeyTemplateFromPath1<
			KeyRegistry[Path_GetFirstPart<Path>],
			Path_GetRest<Path>
	  >}`
	: PathFirst_ObjType extends 'leaf'
	? `${JoinKeyTemplate<KeyRegistry[Path_GetFirstPart<Path>]>}`
	: never;

// * Works
export type RedisKeyTemplateFromPath2<
	KeyRegistry extends Record<string, any>,
	Path extends string
> = KeyRegistry['SCOPE_FIRST_PART'] extends readonly any[]
	? `${JoinStringArray<KeyRegistry['SCOPE_FIRST_PART']> extends ''
			? ''
			: `${JoinStringArray<
					KeyRegistry['SCOPE_FIRST_PART']
			  >}:`}${RedisKeyTemplateFromPath1<KeyRegistry, Path>}`
	: never;

export type JoinKeyTemplate<
	arr extends readonly RedisKeyTemplateArrayElements[]
> = arr['length'] extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
	? `${JoinStringArrayMax10<StringArrayify<arr, 10>>}`
	: never;

// * Works
export type GetRedisKeyParamName<T> = T extends RedisKeyParam<infer Name>
	? Name
	: never;

// * Works
export type StringArrayify<
	T extends readonly RedisKeyTemplateArrayElements[],
	D extends Prev[number] = 4
> = [D] extends [never]
	? never
	: T extends any
	? TailOfArray<T> extends []
		? [makeString_StringOrRedisKeyParam<T[0]>]
		: T['length'] extends 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
		? readonly [
				makeString_StringOrRedisKeyParam<T[0]>,
				...StringArrayify<TailOfArray<T>>
		  ]
		: never
	: never;

// * Works
export type TailOfArray<T extends readonly RedisKeyTemplateArrayElements[]> =
	T extends readonly RedisKeyTemplateArrayElements[]
		? T extends readonly [infer _First, ...infer Rest]
			? Rest
			: []
		: [];
// * Works
export type makeString_StringOrRedisKeyParam<T extends string | RedisKeyParam> =
	T extends string
		? `${T}`
		: T extends RedisKeyParam
		? `%${T['name']}%`
		: never;

// * Works
export type TypeOfPathObject<obj, path extends string> = path extends keyof obj
	? path extends 'SCOPE_FIRST_PART'
		? 'scope-first-part'
		: obj[path] extends readonly RedisKeyTemplateArrayElements[]
		? 'leaf'
		: 'scope'
	: 'not-key';
