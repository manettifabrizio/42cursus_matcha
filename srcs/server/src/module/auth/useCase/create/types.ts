import { Account } from '../../entity';


export type ActionInput =
{
	username: string;
	password: string;
	password_confirm: string;
	email: string;
};

export type ValidationInput =
	ActionInput
;

export type ValidationOuput =
	Omit<ValidationInput, 'password_confirm'>
;

export type QueryInput =
	ValidationOuput
;

export type QueryOutput =
	Pick<Account, 'id'|'secret'>
;

export type ActionOutput =
	QueryOutput
;
