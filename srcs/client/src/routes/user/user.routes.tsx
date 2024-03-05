import { Navigate, RouteObject } from 'react-router-dom';
import ProtectedLayout from '@/component/layout/protected';
import SidebarMainContent from '../home';

// Route -----------------------------------------------------------------------
export const userRoutes: RouteObject[] = [
	{
		element: <ProtectedLayout accepted="AUTHENTICATED" />,
		children: [
			{
				path: 'user',
				element: <SidebarMainContent form={false} />,
				children: [{ path: ':id', lazy: () => import('./id') }],
			},
			{
				path: 'user/profile',
				element: <SidebarMainContent />,
				children: [
					{
						index: true,
						element: <Navigate to="edit" replace />,
					},
					{
						path: 'edit',
						lazy: () => import('./profile/edit'),
					},
					{
						path: 'pictures',
						lazy: () => import('./profile/pictures'),
					},
					{
						path: 'auth',
						lazy: () => import('./profile/auth'),
					},
				],
			},
			{
				path: 'user/profile',
				element: <SidebarMainContent form={false} />,
				children: [
					{
						path: 'likes',
						lazy: () => import('./profile/likes'),
					},
					{
						path: 'liked',
						lazy: () => import('./profile/liked'),
					},
					{
						path: 'views',
						lazy: () => import('./profile/views'),
					},
					{
						path: 'blocked',
						lazy: () => import('./profile/blocked'),
					},
				],
			},
			{
				path: 'user/complete-profile',
				lazy: () => import('./complete-profile'),
			},
		],
	},
];
