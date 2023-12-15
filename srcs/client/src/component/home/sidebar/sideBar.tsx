import { store } from '@/core/store';
import { useLocation, useNavigate } from 'react-router-dom';
import Matches from './home_sidebar/matches';
import { startDisconnecting } from '@/feature/chat/store.slice';
import ChatsList from './home_sidebar/chats';
import { useEffect, useState } from 'react';
import ProfileMenu from './profile_sidebar/menu';
import { useGetProfileQuery } from '@/feature/user/api.slice';
import LoadingSpinner from '@/component/ui/loadingSpinner';
import SideBarPhoto from './sideBarPhoto';

export default function SideBar() {
	const [url, setUrl] = useState<'home' | 'user'>('home');
	const location_state = useLocation();
	const navigate = useNavigate();
	const { data = undefined, isFetching, isLoading } = useGetProfileQuery();

	useEffect(() => {
		if (location_state.pathname.startsWith('/home')) setUrl('home');
		else if (location_state.pathname.startsWith('/user')) setUrl('user');
	}, [location_state]);

	return (
		<div className="w-72 h-screen fixed left-0 border-r ">
			<div className="flex flex-col p-4 h-full">
				{/* Profile section */}
				<div className="relative mb-4">
					{!data || isLoading || isFetching ? (
						<div className="w-full h-16 flex justify-center items-center">
							<LoadingSpinner size="sm" />
						</div>
					) : (
						<SideBarPhoto url={url} user={data} />
					)}
				</div>
				{url === 'home' ? (
					<>
						<Matches />
						<ChatsList />
					</>
				) : (
					<ProfileMenu />
				)}

				{/* Logout Button */}
				<button
					onClick={() => {
						store.dispatch(startDisconnecting());
						navigate('/auth/logout', { replace: true });
					}}
					className="text-center underline"
				>
					Logout
				</button>
			</div>
		</div>
	);
}
