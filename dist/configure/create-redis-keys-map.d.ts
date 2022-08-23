import { ScopeToKeys } from '../types/create-redis-key/crk-config-mapper';
import { IsReadonlyConfig, IsValidRedisKeysConfig2, RedisKeyParam } from '../types/create-redis-key/crk-redis-key-config';
export declare const createRedisKeyParam: <T extends string>(name: T) => RedisKeyParam<T>;
export declare const createRedisKeysMap: <T extends Record<string, any>, Delimiter extends string = ":", K = IsValidRedisKeysConfig2<T> extends true ? "valid" : "invalid", R = IsReadonlyConfig<T> extends "yes" ? "valid" extends K ? ScopeToKeys<T, T, ""> : never : never>(redisKeysConfig: T, optionalDelimiter?: Delimiter | undefined) => R;
