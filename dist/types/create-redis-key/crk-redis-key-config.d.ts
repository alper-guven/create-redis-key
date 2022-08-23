import { DeepMutable } from '../object-utils';
export declare type RedisKeyParam<Name extends string = string> = {
    name: Name;
};
export declare type RedisKeyTemplateArrayElements = string | RedisKeyParam;
export declare type RedisKeyTemplateArray = Array<string | RedisKeyParam>;
export declare type RedisKeyScope = {
    SCOPE_FIRST_PART: RedisKeyTemplateArray;
    [key: string]: ScopeOrKeyTemplate;
};
export declare type ScopeOrKeyTemplate = RedisKeyTemplateArray | RedisKeyScope;
export declare type RedisKeysConfig = RedisKeyScope;
export declare type RedisKeyTemplateScope = {
    [key: string]: string | Record<string, string | RedisKeyTemplateScope>;
};
export declare type IsValidRedisKeysConfig2<T> = DeepMutable<T> extends RedisKeysConfig ? true : false;
export declare type IsReadonlyConfig<T> = 'SCOPE_FIRST_PART' extends keyof T ? T['SCOPE_FIRST_PART'] extends any[] ? 'no' : 'yes' : 'no';
