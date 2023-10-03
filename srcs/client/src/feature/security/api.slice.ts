import { api } from '@/core/api';

// Type ------------------------------------------------------------------------
type CsrfReq = void;
type CsrfRes = void;

// Api -------------------------------------------------------------------------
export const securityApi = api.injectEndpoints({
    endpoints: (build) => ({
        getCsrfToken: build.mutation<CsrfRes, CsrfReq>({
            query: () => ({
                url: `security/csrf`,
                method: 'GET'
            })
        })
    })
});

// Hook ------------------------------------------------------------------------
export const { useGetCsrfTokenMutation } = securityApi;
