import type { ErrorRequestHandler } from 'express';
import { DatabaseException }        from '@/core/database/exception';
import { ValidationException }      from '@/core/validation/exception';
import { JwtException }             from '@/core/jwt/exception';
import { AuthException }            from '@/feature/auth/exception';
import { NotFoundException }        from '@/feature/error/exception';
import { ForbiddenException }       from '@/feature/error/exception';
import { SecurityException }        from '@/feature/security/exception';

// Function --------------------------------------------------------------------
export const middleware: ErrorRequestHandler =  async (err, req, res, next) =>
{
	if (err instanceof DatabaseException)
	{
		switch (err.data.cause)
		{
			case 'Query:ConstraintsViolation:Unique':
				err = new ValidationException({
					[err.data.details as string]: [ `Already in use.` ],
				});
				break;
			case 'Query:ConstraintsViolation:ForeignKey':
				err = new ValidationException({
					[err.data.details as string]: [ `Does not exist.` ],
				});
				break
			case 'Query:ConstraintsViolation:Restrict':
				err = new ValidationException({
					[err.data.details as string]: [ `Limit reached.` ],
				});
				break;
			default:
				break;
		}
	}

	const response =
	{
		status: {
			code: 500,
			text: 'Internal Server Error',
		},
		error: err
	};

	if (err instanceof ValidationException)
	{
		response.status.code = 422;
		response.status.text = 'Unprocessable Content';
		response.error = err.data;
	}
	else if (err instanceof AuthException || err instanceof JwtException || err instanceof SecurityException)
	{

		response.status.code = 401;
		response.status.text = 'Unauthorized';
		response.error = err.data;
	}
	else if (err instanceof NotFoundException)
	{
		response.status.code = 404;
		response.status.text = 'Not Found';
		response.error = err.data;
	}
	else if (err instanceof ForbiddenException)
	{
		response.status.code = 403;
		response.status.text = 'Forbidden';
		response.error = err.data;
	}

	res.status(response.status.code).json(response);
};
