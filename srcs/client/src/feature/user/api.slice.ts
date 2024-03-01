import { api } from '@/core/api';
import { Profile } from './types';

// Type ------------------------------------------------------------------------
type ProfileRequest = { id?: number } | void;
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

type GetBlockedUsersResponse = {
	blocks: { by_me: { id_user_to: number; created_at: Date }[] };
};

type GetActivitiesResponse = {
	activities: {
		by_me: {
			id_user_to: number;
			action: 'WATCHED_PROFILE';
			created_at: Date;
		}[];
		to_me: {
			id_user_from: number;
			action: 'WATCHED_PROFILE';
			created_at: Date;
		}[];
	};
};

// Api -------------------------------------------------------------------------
export const userApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getProfile: builder.query<ProfileResponse, ProfileRequest>({
			query: (data) => ({
				url:
					data && data.id
						? `user/${data.id}/profile`
						: `user/profile`,
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
			invalidatesTags: ['User'],
		}),
		setUserTag: builder.mutation<UserTagResponse, UserTagRequest>({
			query: (data) => ({
				url: `user/tags`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['User'],
		}),
		deleteUserTag: builder.mutation<object, { id: number }>({
			query: (data) => ({
				url: `/user/tags/${data.id}`,
				method: 'DELETE',
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
			invalidatesTags: ['User'],
		}),
		deleteUserPicture: builder.mutation<object, { id: number }>({
			query: (data) => ({
				url: `user/pictures/${data.id}`,
				method: 'DELETE',
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
		likeUser: builder.mutation<object, { id: number }>({
			query: (data) => ({
				url: `user/${data.id}/like`,
				method: 'POST',
			}),
			invalidatesTags: ['User', 'Matches'],
		}),
		unlikeUser: builder.mutation<object, { id: number }>({
			query: (data) => ({
				url: `user/${data.id}/like`,
				method: 'DELETE',
			}),
			invalidatesTags: ['User', 'Matches'],
		}),
		blockedUsers: builder.query<GetBlockedUsersResponse, void>({
			query: () => ({
				url: `user/blocks`,
				method: 'GET',
			}),
			providesTags: ['User', 'Matches'],
		}),
		blockUser: builder.mutation<object, { id: number }>({
			query: (data) => ({
				url: `user/${data.id}/block`,
				method: 'POST',
			}),
			invalidatesTags: ['User', 'Matches'],
		}),
		unblockUser: builder.mutation<object, { id: number }>({
			query: (data) => ({
				url: `user/${data.id}/block`,
				method: 'DELETE',
			}),
			invalidatesTags: ['User', 'Matches'],
		}),
		reportUser: builder.mutation<object, { id: number }>({
			query: (data) => ({
				url: `user/${data.id}/report`,
				method: 'POST',
			}),
			invalidatesTags: ['User', 'Matches'],
		}),
		unreportUser: builder.mutation<object, { id: number }>({
			query: (data) => ({
				url: `user/${data.id}/report`,
				method: 'DELETE',
			}),
			invalidatesTags: ['User', 'Matches'],
		}),
		getActivities: builder.query<GetActivitiesResponse, void>({
			query: () => ({
				url: `user/activities`,
				method: 'GET',
			}),
		}),
	}),
});

export const { uploadUserPicture, setUserTag } = userApi.endpoints;

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
	useBlockedUsersQuery,
	useBlockUserMutation,
	useUnblockUserMutation,
	useReportUserMutation,
	useUnreportUserMutation,
	useGetActivitiesQuery,
} = userApi;
