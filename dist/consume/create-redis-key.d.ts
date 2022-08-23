import { getRequiredParamsFromTemplateString } from '../types/create-redis-key/crk-consumers';
export declare function createRedisKey<T extends string>(redisKeyTemplateString: T, params: getRequiredParamsFromTemplateString<T>): string;
