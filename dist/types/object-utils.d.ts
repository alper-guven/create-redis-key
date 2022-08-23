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
export declare type Path_GetFirstPart<T> = T extends `${infer First}.${infer Rest}` ? First : T;
export declare type Path_GetRest<T> = T extends `${infer First}.${infer Rest}` ? Rest : never;
export declare type Path_GetLastPart<T extends string> = T extends `${infer First1}.${infer Rest1}` ? Rest1 extends `${infer First2}.${infer Rest2}` ? Path_GetLastPart<Path_GetRest<Rest1>> : Rest1 : T;
export declare type JoinStringArray<ArrayToJoin extends readonly string[]> = ArrayToJoin extends readonly [] ? '' : ArrayToJoin extends readonly string[] ? ArrayToJoin extends readonly [infer First, ...infer Rest] ? First extends string ? Rest extends readonly [] ? First : Rest extends readonly string[] ? `${First}:${JoinStringArray<Rest>}` : never : never : never : never;
export declare type JoinStringArrayMax10<ArrayToJoin extends readonly string[]> = ArrayToJoin extends readonly [] ? '' : ArrayToJoin['length'] extends 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 ? ArrayToJoin extends readonly [infer First, ...infer Rest] ? First extends string ? Rest extends readonly [] ? First : Rest extends readonly string[] ? `${First}:${JoinStringArray<Rest>}` : never : never : never : never;
export declare type DeepMutable<T> = {
    -readonly [k in keyof T]: DeepMutable<T[k]>;
};
