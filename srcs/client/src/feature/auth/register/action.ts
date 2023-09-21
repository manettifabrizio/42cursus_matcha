import type { ActionFunction } from "react-router-dom";
import type { ApiErrorResponse } from "@/core/api";
import { redirect } from "react-router-dom";
import { store } from "@/core/store";
import { isRTKQFetchBaseQueryError } from "@/tool/isRTKQError";
import { authApi } from "../api.slice";

// Type ------------------------------------------------------------------------
export type FormFields = {
	
}

export type RegisterError = {
  username: string[];
  password: string[];
  password_confirm: string[];
  email: string[];
  firstname: string[];
  lastname: string[];
};

// Action ----------------------------------------------------------------------
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

	console.log(form)

  // Note: Find better way to handle types
  const fields = {
    username: form.get("username") as string,
    password: form.get("password") as string,
    password_confirm: form.get("password_confirm") as string,
    email: form.get("email") as string,
    firstname: form.get("firstname") as string,
    lastname: form.get("lastname") as string,
  };

  const req = store.dispatch(authApi.endpoints.register.initiate(fields));

  try {
    const res = await req.unwrap();

    return redirect(`/auth/login?id=${res.id}`);
  } catch (error: unknown) {
    if (isRTKQFetchBaseQueryError(error)) {
      const registerError = error.data as ApiErrorResponse<RegisterError>;

      if ("cause" in registerError.error) {
        return { username: [registerError.error.cause] };
      }

      return registerError.error;
    }

    return null;
  }
};
