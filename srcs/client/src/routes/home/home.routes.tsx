import ProtectedLayout from '@/component/layout/protected';
import { RouteObject } from 'react-router-dom';
import MainPage from './main_page';
import SidebarMainContent from '.';

// Route -----------------------------------------------------------------------
export const homeRoutes: RouteObject[] = [
	{
		element: <ProtectedLayout accepted="AUTHENTICATED" />,
		children: [
			{
				element: <SidebarMainContent form={false} />,
				children: [
					{
						path: 'home',
						element: <MainPage />,
					},
				],
			},
		],
	},
];
