/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-mixed-spaces-and-tabs */
import {
	Path_GetFirstPart,
	Path_GetRest,
	JoinStringArray,
} from '../object-utils';
import {
	RedisKeysConfigTemplateArrayElements,
	RedisKeysConfigParam,
} from './crk-redis-key-config';

/**
 * ! CAUTION:
 * ! Do not remove any export statement on types.
 * ! Otherwise typescript might give an error.
 */

// * Convert Redis Keys Config (readonly) to Redis Key Template Map
export type ScopeToKeys<
	T extends Record<string, any>,
	X extends Record<string, any> = T,
	AggregatedPath extends string = ''
> = 'SCOPE_FIRST_PART' extends keyof T
	? {
			[K in Exclude<keyof T, 'SCOPE_FIRST_PART'>]: K extends string
				? 'SCOPE_FIRST_PART' extends keyof T[K]
					? ScopeToKeys<
							T[K],
							X,
							`${AggregatedPath extends '' ? '' : `${AggregatedPath}.`}${K}`
					  >
					: RedisKeyTemplateString_FromPath__Main<
							X,
							`${AggregatedPath extends '' ? '' : `${AggregatedPath}.`}${K}`
					  >
				: never;
	  }
	: never;

// * Create a template string by taking a Redis Keys Config object and a path.
export type RedisKeyTemplateString_FromPath__Main<
	KeyRegistry extends Record<string, any>,
	Path extends string
> = KeyRegistry['SCOPE_FIRST_PART'] extends readonly any[]
	? `${JoinStringArray<KeyRegistry['SCOPE_FIRST_PART']> extends ''
			? ''
			: `${JoinStringArray<
					KeyRegistry['SCOPE_FIRST_PART']
			  >}:`}${RedisKeyTemplateString_FromPath__FromScope<KeyRegistry, Path>}`
	: never;

// * Create a template string by taking a Config Scope object and a path.
export type RedisKeyTemplateString_FromPath__FromScope<
	KeyRegistry extends Record<string, any>,
	Path extends string,
	PathFirst_ObjType = TypeOfPathObject<KeyRegistry, Path_GetFirstPart<Path>>
> = PathFirst_ObjType extends 'scope'
	? `${Join_RedisKeyTemplateArray<
			KeyRegistry[Path_GetFirstPart<Path>]['SCOPE_FIRST_PART']
	  >}:${RedisKeyTemplateString_FromPath__FromScope<
			KeyRegistry[Path_GetFirstPart<Path>],
			Path_GetRest<Path>
	  >}`
	: PathFirst_ObjType extends 'leaf'
	? `${Join_RedisKeyTemplateArray<KeyRegistry[Path_GetFirstPart<Path>]>}`
	: never;

/**
 * * Join a Redis KeyTemplate Array (Array<string | RedisKeyParam>) into a string.
 * * This is used to create a Redis Key Template String.
 */
export type Join_RedisKeyTemplateArray<
	arr extends readonly RedisKeysConfigTemplateArrayElements[]
> = `${JoinStringArray<RedisKeyTemplateArray_ToStringArray<arr>>}`;

// * Converts a Redis Key Template Array (Array<string | RedisKeyParam>) to a string array.
export type RedisKeyTemplateArray_ToStringArray<
	T extends readonly RedisKeysConfigTemplateArrayElements[]
> = T extends any
	? TailOfArray<T> extends []
		? [makeString_StringOrRedisKeyParam<T[0]>]
		: readonly [
				makeString_StringOrRedisKeyParam<T[0]>,
				...RedisKeyTemplateArray_ToStringArray<TailOfArray<T>>
		  ]
	: never;

// * Get all but the first element of an array.
export type TailOfArray<
	T extends readonly RedisKeysConfigTemplateArrayElements[]
> = T extends readonly RedisKeysConfigTemplateArrayElements[]
	? T extends readonly [infer _First, ...infer Rest]
		? Rest
		: []
	: [];

// * Converts Redis Key Param or string to string literal.
export type makeString_StringOrRedisKeyParam<
	T extends string | RedisKeysConfigParam
> = T extends string
	? `${T}`
	: T extends RedisKeysConfigParam
	? `%${T['name']}%`
	: never;

// * Determines if the object at the path is <scope | leaf | scope-first-part | undefined>
export type TypeOfPathObject<obj, path extends string> = path extends keyof obj
	? path extends 'SCOPE_FIRST_PART'
		? 'scope-first-part'
		: obj[path] extends readonly RedisKeysConfigTemplateArrayElements[]
		? 'leaf'
		: 'scope'
	: 'not-key';
