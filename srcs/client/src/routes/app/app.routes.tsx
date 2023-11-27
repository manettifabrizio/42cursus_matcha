import ProtectedLayout from '@/component/layout/protected';
import { RouteObject } from 'react-router-dom';
import Home from './home';

// Route -----------------------------------------------------------------------
export const appRoutes: RouteObject[] = [
	{
		path: '/',
		lazy: () => import('./landing_page'),
	},
	{
		element: <ProtectedLayout accepted="AUTHENTICATED" />,
		children: [
			{
				path: '/home',
				element: <Home />,
				children: [
					{
						path: '',
						lazy: () => import('./home/main_page'),
					},
					{
						path: ':id',
						lazy: () => import('./home/id'),
					},
				],
			},
		],
	},
];
