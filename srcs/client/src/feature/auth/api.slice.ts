import { api } from '@/core/api';
import { Profile } from '../user/types';
import {
	MutationDefinition,
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
} from '@reduxjs/toolkit/dist/query';
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';

// Type ------------------------------------------------------------------------
type RegisterRequest = {
	username: string;
	password: string;
	password_confirm: string;
	email: string;
	firstname: string;
	lastname: string;
};
type RegisterResponse = {
	id: number;
};

type LoginRequest = {
	username: string;
	password: string;
};
type LoginResponse = Profile;

type ConfirmRequest = {
	id: string;
	secret: string;
};
type ConfirmResponse = void;

type ResetPasswordRequest = {
	username: string;
	email: string;
};
type ResetPasswordResponse = void;

type EditProfileRequest = {
	email?: string;
	password?: string;
	password_confirm?: string;
};

type EditProfileResponse = {
	email: string;
};

export type EditAuthMutationType = MutationTrigger<
	MutationDefinition<
		EditProfileRequest,
		BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
		'User' | 'Matches',
		EditProfileResponse,
		'api'
	>
>;

type EditPasswordRequest = {
	password: string;
	password_confirm: string;
};
type EditPasswordResponse = void;

type RefreshRequest = void;
type RefreshResponse = void;

type LogoutRequest = void;
type LogoutResponse = void;

// Api -------------------------------------------------------------------------
export const authApi = api.injectEndpoints({
	endpoints: (builder) => ({
		register: builder.mutation<RegisterResponse, RegisterRequest>({
			query: (data) => ({
				url: `auth/register`,
				method: 'POST',
				body: data,
			}),
		}),
		login: builder.mutation<LoginResponse, LoginRequest>({
			query: (data) => ({
				url: `auth/login`,
				method: 'POST',
				body: data,
			}),
		}),
		confirm: builder.mutation<ConfirmResponse, ConfirmRequest>({
			query: (data) => ({
				url: `auth/confirm?id=${data.id}&secret=${data.secret}`,
				method: 'POST',
				body: data,
			}),
		}),
		resetPassword: builder.mutation<
			ResetPasswordResponse,
			ResetPasswordRequest
		>({
			query: (data) => ({
				url: `auth/reset-password`,
				method: 'POST',
				body: data,
			}),
		}),
		editAuth: builder.mutation<EditProfileResponse, EditProfileRequest>({
			query: (data) => ({
				url: `auth/edit`,
				method: 'PATCH',
				body: data,
			}),
		}),
		editPassword: builder.mutation<
			EditPasswordResponse,
			EditPasswordRequest
		>({
			query: (data) => ({
				url: `auth/edit-password`,
				method: 'POST',
				body: data,
			}),
		}),
		refresh: builder.mutation<RefreshResponse, RefreshRequest>({
			query: () => ({
				url: `auth/refresh`,
				method: 'POST',
			}),
		}),
		logout: builder.mutation<LogoutResponse, LogoutRequest>({
			query: () => ({
				url: `auth/logout`,
				method: 'POST',
			}),
		}),
	}),
});

// Hook ------------------------------------------------------------------------
export const {
	useRegisterMutation,
	useLoginMutation,
	useRefreshMutation,
	useLogoutMutation,
	useEditAuthMutation,
} = authApi;
