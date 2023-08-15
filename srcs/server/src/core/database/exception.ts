export class DatabaseException
	extends Error
{
	private _data: any;

	constructor(data: any)
	{
		super();

		this._data = data;
	}

	public get data()
	{
		return this._data;
	}

};
