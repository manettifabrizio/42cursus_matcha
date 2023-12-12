import { StoreState, store } from '@/core/store';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Matches from './home_sidebar/matches';
import { startDisconnecting } from '@/feature/chat/store.slice';
import ChatsList from './home_sidebar/chats';
import { useEffect, useState } from 'react';
import ProfileMenu from './profile_sidebar/menu';
import { FaChevronLeft } from 'react-icons/fa6';
import { useSelector } from 'react-redux';

export default function SideBar() {
	const [url, setUrl] = useState<'home' | 'user'>('home');
	const location_state = useLocation();
	const navigate = useNavigate();
	const user = useSelector((state: StoreState) => state.user);

	useEffect(() => {
		if (location_state.pathname.startsWith('/home')) setUrl('home');
		else if (location_state.pathname.startsWith('/user')) setUrl('user');
	}, [location_state]);

	return (
		<div className="w-72 h-screen fixed left-0 border-r ">
			<div className="flex flex-col p-4 h-full">
				{/* Profile section */}
				<div className="relative  mb-4">
					{url === 'user' && (
						<div
							className={`absolute top-1/2 -translate-y-1/2 left-0 `}
						>
							<Link
								to="/home"
								className="w-full flex m-3 text-xl"
							>
								<FaChevronLeft />
							</Link>
						</div>
					)}
					<Link
						to="/user/profile/edit"
						className={
							'flex items-center transition-all p-1 rounded-xl ' +
							(url === 'home' ? '' : 'justify-center')
						}
					>
						<img
							src={`${location.origin}/api/pictures/${user.picture?.path}`}
							alt="Profile"
							className={`rounded-full inset-0 object-cover ${
								url === 'home' ? 'h-12' : 'h-16'
							} ${url === 'home' ? 'w-12' : 'w-16'}`}
						/>
						{url === 'home' && (
							<div>
								<p className="font-bold ms-2">
									{user.firstname}
								</p>
							</div>
						)}
					</Link>
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
