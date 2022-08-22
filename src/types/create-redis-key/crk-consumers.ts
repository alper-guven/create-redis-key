/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-mixed-spaces-and-tabs */

/**
 * * Extract parameters from a Redis Key Template String
 * * and return an object with the parameters as keys.
 */
export type getRequiredParamsFromTemplateString<T extends string> =
	T extends `${string}%${infer _ParamName}%${infer _Rest}`
		? {
				[K in getRedisKeyParamsFromTemplateString<T>[number]]: string;
		  }
		: null;

// * Extract parameters from a Redis Key Template String
export type getRedisKeyParamsFromTemplateString<
	T extends string,
	_D extends number = 10
> = T extends `${string}%${infer ParamName}%${infer Rest}`
	? [ParamName, ...getRedisKeyParamsFromTemplateString<Rest>]
	: [];
