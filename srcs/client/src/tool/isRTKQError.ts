import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export const isRTKQFetchBaseQueryError = (
	error: unknown
)
	: error is FetchBaseQueryError =>
{
	return (typeof error === 'object' && error != null && 'status' in error);
};

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export const isRTKQErrorWithMessage = (
	error: unknown
)
	: error is { message: string } =>
{
	return (
		typeof error === 'object' && error != null && 'message' in error &&
		typeof (error as any).message === 'string'
	);
};
