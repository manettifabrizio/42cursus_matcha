import { Profile } from '@/feature/user/types';
import { useEffect } from 'react';
import { FaChevronLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import UserInfo from './userProfileTop';
import UserActions from './userProfileBottom';
import { useStoreDispatch } from '@/hook/useStore';
import {
	isUserOnline,
	resetIsUserOnline,
	viewProfile,
} from '@/feature/interactions/store.slice';
import { StoreState } from '@/core/store';
import { useSelector } from 'react-redux';
import UserBio from './userProfileBio';
import MImage from '@/component/ui/mImage';
import { useMediaQuery } from 'react-responsive';

type UserProfileProps = {
	user: Profile;
	isFetching: boolean;
};

export default function UserProfile({ user, isFetching }: UserProfileProps) {
	const dispatch = useStoreDispatch();
	const isDesktop = useMediaQuery({ query: '(min-width: 940px)' });
	const navigate = useNavigate();
	const status = useSelector(
		(state: StoreState) => state.interactions.user_status,
	);

	useEffect(() => {
		const checkUserStatus = async () => {
			dispatch(isUserOnline({ id_user: user.id }));
		};

		// Double view notification because of react.Strict mode
		const timer = setInterval(checkUserStatus, 1000);

		dispatch(viewProfile({ id_user: user.id }));

		return () => {
			dispatch(resetIsUserOnline());
			clearInterval(timer);
		};
	}, [dispatch, user.id]);

	const user_pictures = user.pictures.filter(
		(p) => p.id !== user.picture?.id,
	);

	return (
		<div className="relative w-full h-full flex justify-center items-center">
			<div className={`absolute top-0 left-0 `}>
				<button
					onClick={() => navigate(-1)}
					className="w-full justify-start flex flex-row items-center m-2 text-xl"
				>
					<FaChevronLeft />
				</button>
			</div>
			<div
				// TODO: Better color when match
				className={
					'user-profile flex relative border-4 w-3/4 h-5/6 rounded-xl max-w-4xl sm:max-h-[45rem] ' +
					(isDesktop
						? 'flex-row overflow-hidden '
						: 'flex-col overflow-y-auto ') +
					(user.likes?.by_me && user.likes?.to_me
						? 'border-red-500'
						: '')
				}
			>
				{isDesktop ? (
					<>
						<div className="bg-orange-500 w-1/2 h-full overflow-y-auto">
							<MImage
								src={`${user.picture?.path}`}
								alt="Avatar"
								className="inset-0 h-[34rem] object-cover"
								key={user.picture?.id}
							/>
							{user_pictures.map((picture) => (
								<MImage
									src={`${picture.path}`}
									alt="Picture"
									className="inset-0 w-full"
									key={picture.id}
								/>
							))}
						</div>
						<div className="flex flex-col w-1/2 h-full p-10 relative">
							{user.blocks?.by_me && (
								<div className="absolute top-0 left-0 text-red-500 italic font-light border-red-500 border-b w-full text-center">
									User is blocked
								</div>
							)}
							<UserInfo user={user} status={status} />
							<UserBio user={user} />
							<UserActions user={user} isFetching={isFetching} />
						</div>
					</>
				) : (
					<>
						{user.blocks?.by_me && (
							<div className="absolute top-0 left-0 text-white italic font-light border-red-500 bg-red-500 border-b w-full text-center">
								User is blocked
							</div>
						)}
						<MImage
							src={`${user.picture?.path}`}
							alt="Avatar"
							className="inset-0 w-full h-full object-cover"
							key={user.picture?.id}
						/>
						<div className="flex flex-col p-3">
							<UserInfo user={user} status={status} />
							<UserBio user={user} />
							<UserActions user={user} isFetching={isFetching} />
						</div>
						{user_pictures.map((picture) => (
							<MImage
								src={`${picture.path}`}
								alt="Picture"
								className="inset-0 w-full"
								key={picture.id}
							/>
						))}
					</>
				)}
			</div>
		</div>
	);
}
