import { RouteObject } from 'react-router-dom';
import SidebarMainContent from '../home';
import ProtectedLayout from '@/component/layout/protected';

export const chatRoutes: RouteObject[] = [
	{
		element: <ProtectedLayout accepted="AUTHENTICATED" />,
		children: [
			{
				path: 'chat',
				element: <SidebarMainContent form={false} logo={false} />,
				children: [{ path: ':id', lazy: () => import('./id') }],
			},
		],
	},
];
