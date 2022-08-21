export declare type Prev = [
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
export declare type Join<K, P> = K extends string | number ? P extends string | number ? `${K}${'' extends P ? '' : '.'}${P}` : never : never;
export declare type Paths<T, D extends number = 10> = [D] extends [never] ? never : T extends object ? T extends Array<any> ? '' : {
    [K in keyof T]-?: K extends string | number ? `${K}` | Join<K, Paths<T[K], Prev[D]>> : never;
}[keyof T] : '';
export declare type Leaves<T, D extends number = 10> = [D] extends [never] ? never : T extends object ? T extends readonly any[] ? '' : {
    [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>>;
}[keyof T] : '';
export declare type Path_GetFirstPart<T> = T extends `${infer First}.${infer Rest}` ? First : T;
export declare type Path_GetRest<T> = T extends `${infer First}.${infer Rest}` ? Rest : never;
export declare type Path_GetLastPart<T extends string> = T extends `${infer First1}.${infer Rest1}` ? Rest1 extends `${infer First2}.${infer Rest2}` ? Path_GetLastPart<Path_GetRest<Rest1>> : Rest1 : T;
export declare type TypeOfPath<ObjectType extends Record<string, any>, Path extends string> = Path extends `${string}.${string}` ? TypeOfPath<ObjectType[Path_GetFirstPart<Path>], Path_GetRest<Path>> : ObjectType[Path] extends undefined ? never : ObjectType[Path];
export declare type JoinStringArray<ArrayToJoin extends readonly string[]> = ArrayToJoin extends readonly [] ? '' : ArrayToJoin extends readonly string[] ? ArrayToJoin extends readonly [infer First, ...infer Rest] ? First extends string ? Rest extends readonly [] ? First : Rest extends readonly string[] ? `${First}:${JoinStringArray<Rest>}` : never : never : never : never;
export declare type JoinStringArrayMax10<ArrayToJoin extends readonly string[]> = ArrayToJoin extends readonly [] ? '' : ArrayToJoin['length'] extends 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 ? ArrayToJoin extends readonly [infer First, ...infer Rest] ? First extends string ? Rest extends readonly [] ? First : Rest extends readonly string[] ? `${First}:${JoinStringArray<Rest>}` : never : never : never : never;
export declare type ArrayWithDepth<T, X extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10> = X extends 0 ? readonly [] : readonly [T, ...ArrayWithDepth<T, Prev[X]>];
export declare type MaxDepthArrayMax10<T> = ArrayWithDepth<T, 0> | ArrayWithDepth<T, 1> | ArrayWithDepth<T, 2> | ArrayWithDepth<T, 3> | ArrayWithDepth<T, 4> | ArrayWithDepth<T, 5> | ArrayWithDepth<T, 6> | ArrayWithDepth<T, 7> | ArrayWithDepth<T, 8> | ArrayWithDepth<T, 9> | ArrayWithDepth<T, 10>;
declare type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift';
export declare type FixedLengthArray<T, L extends number, TObj = readonly [T, ...Array<T>]> = Pick<TObj, Exclude<keyof TObj, ArrayLengthMutationKeys>> & {
    readonly length: L;
    [I: number]: T;
    [Symbol.iterator]: () => IterableIterator<T>;
};
declare type Cons1<H, T> = T extends readonly any[] ? ((h: H, ...t: T) => void) extends (...r: infer R) => void ? R : never : never;
export declare type Leaves1<T, D extends number = 10> = [D] extends [never] ? never : T extends object ? T extends readonly any[] ? [] : {
    [K in keyof T]-?: Cons1<K, Leaves1<T[K], Prev[D]>>;
}[keyof T] : [];
export {};
