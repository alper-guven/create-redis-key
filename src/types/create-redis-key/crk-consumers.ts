/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-mixed-spaces-and-tabs */

// * Works
export type getRedisKeyParamsFromTemplateString<
	T extends string,
	_D extends number = 10
> = T extends `${string}%${infer ParamName}%${infer Rest}`
	? [ParamName, ...getRedisKeyParamsFromTemplateString<Rest>]
	: [];

export type getRequiredParamsFromTemplateString<T extends string> =
	T extends `${string}%${infer _ParamName}%${infer _Rest}`
		? {
				[K in getRedisKeyParamsFromTemplateString<T>[number]]: string;
		  }
		: null;
