import { RouteObject } from 'react-router-dom';
import ProtectedLayout from '@/component/layout/protected';
import SidebarMainContent from '../home';

// Route -----------------------------------------------------------------------
export const userRoutes: RouteObject[] = [
	{
		element: <ProtectedLayout accepted="AUTHENTICATED" />,
		children: [
			{
				path: 'user/profile',
				element: <SidebarMainContent/>,
				children: [
					{
						path: 'edit',
						lazy: () => import('./profile/edit'),
					},
                    {
                        path: 'likes',
                        lazy: () => import('./profile/views')
                    }
				],
			},
			{
				path: 'user/complete-profile',
				lazy: () => import('./complete-profile'),
			},
		],
	},
];
