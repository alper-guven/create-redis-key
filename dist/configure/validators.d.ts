import { RedisKeyParam, RedisKeyScope, RedisKeyTemplateArray, ScopeOrKeyTemplate } from '../types/create-redis-key/crk-redis-key-config';
export declare const isRedisKeyParam: (templateMember: string | RedisKeyParam) => templateMember is RedisKeyParam<string>;
export declare const isRedisKeyTemplate: (possibleTemplate: ScopeOrKeyTemplate) => possibleTemplate is RedisKeyTemplateArray;
export declare const isScope: (possibleScope: unknown) => possibleScope is RedisKeyScope;
export declare const isValidScope: (scope: unknown) => scope is RedisKeyScope;
export declare const validateRedisKeyConfig: (redisKeyConfig: unknown) => void;
export declare const validateDelimiter: (delimiter: unknown) => void;
