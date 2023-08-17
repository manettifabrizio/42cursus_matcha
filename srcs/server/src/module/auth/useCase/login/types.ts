import { Account } from '../../entity';


export type ActionInput =
{
	username: string;
	password: string;
};

export type ValidationInput =
	ActionInput
;

export type ValidationOuput =
	ValidationInput
;

export type QueryInput =
	ValidationOuput
;

export type QueryOutput =
	Pick<Account, 'id'> | null
;

export type ActionOutput =
	QueryOutput
;
