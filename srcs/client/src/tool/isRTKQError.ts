import { ApiErrorResponse } from '@/core/api';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import toast from 'react-hot-toast';

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export const isRTKQFetchBaseQueryError = (
	error: unknown,
): error is FetchBaseQueryError => {
	return typeof error === 'object' && error != null && 'status' in error;
};

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export const isRTKQErrorWithMessage = (
	error: unknown,
): error is { message: string } => {
	return (
		typeof error === 'object' &&
		error != null &&
		'message' in error &&
		typeof (error as { message: unknown }).message === 'string'
	);
};

export function manageRTKQErrorCause(error: unknown): string[] | null {
	if (isRTKQFetchBaseQueryError(error)) {
		const errorData = error.data as ApiErrorResponse;

		if (errorData.error && 'cause' in errorData.error)
			return [errorData.error.cause];
	}
	toast.error(`Error: ${JSON.stringify(error)}`);

	return null;
}

export function manageRTKQErrorDetails<T = { [field: string]: string[] }>(
	error: unknown,
): T | null {
	if (isRTKQFetchBaseQueryError(error)) {
		const errorData = error.data as ApiErrorResponse<T>;

		if ('details' in errorData.error) return errorData.error.details!;
	}
	toast.error(`Error: ${JSON.stringify(error)}`);

	return null;
}
