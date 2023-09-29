import { api } from "@/core/api";

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
type LoginResponse = void;

type ResetPasswordRequest = {
	username: string;
};
type ResetPasswordResponse = void;

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
				method: "POST",
				body: data,
			}),
		}),
		login: builder.mutation<LoginResponse, LoginRequest>({
			query: (data) => ({
				url: `auth/login`,
				method: "POST",
				body: data,
			}),
		}),
		reset_password: builder.mutation<
			ResetPasswordResponse,
			ResetPasswordRequest
		>({
			query: (data) => ({
				url: `auth/reset-password`,
				method: "POST",
				body: data,
			}),
		}),
		edit_password: builder.mutation<EditPasswordResponse, EditPasswordRequest>({
			query: (data) => ({
				url: `auth/edit-password`,
				method: "POST",
				body: data,
			}),
		}),
		refresh: builder.mutation<RefreshResponse, RefreshRequest>({
			query: () => ({
				url: `auth/refresh`,
				method: "POST",
			}),
		}),
		logout: builder.mutation<LogoutResponse, LogoutRequest>({
			query: () => ({
				url: `auth/logout`,
				method: "POST",
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
} = authApi;
