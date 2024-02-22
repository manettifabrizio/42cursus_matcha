import { BackToMenuArrow } from '@/component/home/sidebar/sidebar_main_content/profile_sidebar/backToMenuArrow';
import LoadingSpinner from '@/component/ui/loadingSpinner';
import ProfileEdit from '@/component/user/profile/edit/profileEdit';
import { clearAuth } from '@/feature/auth/store.slice';
import { useGetProfileQuery } from '@/feature/user/api.slice';
import {
	CompleteProfileError,
	initCompleteProfileErrors,
} from '@/feature/user/types';
import { profileToCompleteProfile } from '@/tool/userTools';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';

export function Component() {
	const dispatch = useDispatch();
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
		dispatch(clearAuth());
		return <Navigate to="/" />;
	}

	return (
		<>
			<BackToMenuArrow />
			{data ? (
				<ProfileEdit
					key={data.tags.join(' ')}
					base_profile={profileToCompleteProfile(data)}
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
