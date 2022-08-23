import { ScopeToKeys } from '../types/create-redis-key/crk-config-mapper';
import { IsReadonlyConfig, IsValidRedisKeysConfig2, RedisKeysConfigParam } from '../types/create-redis-key/crk-redis-key-config';
export declare const createRedisKeyParam: <T extends string>(name: T) => RedisKeysConfigParam<T>;
export declare const createRedisKeysMap: <T extends Record<string, any>, Delimiter extends string = ":", K = IsValidRedisKeysConfig2<T> extends true ? "valid" : "invalid", ReturnValue = "valid" extends K ? IsReadonlyConfig<T> extends "yes" ? ScopeToKeys<T, T, ""> : ScopeToKeys<T, T, ""> : never>(redisKeysConfig: T, optionalDelimiter?: Delimiter | undefined) => ReturnValue;
