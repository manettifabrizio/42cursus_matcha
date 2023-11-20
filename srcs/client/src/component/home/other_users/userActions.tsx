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

type UserActionsProps = {
	user: Profile;
};

// TODO : add a toast if one of the request fail and add loading spinner

export default function UserActions({ user }: UserActionsProps) {
	const [likeUser] = useLikeUserMutation();
	const [deleteLikeUser] = useUnlikeUserMutation();
	const [blockUser] = useBlockUserMutation();
	const [unblockUser] = useUnblockUserMutation();
	const [reportUser] = useReportUserMutation();
	const [unreportUser] = useUnreportUserMutation();
	const [show, setShow] = useState(false);
	const dropdownBtnRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

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

	return (
		<div className="flex flex-row w-full">
			<button
				className="flex flex-row justify-center items-center px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-400 w-full me-4 hover:from-red-600/80 hover:to-amber-400/80"
				onClick={() => {
					!user.likes?.by_me
						? likeUser({ id: user.id })
						: deleteLikeUser({ id: user.id });
				}}
			>
				{user.likes?.by_me ? (
					<>
						<FaHeart className="me-2" />
						Like
					</>
				) : (
					<>
						<IoMdHeartDislike className="me-2" />
						Dislike
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
							onClick={() => {
								!user.blocks?.by_me
									? blockUser({ id: user.id })
									: unblockUser({ id: user.id });
								setShow(false);
							}}
						>
							{!user.blocks?.by_me ? 'Block' : 'Unblock'}
						</button>
						<button
							className="p-2 hover:bg-gray-600 w-full rounded-xl text-start"
							onClick={() => {
								!user.reports?.by_me
									? reportUser({ id: user.id })
									: unreportUser({ id: user.id });
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
		</div>
	);
}
