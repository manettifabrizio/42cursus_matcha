import { StoreState } from '@/core/store';
import {
	isUserOnline,
	resetIsUserOnline,
} from '@/feature/interactions/store.slice';
import { Profile } from '@/feature/user/types';
import { useStoreDispatch } from '@/hook/useStore';
import { formatDateTime } from '@/tool/userTools';
import { useEffect } from 'react';
import { FaChevronLeft } from 'react-icons/fa6';
import { LuDot } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MImage from '../ui/mImage';
import { useMediaQuery } from 'react-responsive';
import { BackToMenuArrow } from '../home/sidebar/sidebar_main_content/profile_sidebar/backToMenuArrow';

type ChatTopProps = {
	user: Profile;
};

export default function ChatTop({ user }: ChatTopProps) {
	const dispatch = useStoreDispatch();
	const isDesktop = useMediaQuery({ query: '(min-width: 640px)' });
	const status = useSelector(
		(state: StoreState) => state.interactions.user_status,
	);

	const age = user.birthdate
		? Math.floor(
				(Date.now() - new Date(user.birthdate).getTime()) / 31536000000,
		  )
		: undefined;

	useEffect(() => {
		const checkUserStatus = async () => {
			dispatch(isUserOnline({ id_user: user.id }));
		};

		// Double view notification because of react.Strict mode
		const timer = setInterval(checkUserStatus, 1000);

		return () => {
			dispatch(resetIsUserOnline());
			clearInterval(timer);
		};
	}, [dispatch, user.id]);

	return (
		<div className="flex flex-row w-full px-2 pt-2">
			{isDesktop ? (
				<Link to="/home" className="flex m-3 text-xl">
					<FaChevronLeft />
				</Link>
			) : (
				<BackToMenuArrow chat={true} />
			)}
			<Link className="flex flex-row" to={`/user/${user.id}`}>
				<MImage
					src={`${user.picture?.path}`}
					alt="Avatar"
					className="mr-2 inset-0 h-12 w-12 object-cover rounded-full"
				/>
				<div className="flex flex-wrap flex-col">
					<p className="font-bold">{user.firstname}</p>
					<div className={`flex flex-row items-center`}>
						<div className="whitespace-nowrap">{age} yrs</div>{' '}
						<LuDot className="m-1" />
						{status != undefined ? (
							<div
								className={
									`no-scrollbar h-full w-full italic whitespace-nowrap overflow-x-scroll ` +
									(typeof status === 'boolean'
										? 'text-green-500'
										: 'text-gray-300')
								}
							>
								{typeof status === 'boolean'
									? 'online'
									: 'last seen at ' +
									  formatDateTime(new Date(status))}
							</div>
						) : (
							<div className="italic text-gray-300">
								loading...
							</div>
						)}
					</div>
				</div>
			</Link>
		</div>
	);
}
