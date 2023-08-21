import { Exception } from '../exception';


export type Cause =
	  'TokenExpired'
	| 'TokenNotBefore'
	| 'TokenInvalid'
;

type Data =
{
	cause: Cause;
};

export class JwtException
	extends Exception<Data>
{
	constructor(data: Data)
	{
		super(data);
	}
};
