import type { ValidationService } from '@/core/validation/types';
import * as Rules                 from '../../rules';

// Type ------------------------------------------------------------------------
type ValidationInput =
{
	ids: (string|number)[];
};

type ValidationOuput =
{
	ids: number[];
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
		Rules.checkIdBulk(),
	];

	return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
