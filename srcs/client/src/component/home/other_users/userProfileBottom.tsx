import {
	useBlockUserMutation,
	useLikeUserMutation,
	useReportUserMutation,
	useUnblockUserMutation,
	useUnlikeUserMutation,
	useUnreportUserMutation,
} from '@/feature/user/api.slice';
import { FaHeart } from 'react-icons/fa';
import { IoMdHeartDislike } from 'react-icons/io';
import { SlOptionsVertical } from 'react-icons/sl';
import { useEffect, useRef, useState } from 'react';
import { Profile } from '@/feature/user/types';
import LoadingSpinner from '@/component/ui/loadingSpinner';
import toast from 'react-hot-toast';
import { StoreState, store } from '@/core/store';
import {
	addLikedUser,
	addNotification,
	rmLikedUser,
} from '@/feature/interactions/store.slice';
import { matchToast } from '@/component/ui/customToasts';
import { createNotification } from '@/feature/interactions/notificationsContent';
import { useDispatch, useSelector } from 'react-redux';
import { manageRTKQErrorCause } from '@/tool/isRTKQError';

type UserActionsProps = {
	user: Profile;
	isFetching: boolean;
};

export default function UserActions({ user, isFetching }: UserActionsProps) {
	const [likeUser, { error: likeUserError }] = useLikeUserMutation();
	const [unlikeUser, { error: unlikeUserError }] = useUnlikeUserMutation();
	const [blockUser, { error: blockUserError }] = useBlockUserMutation();
	const [unblockUser, { error: unblockUserError }] = useUnblockUserMutation();
	const [reportUser, { error: reportUserError }] = useReportUserMutation();
	const [unreportUser, { error: unreportUserError }] =
		useUnreportUserMutation();
	const [show, setShow] = useState(false);
	const dropdownBtnRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const interactionsState = useSelector(
		(state: StoreState) => state.interactions,
	);
	const dispatch = useDispatch();

	const distance = user.location
		? Math.floor(user.location?.distance)
		: undefined;
	const LikeUser = async () => {
		await likeUser({ id: user.id });
		dispatch(addLikedUser({ liked_user: user }));
		if (user.likes?.to_me) {
			matchToast(user.firstname ?? '', user.id);

			dispatch(
				addNotification(
					createNotification(
						interactionsState.notifications.length,
						'match',
						user.firstname ?? '',
						user.id,
						interactionsState.notifications_open,
					),
				),
			);
		}
	};

	const UnlikeUser = async () => {
		await unlikeUser({ id: user.id });
		store.dispatch(rmLikedUser({ unliked_user_id: user.id }));
	};

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				dropdownBtnRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				!dropdownBtnRef.current.contains(event.target as Node)
			)
				setShow(false);
		};

		window.addEventListener('mousedown', handleOutsideClick);

		return () => {
			window.removeEventListener('mousedown', handleOutsideClick);
		};
	});

	useEffect(() => {
		const errorVariables = [
			{ error: likeUserError, message: 'Error liking user' },
			{ error: unlikeUserError, message: 'Error unliking user' },
			{ error: blockUserError, message: 'Error blocking user' },
			{ error: unblockUserError, message: 'Error unblocking user' },
			{ error: reportUserError, message: 'Error reporting user' },
			{ error: unreportUserError, message: 'Error unreporting user' },
		];

		for (const { error, message } of errorVariables) {
			if (error) {
				toast.error(message);
				manageRTKQErrorCause(error);
				break;
			}
		}
	}, [
		likeUserError,
		unlikeUserError,
		blockUserError,
		unblockUserError,
		reportUserError,
		unreportUserError,
	]);

	return (
		<>
			{distance != undefined && (
				<div className="my-3 text-xl">{distance} km away</div>
			)}
			<div className="flex flex-row w-full justify-center mt-2">
				{isFetching ? (
					<LoadingSpinner size="sm" />
				) : (
					<>
						<button
							disabled={user.blocks?.by_me}
							className={
								'flex flex-row justify-center items-center px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-400 w-full me-4 ' +
								(!user.blocks?.by_me
									? 'hover:from-red-600/80 hover:to-amber-400/80'
									: 'opacity-50')
							}
							onClick={async () => {
								!user.likes?.by_me
									? await LikeUser()
									: await UnlikeUser();
							}}
						>
							{!user.likes?.by_me ? (
								<>
									<FaHeart className="me-2" />
									Like
								</>
							) : (
								<>
									<IoMdHeartDislike className="me-2" />
									Unlike
								</>
							)}
						</button>
						<div className="relative">
							<button
								ref={dropdownBtnRef}
								className="rounded-xl p-2 text-2xl hover:bg-white hover:text-black hover:border-black transition"
								onClick={() => {
									setShow((s) => !s);
								}}
							>
								<SlOptionsVertical />
							</button>
							<div
								ref={dropdownRef}
								className={`items-end absolute bottom-11 right-0 mt-1 z-10 p-2 bg-black border-2 rounded-xl w-40 ${
									show ? '' : 'hidden'
								}`}
							>
								<div className="flex flex-col">
									<button
										className="p-2 hover:bg-gray-600 w-full rounded-xl text-start"
										onClick={async () => {
											!user.blocks?.by_me
												? await blockUser({
														id: user.id,
												  })
												: await unblockUser({
														id: user.id,
												  });
											setShow(false);
										}}
									>
										{!user.blocks?.by_me
											? 'Block'
											: 'Unblock'}
									</button>
									<button
										className="p-2 hover:bg-gray-600 w-full rounded-xl text-start"
										onClick={async () => {
											!user.reports?.by_me
												? await reportUser({
														id: user.id,
												  })
												: await unreportUser({
														id: user.id,
												  });
											setShow(false);
										}}
									>
										{!user.reports?.by_me
											? 'Report as fake'
											: 'Unreport'}
									</button>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
}
