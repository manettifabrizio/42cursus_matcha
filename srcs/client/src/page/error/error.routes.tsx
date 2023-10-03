import { RouteObject } from 'react-router-dom';

// Route -----------------------------------------------------------------------
export const errorRoutes: RouteObject[] = [
    {
        path: '*',
        lazy: () => import('./not-found')
    }
];
