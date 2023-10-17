import { body } from 'express-validator';

// Format ----------------------------------------------------------------------
export const checkIdUser = () =>
	body('id')
		.trim()
		.isInt({ min: 1 })
		.withMessage(`User id must be an integer > 0.`)
		.toInt();
