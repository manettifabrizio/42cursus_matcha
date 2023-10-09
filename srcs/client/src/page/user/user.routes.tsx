import { RouteObject } from 'react-router-dom';
import ProtectedLayout from '@/component/layout/protected';
import { Component as CompleteProfile } from './complete-profile';

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
				element: <CompleteProfile />,
			},
		],
	},
];
