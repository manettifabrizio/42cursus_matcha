import ProtectedLayout from '@/component/layout/protected';
import { RouteObject } from 'react-router-dom';

// Route -----------------------------------------------------------------------
export const appRoutes: RouteObject[] =
[
	{
		element: <ProtectedLayout accepted='AUTHENTICATED' />,
		children:
		[
			{
				path: '/',
				lazy: () => import('./home'),
			},
		],
	},
];
