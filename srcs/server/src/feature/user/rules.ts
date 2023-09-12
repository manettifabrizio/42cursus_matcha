import { body } from 'express-validator';

// Format ----------------------------------------------------------------------
export const checkId = () =>
	body('id')
	.trim()
	.isInt({ min: 1 })
	.withMessage(`Id must be an integer.`)
;

export const checkFirstname = () =>
	body('firstname')
	.trim()
	.isLength({ min: 2, max: 21 })
	.withMessage(`Firstname can only be between 2 and 21 characters long.`)
	.matches(/[a-zA-Z][a-zA-Z-]+/)
	.withMessage(`Firstname can only contains: letters (a-z, A-Z), hyphen (-).`)
;

export const checkLastname = () =>
	body('lastname')
	.trim()
	.isLength({ min: 2, max: 21 })
	.withMessage(`Lastname can only be between 2 and 21 characters long.`)
	.matches(/[a-zA-Z][a-zA-Z-]+/)
	.withMessage(`Lastname can only contains: letters (a-z, A-Z), hyphen (-).`)
;
