import type { ExtendedError } from 'socket.io/dist/namespace';
import * as io from 'socket.io';
import * as Config from '@/Config';
import { service as jwt_svc } from '@/core/jwt/service';

// Middleware ------------------------------------------------------------------
export const middleware = (
	client: io.Socket,
	next: (err?: ExtendedError | undefined) => void,
) => {
	const { token } = client.handshake.auth;

	try {
		client.data.user = jwt_svc.verifyToken(token, Config.JWT_ACCESS_SECRET);
		return next();
	} catch (err: unknown) {
		return next(new Error('Invalid credentials.'));
	}
};
