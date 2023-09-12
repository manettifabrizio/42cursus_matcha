import { RouteObject } from 'react-router-dom';
import ProtectedLayout from '@/component/layout/protected';

// Route -----------------------------------------------------------------------
export const authRoutes: RouteObject[] =
[
	{
		element: <ProtectedLayout accepted='UNAUTHENTICATED' />,
		children:
		[
			{
				path: 'auth/login',
				lazy: () => import('./login'),
			},
			{
				path: 'auth/register',
				lazy: () => import('./register'),
			},
		]
	},
	{
		element: <ProtectedLayout accepted='AUTHENTICATED' />,
		children:
		[
			{
				path: 'auth/logout',
				lazy: () => import('./logout'),
			},
		]
	},
];
