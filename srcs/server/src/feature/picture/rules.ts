import { body } from 'express-validator';

// Not Empty -------------------------------------------------------------------
export const checkId = () =>
	body('id')
	.trim()
	.isInt({ min: 1 })
	.withMessage(`Picture id from must be an integer > 0.`)
	.toInt()
;

export const checkUserId = () =>
	body('id_user')
	.trim()
	.isInt({ min: 1 })
	.withMessage(`User id from must be an integer > 0.`)
	.toInt()
;

export const checkPath = () =>
	body('path')
	.trim()
	.isLength({ min: 1 })
	.withMessage(`Picture path can't be empty.`)
;
