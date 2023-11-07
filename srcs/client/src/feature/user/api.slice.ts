import { api } from '@/core/api';
import { Profile, User } from './types';

// Type ------------------------------------------------------------------------
type ProfileRequest = void;
type ProfileResponse = User;

type EditRequest = {
	id_picture?: number;
	firstname?: string;
	lastname?: string;
	birthdate?: string;
	gender?: 'MALE' | 'FEMALE';
	orientation?: 'HETEROSEXUAL' | 'HOMOSEXUAL' | 'BISEXUAL';
	biography?: string;
	location?: { latitude: number; longitude: number };
};
type EditResponse = {
	picture?: { id: number; path: string };
	firstname?: string;
	lastname?: string;
	birthdate?: Date;
	gender?: 'MALE' | 'FEMALE';
	orientation?: 'HETEROSEXUAL' | 'HOMOSEXUAL' | 'BISEXUAL';
	biography?: string;
	location?: { latitude: number; longitude: number };
};

type UserTagRequest = {
	name: string;
};
type UserTagResponse = {
	id: number;
	name: string;
};

type UploadUserPictureRequest = FormData;
type UploadUserPictureResponse = {
	id: number;
	path: string;
};

type GetUsersRequest = {
	filters: string;
};
type GetUsersResponse = { users: Profile[] };

// Api -------------------------------------------------------------------------
export const userApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getProfile: builder.query<ProfileResponse, ProfileRequest>({
			query: () => ({
				url: `user/profile`,
				method: 'GET',
			}),
		}),
		userEdit: builder.mutation<EditResponse, EditRequest>({
			query: (data) => ({
				url: `user/edit`,
				method: 'PATCH',
				body: data,
			}),
		}),
		setUserTag: builder.mutation<UserTagResponse, UserTagRequest>({
			query: (data) => ({
				url: `user/tags`,
				method: 'POST',
				body: data,
			}),
		}),
		uploadUserPicture: builder.mutation<
			UploadUserPictureResponse,
			UploadUserPictureRequest
		>({
			query: (data) => ({
				url: `user/pictures`,
				method: 'POST',
				body: data,
			}),
		}),
		getUsers: builder.query<GetUsersResponse, GetUsersRequest>({
			query: (data) => ({
				url: `search${data.filters}`,
				method: 'GET',
			}),
		}),
	}),
});

export const { uploadUserPicture, userEdit, setUserTag } = userApi.endpoints;

// Hook ------------------------------------------------------------------------
export const {
	useGetProfileQuery,
	useUserEditMutation,
	useSetUserTagMutation,
	useUploadUserPictureMutation,
	useGetUsersQuery,
} = userApi;
