import { RouteObject } from 'react-router-dom';
import ProtectedLayout from '@/component/layout/protected';

// Route -----------------------------------------------------------------------
export const authRoutes: RouteObject[] = [
	{
		// Layout Route https://reactrouter.com/en/main/start/concepts#layout-routes
		element: <ProtectedLayout accepted="UNAUTHENTICATED" />,
		children: [
			{
				path: 'auth/login',
				lazy: () => import('./login'),
			},
			{
				path: 'auth/reset-password',
				lazy: () => import('./reset-password'),
			},
			{
				path: 'auth/new-password',
				lazy: () => import('./new-password'),
			},
			{
				path: 'auth/new-password/confirm',
				lazy: () => import('./new-password/confirm'),
			},
			{
				path: 'auth/register',
				lazy: () => import('./register'),
			},
			{
				path: 'auth/confirm',
				lazy: () => import('./register/confirm'),
			},
		],
	},
	{
		path: 'auth/logout',
		lazy: () => import('./logout'),
	},
];
