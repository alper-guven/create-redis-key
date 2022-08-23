export declare type getRequiredParamsFromTemplateString<T extends string> = T extends `${string}%${infer _ParamName}%${infer _Rest}` ? {
    [K in getRedisKeyParamsFromTemplateString<T>[number]]: string;
} : null;
export declare type getRedisKeyParamsFromTemplateString<T extends string, _D extends number = 10> = T extends `${string}%${infer ParamName}%${infer Rest}` ? [ParamName, ...getRedisKeyParamsFromTemplateString<Rest>] : [];
