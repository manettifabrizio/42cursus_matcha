import { invalidLinkToast } from '@/component/ui/customToasts';
import { ApiErrorResponse } from '@/core/api';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import toast from 'react-hot-toast';

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
const isRTKQFetchBaseQueryError = (
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

export function isLinkInvalidError(
	error: unknown,
	link?: string,
	toast_id?: string,
) {
	if (isRTKQFetchBaseQueryError(error)) {
		const errorData = error.data as ApiErrorResponse;

		if (
			errorData.error &&
			'cause' in errorData.error &&
			errorData.error.cause === 'Invalid credentials.'
		) {
			if (link) invalidLinkToast(link, toast_id);
			else
				toast.error('Failed confirming the mail: ' + errorData.error.cause, {
					id: toast_id,
				});
			return true;
		}

		if (
			(errorData.error &&
				'cause' in errorData.error &&
				errorData.error.cause ===
					'Email has already been confirmed.') ||
			errorData.error.cause === 'Email has already been validated.'
		) {
			toast.success(errorData.error.cause, { id: toast_id });
			return true;
		}
	}

	return false;
}

export function manageRTKQErrorCause(
	error: unknown,
	toast_id?: string,
): string[] | null {
	if (isRTKQFetchBaseQueryError(error)) {
		const errorData = error.data as ApiErrorResponse;

		toast.error('An error occurred!', { id: toast_id });

		if (errorData.error && 'cause' in errorData.error)
			return [errorData.error.cause];
	}
	toast.error(`Error: ${JSON.stringify(error)}`, { id: toast_id });

	return null;
}

export function manageRTKQErrorDetails<T = { [field: string]: string[] }>(
	error: unknown,
	toast_id?: string,
): T | null {
	if (isRTKQFetchBaseQueryError(error)) {
		const errorData = error.data as ApiErrorResponse<T>;

		toast.error('An error occurred!', { id: toast_id });

		if ('details' in errorData.error) return errorData.error.details!;
	}
	toast.error(`Error: ${JSON.stringify(error)}`, { id: toast_id });

	return null;
}
