import { Profile } from '@/feature/user/types';
import { useEffect, useState } from 'react';
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
	my_user: Profile;
	other_user: Profile;
	isFetching: boolean;
};

export default function UserProfile({
	my_user,
	other_user,
	isFetching,
}: UserProfileProps) {
	const dispatch = useStoreDispatch();
	const isDesktop = useMediaQuery({ query: '(min-width: 940px)' });
	const navigate = useNavigate();
	const [isAMatch, setIsAMatch] = useState(false);
	const status = useSelector(
		(state: StoreState) => state.interactions.user_status,
	);
	const matches = useSelector(
		(state: StoreState) => state.interactions.matches,
	);

	useEffect(() => {
		const checkUserStatus = async () => {
			dispatch(isUserOnline({ id_user: other_user.id }));
		};

		// Double view notification because of react.Strict mode
		const timer = setInterval(checkUserStatus, 1000);

		dispatch(viewProfile({ id_user: other_user.id }));

		return () => {
			dispatch(resetIsUserOnline());
			clearInterval(timer);
		};
	}, [dispatch, other_user.id]);

	useEffect(() => {
		if (matches?.find((m) => m.id === other_user.id)) {
			setIsAMatch(true);
		} else {
			setIsAMatch(false);
		}
	}, [matches, other_user.id]);

	const user_pictures = other_user.pictures.filter(
		(p) => p.id !== other_user.picture?.id,
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
				className={
					'user-profile flex relative border-4 w-3/4 h-5/6 rounded-xl max-w-4xl sm:max-h-[45rem] no-scrollbar ' +
					(isDesktop
						? 'flex-row overflow-hidden '
						: 'flex-col overflow-y-auto ') +
					(isAMatch ? 'border-red-500' : '')
				}
			>
				{isDesktop ? (
					<>
						<div className="bg-orange-500 w-1/2 h-full overflow-y-auto no-scrollbar">
							<MImage
								src={`${other_user.picture?.path}`}
								alt="Avatar"
								className="inset-0 h-full w-full object-cover"
								key={other_user.picture?.id}
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
							{isAMatch && (
								<div className="absolute p-1 top-0 left-0 flex flex-row text-white text-xl font-bold bg-gradient-to-r from-red-500 to-amber-400 w-full text-center justify-center items-center">
									<div className="text-xl pe-3">🔥</div>
									{"It's a match!"}
								</div>
							)}
							{other_user.blocks?.by_me && (
								<div className="absolute top-0 left-0 text-red-500 italic font-light border-red-500 border-b w-full text-center">
									{'User is blocked'}
								</div>
							)}
							<UserInfo
								my_user={my_user}
								other_user={other_user}
								status={status}
							/>
							<UserBio user={other_user} />
							<UserActions
								user={other_user}
								isFetching={isFetching}
							/>
						</div>
					</>
				) : (
					<>
						{isAMatch && (
							<div className="absolute p-1 top-0 left-0 flex flex-row text-white text-xl font-bold bg-gradient-to-r from-red-500 to-amber-400 w-full text-center justify-center items-center">
								<div className="text-xl pe-3">🔥</div>
								{"It's a match!"}
							</div>
						)}
						{other_user.blocks?.by_me && (
							<div className="absolute top-0 left-0 text-white italic font-light border-red-500 bg-red-500 border-b w-full text-center">
								{'User is blocked'}
							</div>
						)}
						<MImage
							src={`${other_user.picture?.path}`}
							alt="Avatar"
							className="inset-0 h-[34rem] object-cover"
							key={other_user.picture?.id}
						/>
						<div className="flex flex-col p-3">
							<UserInfo
								my_user={my_user}
								other_user={other_user}
								status={status}
							/>
							<UserBio user={other_user} />
							<UserActions
								user={other_user}
								isFetching={isFetching}
							/>
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
