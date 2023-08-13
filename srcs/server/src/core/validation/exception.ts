export class ValidationException
	extends Error
{
	private _errors: Record<string, string[]>;

	constructor(errors: Record<string, string[]>)
	{
		super();
		this._errors = errors;
	}

	public get errors()
	{
		return this._errors;
	}
};
