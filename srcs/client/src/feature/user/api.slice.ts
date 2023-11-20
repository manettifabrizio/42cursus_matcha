import { api } from '@/core/api';
import { Profile, User } from './types';

// Type ------------------------------------------------------------------------
type ProfileRequest = { id: number } | void;
type ProfileResponse = Profile;

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
			query: (data) => ({
				url: data ? `user/${data.id}/profile` : `user/profile`,
				method: 'GET',
			}),
			providesTags: ['User'],
		}),
		getUsers: builder.query<GetUsersResponse, GetUsersRequest>({
			query: (data) => ({
				url: `search${data.filters}`,
				method: 'GET',
			}),
			providesTags: ['User'],
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
			invalidatesTags: ['User'],
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
			invalidatesTags: ['User'],
		}),
		likeUser: builder.mutation<{}, { id: number }>({
			query: (data) => ({
				url: `user/${data.id}/like`,
				method: 'POST',
			}),
			invalidatesTags: ['User'],
		}),
		unlikeUser: builder.mutation<{}, { id: number }>({
			query: (data) => ({
				url: `user/${data.id}/like`,
				method: 'DELETE',
			}),
			invalidatesTags: ['User'],
		}),
		blockUser: builder.mutation<{}, { id: number }>({
			query: (data) => ({
				url: `user/${data.id}/block`,
				method: 'POST',
			}),
			invalidatesTags: ['User'],
		}),
		unblockUser: builder.mutation<{}, { id: number }>({
			query: (data) => ({
				url: `user/${data.id}/block`,
				method: 'DELETE',
			}),
			invalidatesTags: ['User'],
		}),
		reportUser: builder.mutation<{}, { id: number }>({
			query: (data) => ({
				url: `user/${data.id}/report`,
				method: 'POST',
			}),
			invalidatesTags: ['User'],
		}),
		unreportUser: builder.mutation<{}, { id: number }>({
			query: (data) => ({
				url: `user/${data.id}/report`,
				method: 'DELETE',
			}),
			invalidatesTags: ['User'],
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
	useLikeUserMutation,
	useUnlikeUserMutation,
	useBlockUserMutation,
	useUnblockUserMutation,
	useReportUserMutation,
	useUnreportUserMutation,
} = userApi;
