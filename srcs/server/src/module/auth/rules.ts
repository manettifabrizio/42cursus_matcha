import { body } from 'express-validator';


export const checkUsername = () =>
	body('username')
	.trim()
	.isLength({ min: 6, max: 42 })
	.withMessage("Username must be between 6 and 42 characters long.")
	.matches(/[a-zA-Z0-9-_\.]+/) // Url-safe for confirmation link
	.withMessage("Username can only contains: letters (a-z, A-Z), numbers (0-9), dot (.), hyphen (-) and underscore (_).")
;

export const checkPassword = () =>
	body('password')
	.trim()
	.isLength({ min: 8, max: 64 })
	.withMessage("Password must be between 8 and 64 characters long.")
	.matches(/(.*[^0-9a-zA-Z]+.*)/)
	.withMessage("Password must contains: at least 1 non-alphanumeric character.")
;

export const checkPasswordConfirm = () =>
	body('password_confirm')
	.trim()
	.custom((value: string, { req }) =>
	{
		if (value !== req.body['password'])
			throw new Error("Password confirmation mismatch.");

		return true;
	})
;

export const checkEmail = () =>
	body('email')
	.trim()
	.isEmail()
	.withMessage("Email is invalid.")
;
