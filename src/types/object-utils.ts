/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

export type Path_GetFirstPart<T> = T extends `${infer First}.${infer Rest}`
	? First
	: T;

export type Path_GetRest<T> = T extends `${infer First}.${infer Rest}`
	? Rest
	: never;

type Path_GetLastPart<T extends string> =
	T extends `${infer First1}.${infer Rest1}`
		? Rest1 extends `${infer First2}.${infer Rest2}`
			? Path_GetLastPart<Path_GetRest<Rest1>>
			: Rest1
		: T;

// typescript type that joins string array into a string with a separator between each element
export type JoinStringArray<ArrayToJoin extends readonly string[]> =
	ArrayToJoin extends readonly []
		? ''
		: ArrayToJoin extends readonly string[]
		? ArrayToJoin extends readonly [infer First, ...infer Rest]
			? First extends string
				? Rest extends readonly []
					? First
					: Rest extends readonly string[]
					? `${First}:${JoinStringArray<Rest>}`
					: never
				: never
			: never
		: never;

export type DeepMutable<T> = {
	-readonly [k in keyof T]: DeepMutable<T[k]>;
};
