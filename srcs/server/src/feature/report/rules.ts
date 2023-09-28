import { body } from 'express-validator';

// Not Empty -------------------------------------------------------------------
export const checkIdUserFrom = () =>
	body('id_user_from')
	.trim()
	.isInt({ min: 1 })
	.withMessage(`User id from must be an integer > 0.`)
	.toInt()
;

export const checkIdUserTo = () =>
	body('id_user_to')
	.trim()
	.isInt({ min: 1 })
	.withMessage(`User id from must be an integer > 0.`)
	.toInt()
	.custom((id, { req }) =>
	{
		if (id === req.body.id_user_from)
		{
			throw new Error(`You cannot report youself.`);
		}

		return true;
	})
;
