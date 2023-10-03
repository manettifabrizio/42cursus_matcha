import { Link } from 'react-router-dom';

// Component -------------------------------------------------------------------
export function Component() {
    return (
        <>
            <h1>Error::NotFound</h1>

            <Link to="/">Back to homepage</Link>
        </>
    );
}

Component.displayName = 'Error::NotFound';
