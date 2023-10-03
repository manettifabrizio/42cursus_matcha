import type { ErrorRequestHandler } from 'express';
import { HttpException }            from '@/core/exception';
import { DatabaseException }        from '@/core/database/exception';
import { ValidationException }      from '@/core/validation/exception';
import { JwtException }             from '@/core/jwt/exception';
import { UploadException }          from '@/core/upload/exception';

// Function --------------------------------------------------------------------
export const middleware: ErrorRequestHandler =  async (err, req, res, next) =>
{
	if (err instanceof DatabaseException)
	{
		switch (err.data.cause)
		{
			case 'Query:ConstraintsViolation:Unique':
				err = new ValidationException({
					[err.data.details!.column]: [ `Already in use.` ],
				});
				break;
			case 'Query:ConstraintsViolation:ForeignKey':
				err = new ValidationException({
					[err.data.details!.column]: [ `Does not exist.` ],
				});
				break
			case 'Query:ConstraintsViolation:Restrict':
				err = new ValidationException({
					[err.data.details!.column]: [ err.data.message ],
				});
				break;
			default:
				break;
		}
	}

	if (err instanceof UploadException)
	{
		err = new ValidationException(err.data);
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
	else if (err instanceof JwtException)
	{

		response.status.code = 401;
		response.status.text = 'Unauthorized';
		response.error = err.data;
	}
	else if (err instanceof HttpException)
	{
		response.status.code = err.code;
		response.status.text = err.type;
		response.error = err.data;
	}

	res.status(response.status.code).json(response);
};
