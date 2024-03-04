import { BackToMenuArrow } from '@/component/home/sidebar/sidebar_main_content/profile_sidebar/backToMenuArrow';
import LoadingSpinner from '@/component/ui/loadingSpinner';
import ProfileEdit from '@/component/user/profile/edit/profileEdit';
import { useGetProfileQuery } from '@/feature/user/api.slice';
import {
	CompleteProfileError,
	initCompleteProfileErrors,
} from '@/feature/user/types';
import { profileToCompleteProfile } from '@/tool/userTools';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

export function Component() {
	const {
		data = undefined,
		isFetching,
		isLoading,
		isError,
	} = useGetProfileQuery();
	const [errors, setErrors] = useState<CompleteProfileError>(
		initCompleteProfileErrors,
	);

	if (isLoading || isFetching) {
		return (
			<div className="w-full h-full flex flex-col justify-center items-center">
				<LoadingSpinner message="Loading User" />
			</div>
		);
	}

	if (isError) {
		toast.error(`Error: User not found`);
		return <Navigate to="/auth/logout" />;
	}

	return (
		<>
			<BackToMenuArrow />
			{data && !isFetching && !isLoading ? (
				<ProfileEdit
					key={data.tags.join(' ')}
					base_profile={profileToCompleteProfile(data)}
					base_profile_tags={data.tags}
					errors={errors}
					setErrors={setErrors}
				/>
			) : (
				<div className="w-full h-full flex flex-col justify-center items-center">
					<LoadingSpinner message="Loading user..." />
				</div>
			)}
		</>
	);
}
