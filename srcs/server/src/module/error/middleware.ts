import { ErrorRequestHandler } from 'express';

import { DatabaseException }   from '@/core/database/exception';
import { ValidationException } from '@/core/validation/exception';


export const middleware : ErrorRequestHandler =  async (err, req, res, next) =>
{
	console.log("Error::Middleware\n")
	console.log(err);

	if (err instanceof DatabaseException)
	{
		// Todo: Better handling of cases
		switch (err.data.type)
		{
			case 'UniqueConstraintViolation':
				err = new ValidationException({
					[err.data.column]: [ `Already in use.` ],
				});
				break;
			case 'ForeignKeyConstraintViolation':
				err = new ValidationException({
					[err.data.column]: [ 'Does not exists.' ]
				});
				break;
			default:
				break;
		}
	}

	if (err instanceof ValidationException)
	{
		res.status(422).json({
			status:
			{
				code: 422,
				status: "Unprocessable Content",
			},
			data: err.data,
		});
		return;
	}

	res.status(500).json({
		status:
		{
			code: 500,
			text: 'Internal Server Error',
		},
		data: err
	});
};
