import type { RequireAtLeastOne, Enumerable } from './utils';

export type CollectDateTime = {
    year: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
    millisecond?: number;
    microsecond?: number;
    nanosecond?: number;
};

export type CollectQueryCommonParams = {
    orderBy?: Record<string, 'asc' | 'desc'>;
    skip?: number;
    limit?: number;
};

// WHERE CLAUSE
export type CollectQueryWhere<T extends {} = {}> = Record<
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
export type CollectQueryWhereParam = {
    where:
        | CollectQueryWhere
        | RequireAtLeastOne<Record<'AND' | 'OR' | 'NOT', Enumerable<CollectQueryWhere>>>;
};

// INCLUDES CLAUSE
export type CollectQueryIncludes = Record<
    string,
    Partial<CollectQueryWhereParam> & Partial<CollectQueryIncludesParam> & CollectQueryCommonParams
>;
export type CollectQueryIncludesParam = {
    includes: CollectQueryIncludes;
};

export type CollectQuery = CollectQueryCommonParams &
    NonNullable<
        | (CollectQueryWhereParam & { includes?: never; labels?: string[]; depth?: '*' | number })
        | (CollectQueryIncludesParam & { where?: never })
    >;
