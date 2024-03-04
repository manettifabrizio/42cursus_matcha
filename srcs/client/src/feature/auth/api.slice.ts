import { api } from '@/core/api';
import { Profile } from '../user/types';

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

type UrlParams = {
	id: string;
	secret: string;
};
type ConfirmRequest = object;
type ConfirmResponse = object;

type ResendEmailRequest = {
	username: string;
	password: string;
};
type ResendEmailResponse = object;

type ResetPasswordRequest = {
	username: string;
	email: string;
};
type ResetPasswordResponse = object;

type EditProfileRequest = {
	email?: string;
	password?: string;
	password_confirm?: string;
};

type EditProfileResponse = {
	email: string;
};

type UpdatePasswordRequest = {
	password: string;
	password_confirm: string;
};
type UpdatePasswordResponse = object;

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
		confirm: builder.mutation<ConfirmResponse, ConfirmRequest & UrlParams>({
			query: (data) => ({
				url: `auth/confirm?id=${data.id}&secret=${data.secret}`,
				method: 'POST',
				body: data,
			}),
		}),
		resendEmail: builder.mutation<ResendEmailResponse, ResendEmailRequest>({
			query: (data) => ({
				url: `/auth/resend-confirmation-email`,
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
		updatePassword: builder.mutation<
			UpdatePasswordResponse,
			UpdatePasswordRequest & UrlParams
		>({
			query: (data) => ({
				url: `auth/update-password?id=${data.id}&secret=${data.secret}`,
				method: 'POST',
				body: data,
			}),
		}),
		refresh: builder.mutation({
			query: () => ({
				url: `auth/refresh`,
				method: 'POST',
			}),
		}),
		logout: builder.mutation<void, void>({
			query: () => ({
				url: `auth/logout`,
				method: 'POST',
			}),
		}),
	}),
});

// Hook ------------------------------------------------------------------------
export const {
	useConfirmMutation,
	useResendEmailMutation,
	useLoginMutation,
	useRefreshMutation,
	useLogoutMutation,
	useEditAuthMutation,
} = authApi;
