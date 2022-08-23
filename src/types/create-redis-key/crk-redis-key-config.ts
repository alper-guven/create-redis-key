/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-mixed-spaces-and-tabs */
import { DeepMutable } from '../object-utils';

// * Template array elements

export type RedisKeysConfigParam<Name extends string = string> = {
	name: Name;
};

export type RedisKeysConfigTemplateArrayElements =
	| string
	| RedisKeysConfigParam;

export type RedisKeysConfigTemplateArray = Array<string | RedisKeysConfigParam>;

// * Redis Key Config

export type RedisKeysConfigScope = {
	SCOPE_FIRST_PART: RedisKeysConfigTemplateArray;
	[key: string]: ScopeOrKeyTemplate;
};

export type ScopeOrKeyTemplate =
	| RedisKeysConfigTemplateArray
	| RedisKeysConfigScope;

export type RedisKeysConfig = RedisKeysConfigScope;

// * Redis Key Config mapped to Redis Key Template String map

export type RedisKeyTemplatesMapScope = {
	[key: string]: string | Record<string, string | RedisKeyTemplatesMapScope>;
};

// * Redis Key Config validation types

export type IsValidRedisKeysConfig2<T> = DeepMutable<T> extends RedisKeysConfig
	? true
	: false;

export type IsReadonlyConfig<T> = 'SCOPE_FIRST_PART' extends keyof T
	? T['SCOPE_FIRST_PART'] extends any[]
		? 'no'
		: 'yes'
	: 'no';
