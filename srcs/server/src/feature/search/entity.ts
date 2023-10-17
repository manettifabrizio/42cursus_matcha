export const SORT_BY = ['AGE', 'DISTANCE', 'FAME', 'TAGS'] as const;

export const SORT_ORDER = ['ASC', 'DESC'];

// Type ------------------------------------------------------------------------
export type SortBy = (typeof SORT_BY)[number];

export type SortOrder = (typeof SORT_ORDER)[number];

export type Pagination = {
	index: number;
	size: number;
};
