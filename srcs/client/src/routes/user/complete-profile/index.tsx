import { useEffect, useId, useState } from 'react';
import { Form, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useGetProfileQuery } from '@/feature/user/api.slice';
import toast from 'react-hot-toast';
import {
	CompleteProfile,
	CompleteProfileError,
	initCompleteProfile,
	initCompleteProfileErrors,
} from '@/feature/user/types';
import {
	isProfileCompleted,
	profileToCompleteProfile,
	setCurrentUser,
} from '@/tool/userTools';
import FormContainer from '@/component/layout/form/formContainer';
import MatchaLogo from '@/component/ui/matchaLogo';
import CompleteProfileInputs from '@/component/user/complete-profile/completeProfileInputs';
import {
	checkBeforeSubmitting,
	editProfile,
	sendTags,
} from '@/feature/user/utils';
import PicturesEdit from '@/component/user/profile/pictures/picturesEdit';
import UserCard from '@/component/home/main_page/user_card/userCard';
import LoadingSpinner from '@/component/ui/loadingSpinner';
import { useDispatch } from 'react-redux';
import { clearAuth } from '@/feature/auth/store.slice';

export function Component() {
	const navigate = useNavigate();
	const {
		data = undefined,
		isFetching,
		isLoading,
		isError,
	} = useGetProfileQuery();

	const [submitting, setSubmitting] = useState(false);
	const { search } = useLocation();
	const dispatch = useDispatch();
	const [page, setPage] = useState(
		Number(new URLSearchParams(search).get('page')) ?? 1,
	);
	const [profile, setProfile] =
		useState<CompleteProfile>(initCompleteProfile);
	const [errors, setErrors] = useState<CompleteProfileError>(
		initCompleteProfileErrors,
	);

	useEffect(() => {
		setPage(Number(new URLSearchParams(search).get('page')) ?? 1);
	}, [search]);

	useEffect(() => {
		if (data) {
			if (!isProfileCompleted(data)) {
				navigate('/home');
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const submitCompleteProfile = async (
		e: React.FormEvent<HTMLFormElement>,
	) => {
		e.preventDefault();
		const id = toast.loading('Editing profile details...', {
			style: { minWidth: '350px' },
		});
		if (!profile || !checkBeforeSubmitting(profile, id)) return null;

		setErrors(initCompleteProfileErrors);
		setSubmitting(true);

		if (await editProfile(profile, setErrors, setSubmitting, id))
			if (await sendTags(profile, setErrors, setSubmitting, id)) {
				await setCurrentUser();
				toast.success(
					"Profile completed successfully! Let's upload some pictures.",
					{ id },
				);
				navigate('/user/complete-profile?page=2');
			}
	};

	async function submitPictures(e: React.FormEvent<HTMLButtonElement>) {
		e.preventDefault();

		await setCurrentUser();
		navigate('/home');
	}

	const id = useId();

	if (isError) {
		toast.error(`Error: User not found`);
		dispatch(clearAuth());
		return <Navigate to="/" />;
	}

	return (
		<div className="flex justify-between flex-col items-center w-full h-full">
			<MatchaLogo />
			<FormContainer>
				{!isLoading && !isFetching && data != undefined ? (
					page === 1 ? (
						<>
							<h4 className="font-bold">
								Let's add some details to your profile!
							</h4>
							<Form
								onSubmit={submitCompleteProfile}
								className="w-full"
							>
								<CompleteProfileInputs
									submitting={submitting}
									setProfile={setProfile}
									id={id}
									errors={errors}
									profile={profileToCompleteProfile(data)}
								/>
							</Form>
						</>
					) : (
						<div className="flex flex-col">
							<div className="flex flex-row w-full justify-center items-center">
								<div className="mb-5">
									<UserCard user={data} preview={true} />
								</div>
							</div>
							<h4 className="font-bold text-center">
								Let's complete your profile with some pictures
								to start matching with people!
							</h4>
							<PicturesEdit
								profile={data}
								submitting={isLoading || isFetching}
							/>
							<div className="flex justify-center w-full">
								<button
									form="complete-pictures-form"
									disabled={
										isLoading ||
										isFetching ||
										!!isProfileCompleted(data)
									}
									type="submit"
									onClick={submitPictures}
									className={
										'group relative w-full text-white font-semibold py-2 rounded-full overflow-hidden bg-gradient-to-b from-red-600 to-amber-400 ' +
										(isLoading ||
										isFetching ||
										!!isProfileCompleted(data)
											? 'opacity-60'
											: 'hover:opacity-80')
									}
								>
									Save
								</button>
							</div>
						</div>
					)
				) : (
					<div className="w-full h-full flex flex-col justify-center items-center">
						<LoadingSpinner message="Loading..." />
					</div>
				)}
			</FormContainer>
		</div>
	);
}
