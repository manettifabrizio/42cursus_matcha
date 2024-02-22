import { toggleSidebar } from '@/feature/interactions/store.slice';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const MenuItems = [
	{
		name: 'Profile',
		path: '/user/profile/edit',
	},
	{
		name: 'Pictures',
		path: '/user/profile/pictures',
	},
	{
		name: 'Sign In & security',
		path: '/user/profile/auth',
	},
	{
		name: 'Liked',
		path: '/user/profile/likes',
	},
	{
		name: 'Visits',
		path: '/user/profile/views',
	},
	{
		name: 'Blocked Users',
		path: '/user/profile/blocked',
	},
];

type ProfileMenuProps = {
	isDesktop: boolean;
};

export default function ProfileMenu({ isDesktop }: ProfileMenuProps) {
	const location = useLocation();
	const dispatch = useDispatch();

	return (
		<div className="flex-1 overflow-auto h-full">
			<div className="flex flex-col h-full">
				{!isDesktop && (
					<div className="text-3xl text-start w-full font-bold mb-3">
						Profile Settings
					</div>
				)}
				<div className="flex flex-col justify-center items-center h-full">
					{MenuItems.map((item, index) => (
						<Link
							to={item.path}
							key={index}
							onClick={() => {
								dispatch(toggleSidebar(false));
							}}
							className={
								'flex justify-center rounded-xl hover:bg-gray-700 p-2 m-2 ' +
								(location.pathname === item.path
									? 'font-bold'
									: '')
							}
						>
							{item.name}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
