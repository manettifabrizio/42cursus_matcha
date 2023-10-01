import { body } from 'express-validator';

// Rules -----------------------------------------------------------------------
export const checkIdUser = () =>
	body('id')
	.trim()
	.isInt({ min: 1 })
	.withMessage(`User id must be an integer > 0.`)
	.toInt()
;

export const checkIdTag = () =>
	body('id')
	.trim()
	.isInt({ min: 1 })
	.withMessage(`Tag id must be an integer > 0.`)
	.toInt()
;
