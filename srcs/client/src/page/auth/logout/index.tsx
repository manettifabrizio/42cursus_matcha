import Logout from '@/feature/auth/logout';

// Loader ----------------------------------------------------------------------
export { loader } from '@/feature/auth/logout/loader';

// Component -------------------------------------------------------------------
export function Component() {
    return (
        <>
            <h1>Auth::Logout</h1>

            <Logout />
        </>
    );
}

Component.displayName = 'Auth::Logout';
