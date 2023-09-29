import { Exception } from '@/core/exception';

// Type ------------------------------------------------------------------------
export type Cause =
	'NotFound'|'Forbidden'
;

type Data =
{
	cause: Cause;
	details?: string|string[];
};

// Class -----------------------------------------------------------------------
export class NotFoundException
	extends Exception<Data>
{
	constructor(details?: Data['details'])
	{
		super({
			cause: 'NotFound',
			details,
		});
	}
};

export class ForbiddenException
	extends Exception<Data>
{
	constructor(details?: Data['details'])
	{
		super({
			cause: 'Forbidden',
			details,
		});
	}
};
