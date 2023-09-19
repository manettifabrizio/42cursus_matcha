import { api } from '@/core/api';

// Type ------------------------------------------------------------------------
type ProfileRequest = void;
type ProfileResponse =
{
	id: number;
	firstname: string;
	lastname: string;
};

// Api -------------------------------------------------------------------------
export const userApi = api
	.injectEndpoints(
	{
		endpoints: (builder) => (
		{
			getProfile: builder.query<ProfileResponse, ProfileRequest>(
			{
				query: () => (
				{
					url: `user/profile`,
					method: 'GET',
				}),
			}),
		}),
	})
;

// Hook ------------------------------------------------------------------------
export const {
	useGetProfileQuery,
} = userApi;
