import { body } from 'express-validator';

// Format ----------------------------------------------------------------------
export const checkId = () =>
	body('id')
	.trim()
	.isInt({ min: 1 })
	.withMessage(`User id must be an integer > 0.`)
	.toInt()
;

export const checkIdFrom = () =>
	body('id_from')
	.trim()
	.isInt({ min: 1 })
	.withMessage(`User id_from must be an integer > 0.`)
	.toInt()
;

export const checkIdPicture = () =>
	body('id_picture')
	.trim()
	.isInt({ min: 1 })
	.withMessage(`Picture id must be an integer > 0.`)
	.toInt()
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

export const checkBirthdate = () =>
	body('birthdate')
	.trim()
	.isDate()
	.withMessage(`Birthdate format is invalid.`)
	.toDate()
	.custom((value) =>
	{
		if (new Date(value).getTime() >= Date.now())
		{
			throw new Error(`Birthdate cannot be in the future.`);
		}

		return true;
	})
;

export const checkGender = () =>
	body('gender')
	.trim()
	.toUpperCase()
	.custom((value) =>
	{
		if (!['MALE', 'FEMALE'].includes(value))
		{
			throw new Error("Gender must be either MALE or FEMALE.");
		}

		return true;
	})
;

export const checkOrientation = () =>
	body('orientation')
	.trim()
	.toUpperCase()
	.custom((value) =>
	{
		if (!['BISEXUAL', 'HOMOSEXUAL', 'HETEROSEXUAL'].includes(value))
		{
			throw new Error("Orientation must be either BISEXUAL, HOMOSEXUAL, or HETEROSEXUAL.");
		}

		return true;
	})
;

export const checkBiography = () =>
	body('biography')
	.trim()
	.isLength({ max: 2048 })
	.withMessage(`Biography can only be up to 2048 characters long.`)
;

export const checkLatitude = () =>
	body('location.latitude')
	.trim()
	.isFloat({ min: -90, max: 90 }) // Todo: Verify limits
	.withMessage(`Latitude must be a float between -90 and 90.`)
	.toFloat()
;

export const checkLongitude = () =>
	body('location.longitude')
	.trim()
	.isFloat({ min: -180, max: 180 }) // Todo: Verify limits
	.withMessage(`Longitude must be a float between -180 and 180.`)
	.toFloat()
;
