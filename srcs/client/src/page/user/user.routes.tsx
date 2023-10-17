import { RouteObject } from 'react-router-dom';
import ProtectedLayout from '@/component/layout/protected';

// Route -----------------------------------------------------------------------
export const userRoutes: RouteObject[] = [
	{
		element: <ProtectedLayout accepted="AUTHENTICATED" />,
		children: [
			{
				path: 'user/profile',
				lazy: () => import('./profile'),
			},
			{
				path: 'user/complete-profile',
				lazy: () => import('./complete-profile'),
			},
		],
	},
];
