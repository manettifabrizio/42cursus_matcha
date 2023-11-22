import { api } from '@/core/api';
import { Profile } from './types';

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

type GetLikesRequest = void;
type GetLikesResponse = {
	likes: {
		by_me: { id_user_to: number; created_at: Date }[];
		to_me: { id_user_from: number; created_at: Date }[];
	};
};

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
		getLikes: builder.query<GetLikesResponse, GetLikesRequest>({
			query: () => ({
				url: `user/likes`,
				method: 'GET',
			}),
			providesTags: ['Matches'],
		}),
		likeUser: builder.mutation<{}, { id: number }>({
			query: (data) => ({
				url: `user/${data.id}/like`,
				method: 'POST',
			}),
			invalidatesTags: ['User', 'Matches'],
		}),
		unlikeUser: builder.mutation<{}, { id: number }>({
			query: (data) => ({
				url: `user/${data.id}/like`,
				method: 'DELETE',
			}),
			invalidatesTags: ['User', 'Matches'],
		}),
		blockUser: builder.mutation<{}, { id: number }>({
			query: (data) => ({
				url: `user/${data.id}/block`,
				method: 'POST',
			}),
			invalidatesTags: ['User', 'Matches'],
		}),
		unblockUser: builder.mutation<{}, { id: number }>({
			query: (data) => ({
				url: `user/${data.id}/block`,
				method: 'DELETE',
			}),
			invalidatesTags: ['User', 'Matches'],
		}),
		reportUser: builder.mutation<{}, { id: number }>({
			query: (data) => ({
				url: `user/${data.id}/report`,
				method: 'POST',
			}),
			invalidatesTags: ['User', 'Matches'],
		}),
		unreportUser: builder.mutation<{}, { id: number }>({
			query: (data) => ({
				url: `user/${data.id}/report`,
				method: 'DELETE',
			}),
			invalidatesTags: ['User', 'Matches'],
		}),
	}),
});

export const { uploadUserPicture, userEdit, setUserTag } = userApi.endpoints;

// Hook ------------------------------------------------------------------------
export const {
	useGetProfileQuery,
	useLazyGetProfileQuery,
	useUserEditMutation,
	useSetUserTagMutation,
	useUploadUserPictureMutation,
	useGetUsersQuery,
	useGetLikesQuery,
	useLikeUserMutation,
	useUnlikeUserMutation,
	useBlockUserMutation,
	useUnblockUserMutation,
	useReportUserMutation,
	useUnreportUserMutation,
} = userApi;
