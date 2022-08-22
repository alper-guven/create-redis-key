/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export type Prev = [
	never,
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	...0[]
];

// SEE: https://stackoverflow.com/a/58436959/6835017
export type Join<K, P> = K extends string | number
	? P extends string | number
		? `${K}${'' extends P ? '' : '.'}${P}`
		: never
	: never;

// SEE: https://stackoverflow.com/a/58436959/6835017
export type Paths<T, D extends number = 10> = [D] extends [never]
	? never
	: T extends object
	? T extends Array<any>
		? ''
		: {
				[K in keyof T]-?: K extends string | number
					? `${K}` | Join<K, Paths<T[K], Prev[D]>>
					: never;
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  }[keyof T]
	: '';

// SEE: https://stackoverflow.com/a/58436959/6835017
export type Leaves<T, D extends number = 10> = [D] extends [never]
	? never
	: T extends object
	? T extends readonly any[]
		? ''
		: { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
	: '';

//

export type Path_GetFirstPart<T> = T extends `${infer First}.${infer Rest}`
	? First
	: T;

type asklsdasd1 = Path_GetFirstPart<'a'>;

type asklsdasd =
	Path_GetFirstPart<'a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z'>;

export type Path_GetRest<T> = T extends `${infer First}.${infer Rest}`
	? Rest
	: never;

type asdklasdklasd =
	Path_GetRest<'a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z'>;

export type Path_GetLastPart<T extends string> =
	T extends `${infer First1}.${infer Rest1}`
		? Rest1 extends `${infer First2}.${infer Rest2}`
			? Path_GetLastPart<Path_GetRest<Rest1>>
			: Rest1
		: T;

type test1231231AA = Path_GetLastPart<'aa'>;
type test1231231BB = Path_GetLastPart<'aa.bb'>;
type test1231231CC = Path_GetLastPart<'aa.bb.cc'>;
type test1231231DD = Path_GetLastPart<'aa.bb.cc.dd'>;
type test1231231EE = Path_GetLastPart<'aa.bb.cc.dd.ee'>;
type test1231231FF = Path_GetLastPart<'aa.bb.cc.dd.ee.ff'>;
type test1231231GG = Path_GetLastPart<'aa.bb.cc.dd.ee.ff.gg'>;
type test1231231HH = Path_GetLastPart<'aa.bb.cc.dd.ee.ff.gg.hh'>;

// export type Path_GetExceptLastPart<T extends string> =
// 	T extends `${infer First1}.${infer Rest1}`
// 		? First1 extends `${infer First2}.${infer Rest2}`
// 			? `${Path_GetExceptLastPart<First2>}.${First1}}`
// 			: 'First1'
// 		: T;

// type test1231231_AA = Path_GetExceptLastPart<'aa'>;
// type test1231231_BB = Path_GetExceptLastPart<'aa.bb'>;

// type test1231231_CC = Path_GetExceptLastPart<'aa.bb.cc'>;
// type test1231231_DD = Path_GetExceptLastPart<'aa.bb.cc.dd'>;
// type test1231231_EE = Path_GetExceptLastPart<'aa.bb.cc.dd.ee'>;
// type test1231231_FF = Path_GetExceptLastPart<'aa.bb.cc.dd.ee.ff'>;

// typescript type that returns the type of the object at the given path
export type TypeOfPath<
	ObjectType extends Record<string, any>,
	Path extends string
> = Path extends `${string}.${string}`
	? TypeOfPath<ObjectType[Path_GetFirstPart<Path>], Path_GetRest<Path>>
	: ObjectType[Path] extends undefined
	? never
	: ObjectType[Path];

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

export type JoinStringArrayMax10<ArrayToJoin extends readonly string[]> =
	ArrayToJoin extends readonly []
		? ''
		: ArrayToJoin['length'] extends 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
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

type test11111 = JoinStringArray<readonly ['a', 'b', 'c']>;

type test22222 = JoinStringArrayMax10<
	['a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', '10']
>;

export type ArrayWithDepth<
	T,
	X extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
> = X extends 0 ? readonly [] : readonly [T, ...ArrayWithDepth<T, Prev[X]>];

export type MaxDepthArrayMax10<T> =
	| ArrayWithDepth<T, 0>
	| ArrayWithDepth<T, 1>
	| ArrayWithDepth<T, 2>
	| ArrayWithDepth<T, 3>
	| ArrayWithDepth<T, 4>
	| ArrayWithDepth<T, 5>
	| ArrayWithDepth<T, 6>
	| ArrayWithDepth<T, 7>
	| ArrayWithDepth<T, 8>
	| ArrayWithDepth<T, 9>
	| ArrayWithDepth<T, 10>;

type test33333 = ArrayWithDepth<'x' | 'y', 10>;

type test444441123 = MaxDepthArrayMax10<'x' | 'y'>;

type test44444 = ['y', 'x'] extends test444441123 ? 'yes' : 'no';

type optionalReadonly<
	T,
	K extends 'readonly' | undefined = undefined
> = K extends 'readonly' ? readonly T[] : T;

// SEE: https://stackoverflow.com/a/59906630/6835017
type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift';
export type FixedLengthArray<
	T,
	L extends number,
	TObj = readonly [T, ...Array<T>]
> = Pick<TObj, Exclude<keyof TObj, ArrayLengthMutationKeys>> & {
	readonly length: L;
	[I: number]: T;
	[Symbol.iterator]: () => IterableIterator<T>;
};

// Excessive depth solution 1
type AllModuleActions<M extends string, D extends Prev[number] = 4> = [
	D
] extends [never]
	? never
	: '';

// Excessive depth solution 2
const generic = <M extends string>(
	action: M extends any ? AllModuleActions<string> : never // <-- defer
) => {
	action; // okay
};

// aaaaaaaaaaaa

type Cons1<H, T> = T extends readonly any[]
	? ((h: H, ...t: T) => void) extends (...r: infer R) => void
		? R
		: never
	: never;

type Paths1<T, D extends number = 10> = [D] extends [never]
	? never
	: T extends object
	? {
			[K in keyof T]-?:
				| [K]
				| (Paths<T[K], Prev[D]> extends infer P
						? P extends []
							? never
							: Cons1<K, P>
						: never);
			// eslint-disable-next-line no-mixed-spaces-and-tabs
	  }[keyof T]
	: [];

export type Leaves1<T, D extends number = 10> = [D] extends [never]
	? never
	: T extends object
	? T extends readonly any[]
		? []
		: { [K in keyof T]-?: Cons1<K, Leaves1<T[K], Prev[D]>> }[keyof T]
	: [];

export type DeepMutable<T> = {
	-readonly [k in keyof T]: DeepMutable<T[k]>;
};
