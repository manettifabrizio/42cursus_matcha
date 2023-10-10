import { api } from '@/core/api';

// Type ------------------------------------------------------------------------
type ProfileRequest = void;
type ProfileResponse = {
	id: number;
	firstname: string;
	lastname: string;
};

type EditRequest = void;
type EditResponse = {
	id: number;
	firstname: string;
	lastname: string;
};

type UserTagRequest = {
	name: string;
};
type UserTagResponse = {
	id: number;
	name: string;
};

// Api -------------------------------------------------------------------------
export const userApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getProfile: builder.query<ProfileResponse, ProfileRequest>({
			query: () => ({
				url: `user/profile`,
				method: 'GET',
			}),
		}),
		userEdit: builder.query<EditResponse, EditRequest>({
			query: (data) => ({
				url: `user/edit`,
				method: 'PATCH',
				body: data,
			}),
		}),
		setUserTag: builder.query<UserTagResponse, UserTagRequest>({
			query: (data) => ({
				url: `user/tags`,
				method: 'POST',
				body: data,
			}),
		}),
		uploadUserPicture: builder.query<ProfileResponse, ProfileRequest>({
			query: (data) => ({
				url: `user/pictures`,
				method: 'POST',
				body: data,
			}),
		}),
	}),
});

// Hook ------------------------------------------------------------------------
export const { useGetProfileQuery } = userApi;
