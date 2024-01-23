import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/component/layout/root';
import { homeRoutes } from '@/routes/home/home.routes';
import { authRoutes } from '@/routes/auth/auth.routes';
import { userRoutes } from '@/routes/user/user.routes';
import { errorRoutes } from '@/routes/error/error.routes';
import { chatRoutes } from '@/routes/chat/chat.routes';

// Router ----------------------------------------------------------------------
export const router = createBrowserRouter(
	[
		{
			element: <RootLayout />,
			children: [
				{
					path: '/',
					lazy: () => import('@/routes/landing_page'),
				},
				...homeRoutes,
				...authRoutes,
				...userRoutes,
				...chatRoutes,
				...errorRoutes,
			],
		},
	],
	{
		future: {
			v7_normalizeFormMethod: true,
		},
	},
);
