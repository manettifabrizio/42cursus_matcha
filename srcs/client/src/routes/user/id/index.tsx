import UserProfile from '@/component/home/other_users/userProfile';
import LoadingSpinner from '@/component/ui/loadingSpinner';
import { useGetProfileQuery } from '@/feature/user/api.slice';
import { Navigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export function Component() {
	const { id } = useParams<{ id: string }>();

	const {
		data: other_user = undefined,
		isFetching: isFetchingOtherUser,
		isLoading: isLoadingOtherUser,
		isError: isOtherUserError,
	} = useGetProfileQuery({ id: id ? parseInt(id) : undefined });

	const {
		data: my_user = undefined,
		isFetching: isFetchingMyUser,
		isLoading: isLoadingMyUser,
		isError: isMyUserError,
	} = useGetProfileQuery();

	if (id) {
		if (
			isLoadingMyUser ||
			isFetchingMyUser ||
			isLoadingOtherUser ||
			isFetchingOtherUser
		) {
			return (
				<div className="w-full h-full flex flex-col justify-center items-center">
					<LoadingSpinner message="Loading User" />
				</div>
			);
		}

		if (!other_user || !my_user || isMyUserError || isOtherUserError) {
			if (!other_user || isOtherUserError)
				toast.error(`Error: User n.${id} not found`);
			if (!my_user || isMyUserError) toast.error(`Error: User not found`);
			return <Navigate to="/home" />;
		}

		return (
			<div className="h-full w-full flex justify-center items-center">
				<UserProfile
					my_user={my_user}
					other_user={other_user}
					isFetching={isFetchingMyUser || isFetchingOtherUser}
				/>
			</div>
		);
	}
	return (
		<div className="w-full h-full flex flex-col justify-center items-center">
			<LoadingSpinner message="Loading User" />
		</div>
	);
}
