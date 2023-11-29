import { Link } from 'react-router-dom';

const MenuItems = [
	{
		name: 'Profile',
		path: '/user/profile/edit',
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
	return (
		<div className="flex-1 overflow-auto">
			<div className="flex flex-col">
                {MenuItems.map((item, index) => (
                    <Link to={item.path} key={index} className="flex justify-center rounded-xl hover:bg-gray-700 p-2 m-2">
                        {item.name}
                    </Link>
                ))}
			</div>
		</div>
	);
}
