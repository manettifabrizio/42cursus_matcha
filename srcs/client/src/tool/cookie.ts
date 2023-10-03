// Type ------------------------------------------------------------------------
type Cookies = Readonly<Record<string, string>>;

// Tool ------------------------------------------------------------------------
export const cookie = (name: string): string | null => {
    const cookies: Cookies = document.cookie
        .split('; ')
        .reduce((cookies, cookie) => {
            const separator = cookie.indexOf('=');

            return {
                ...cookies,
                [cookie.slice(0, separator)]: cookie.slice(separator + 1)
            };
        }, {});

    return cookies[name] ?? null;
};
