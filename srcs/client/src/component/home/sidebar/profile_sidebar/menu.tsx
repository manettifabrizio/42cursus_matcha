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
		name: 'Likes',
		path: '/user/profile/likes',
	},
	{
		name: 'Visits',
		path: '/user/profile/views',
	},
	{
		name: 'Block',
		path: '/user/profile/blocked',
	},
];

export default function ProfileMenu() {
	const location = useLocation();

	return (
		<div className="flex-1 overflow-auto">
			<div className="flex flex-col">
				{MenuItems.map((item, index) => (
					<Link
						to={item.path}
						key={index}
						className={
							'flex justify-center rounded-xl hover:bg-gray-700 p-2 m-2 ' +
							(location.pathname === item.path ? 'font-bold' : '')
						}
					>
						{item.name}
					</Link>
				))}
			</div>
		</div>
	);
}
