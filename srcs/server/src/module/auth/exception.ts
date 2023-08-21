import { Exception } from '@/core/exception';


type Data =
{
	cause: string;
};

export class AuthException
	extends Exception<Data>
{
	constructor(data: Data)
	{
		super(data);
	}
};
