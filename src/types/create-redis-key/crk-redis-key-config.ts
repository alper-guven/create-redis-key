/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-mixed-spaces-and-tabs */
import { DeepMutable } from '../object-utils';

export type RedisKeyParam<Name extends string = string> = {
	name: Name;
};

export type RedisKeyTemplateArrayElements = string | RedisKeyParam;

export type RedisKeyTemplateArray = Array<string | RedisKeyParam>;

export type RedisKeyScope = {
	SCOPE_FIRST_PART: RedisKeyTemplateArray;
	[key: string]: ScopeOrKeyTemplate;
};

export type ScopeOrKeyTemplate = RedisKeyTemplateArray | RedisKeyScope;

export type RedisKeysConfig = RedisKeyScope;

export type RedisKeyTemplateScope = {
	[key: string]: string | Record<string, string | RedisKeyTemplateScope>;
};

export type IsValidRedisKeysConfig2<T> = DeepMutable<T> extends RedisKeysConfig
	? true
	: false;

export type IsReadonlyConfig<T> = 'SCOPE_FIRST_PART' extends keyof T
	? T['SCOPE_FIRST_PART'] extends any[]
		? 'no'
		: 'yes'
	: 'no';
