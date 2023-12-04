/* eslint-disable perfectionist/sort-union-types */
import type { Enumerable, RequireAtLeastOne } from './utils';

export type CollectDateTime = {
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
    millisecond?: number;
    microsecond?: number;
    nanosecond?: number;
};

export type CollectQueryCommonParams<T extends object = object> = {
    skip?: number;
    limit?: number;
    orderBy?: Record<keyof T | string, 'asc' | 'desc'>;
};

// WHERE CLAUSE
export type CollectQueryWhere<T extends object = object> = Record<
    keyof T | string,
    | string
    | number
    | boolean
    | null
    | CollectDateTime
    | Record<'not', string | number | boolean | null | CollectDateTime>
    | RequireAtLeastOne<Record<'in' | 'notIn', Array<string | number | CollectDateTime>>>
    | RequireAtLeastOne<Record<'lt' | 'lte' | 'gt' | 'gte', number | CollectDateTime>>
    | RequireAtLeastOne<Record<'startsWith' | 'endsWith' | 'contains', string>>
>;
export type CollectQueryWhereParam<T extends object = object> = {
    where:
        | CollectQueryWhere<T>
        | RequireAtLeastOne<Record<'AND' | 'OR' | 'NOT', Enumerable<CollectQueryWhere<T>>>>;
    pick?: "*" | Array<keyof T | string>
};

// INCLUDES CLAUSE
export type CollectQueryIncludes<T extends object = object> = Record<
    string,
    Partial<CollectQueryWhereParam<T>> & Partial<CollectQueryIncludesParam<T>> & CollectQueryCommonParams<T>
>;
export type CollectQueryIncludesParam<T extends object = object> = {
    includes: CollectQueryIncludes<T>;
};

export type CollectQuery<T extends object = object> = CollectQueryCommonParams &
    NonNullable<
        | (CollectQueryWhereParam<T> & { depth?: '*' | number; includes?: never; labels?: string[] })
        | (CollectQueryIncludesParam<T> & { where?: never })
    >;