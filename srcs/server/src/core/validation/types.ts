import { ValidationChain } from 'express-validator';


export type ValidationFields =
{
	body?: any;
	cookie?: any;
	param?: any;
	header?: any;
	query?: any
};

export type ValidationErrors =
	Record<string, string[]>
;

export interface ValidationService
{
	validate: <T extends Record<string, any>>(
		fields: ValidationFields,
		rules: ValidationChain[]
	) => Promise<T>;
};
