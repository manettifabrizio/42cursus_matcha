import { Exception } from '@/core/exception';


export type Cause =
	'NotFound'
;

type Data =
{
	cause: Cause;
	details?: string|string[];
};

export class NotFoundException
	extends Exception<Data>
{
	constructor(data: Data)
	{
		super(data);
	}
};
