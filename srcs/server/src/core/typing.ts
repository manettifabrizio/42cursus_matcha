export type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export type NullableProperties<T> = { [K in keyof T]: T[K] | null };

export type NonNullableProperties<T> = { [K in keyof T]: NonNullable<T[K]> };

export type ValueOf<T> = T[keyof T];
