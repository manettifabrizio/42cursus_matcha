import type { ValidationService } from "@/core/validation/types";
import type { Gender } from "../../entity";
import type { Orientation } from "../../entity";
import * as Rules from "../../rules";

// Type ------------------------------------------------------------------------
type ValidationInput = {
  id: string | number;
  id_picture?: string | number;
  firstname?: string;
  lastname?: string;
  birthdate?: string;
  gender?: string;
  orientation?: string;
  biography?: string;
  location?: {
    latitude: string | number;
    longitude: string | number;
  };
};

type ValidationOuput = {
  id: number;
  id_picture?: number;
  firstname?: string;
  lastname?: string;
  birthdate?: Date;
  gender?: Gender;
  orientation?: Orientation;
  biography?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
};

// Function --------------------------------------------------------------------
export const validate = async (
  validation_svc: ValidationService,
  dto: ValidationInput
): Promise<ValidationOuput> => {
  const rules = Object.entries(dto)
    .map(([key, value]) => {
      if (value === undefined) {
        return [];
      }

      switch (key) {
        case "id":
          return Rules.checkId();
        case "id_picture":
          return Rules.checkIdPicture();
        case "firstname":
          return Rules.checkFirstname();
        case "lastname":
          return Rules.checkLastname();
        case "birthdate":
          return Rules.checkBirthdate();
        case "gender":
          return Rules.checkGender();
        case "orientation":
          return Rules.checkOrientation();
        case "biography":
          return Rules.checkBiography();
        case "location":
          return [Rules.checkLatitude(), Rules.checkLongitude()];
        default:
          return [];
      }
    })
    .flat();

  return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
