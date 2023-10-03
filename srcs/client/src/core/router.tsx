import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/component/layout/root';
import { appRoutes } from '@/page/app/app.routes';
import { authRoutes } from '@/page/auth/auth.routes';
import { userRoutes } from '@/page/user/user.routes';
import { errorRoutes } from '@/page/error/error.routes';

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
                ...errorRoutes
            ]
        }
    ],
    {
        future: {
            v7_normalizeFormMethod: true
        }
    }
);
