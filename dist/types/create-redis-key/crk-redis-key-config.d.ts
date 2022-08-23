import { DeepMutable } from '../object-utils';
export declare type RedisKeysConfigParam<Name extends string = string> = {
    name: Name;
};
export declare type RedisKeysConfigTemplateArrayElements = string | RedisKeysConfigParam;
export declare type RedisKeysConfigTemplateArray = Array<string | RedisKeysConfigParam>;
export declare type RedisKeysConfigScope = {
    SCOPE_FIRST_PART: RedisKeysConfigTemplateArray;
    [key: string]: ScopeOrKeyTemplate;
};
export declare type ScopeOrKeyTemplate = RedisKeysConfigTemplateArray | RedisKeysConfigScope;
export declare type RedisKeysConfig = RedisKeysConfigScope;
export declare type RedisKeyTemplatesMapScope = {
    [key: string]: string | Record<string, string | RedisKeyTemplatesMapScope>;
};
export declare type IsValidRedisKeysConfig2<T> = DeepMutable<T> extends RedisKeysConfig ? true : false;
export declare type IsReadonlyConfig<T> = 'SCOPE_FIRST_PART' extends keyof T ? T['SCOPE_FIRST_PART'] extends any[] ? 'no' : 'yes' : 'no';
