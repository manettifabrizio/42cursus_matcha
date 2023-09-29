import type { ValidationService } from '@/core/validation/types';
import * as Rules                 from '../../rules';

// Type ------------------------------------------------------------------------
type ValidationInput =
{
	id: string|number;
};

type ValidationOuput =
{
	id: number;
};

// Function --------------------------------------------------------------------
export const validate = async (
	validation_svc: ValidationService,
	dto: ValidationInput,
)
	: Promise<ValidationOuput> =>
{
	const rules =
	[
		Rules.checkId(),
	];

	return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
