import { RedisKeysConfigParam, RedisKeysConfigScope, RedisKeysConfigTemplateArray, ScopeOrKeyTemplate } from '../types/create-redis-key/crk-redis-key-config';
export declare const isRedisKeyParam: (templateMember: string | RedisKeysConfigParam) => templateMember is RedisKeysConfigParam<string>;
export declare const isRedisKeyTemplate: (possibleTemplate: ScopeOrKeyTemplate) => possibleTemplate is RedisKeysConfigTemplateArray;
export declare const validateRedisKeyTemplate: (possibleTemplate: ScopeOrKeyTemplate) => void;
export declare const isScopeLike: (possibleScope: unknown) => possibleScope is RedisKeysConfigScope;
export declare const isValidScope: (scope: unknown) => scope is RedisKeysConfigScope;
export declare const validateScope: (scope: unknown, parentPath: string | null) => void;
export declare const validateRedisKeyConfig: (redisKeyConfig: unknown) => void;
export declare const validateDelimiter: (delimiter: unknown) => void;
