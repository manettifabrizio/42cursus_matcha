import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/component/layout/root';
import { appRoutes } from '@/routes/app/app.routes';
import { authRoutes } from '@/routes/auth/auth.routes';
import { userRoutes } from '@/routes/user/user.routes';
import { errorRoutes } from '@/routes/error/error.routes';

// Router ----------------------------------------------------------------------
export const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <RootLayout />,
			children: [
				...appRoutes,
				...authRoutes,
				...userRoutes,
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
