export class FetchError extends Error {
    constructor(public response: Response, public uri: string, message?: string) {
        super(message);
    }
}

async function get<TYPE extends object>(uri: string): Promise<TYPE> {
    console.log('uri', uri);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await fetch(uri, {cache: 'force-cache'});
    if (!response.ok || response.redirected) {
        throw new FetchError(response, `${response.status} ${response.statusText}: ${uri}`);
    } else {
        return handleResponse(uri, response);
    }
}
async function post<TYPE extends object = object>(
    uri: string,
    body: object | string,
    loggLocation?: string
): Promise<TYPE> {
    const response = await fetch(uri, postConfig(body));
    return handleResponse<TYPE>(uri, response);
}
export const http = { get, post };

function handleResponse<TYPE extends object = object>(
    uri: string,
    response: Response,
): Promise<TYPE> {
    // Ignore-Conflict
    if (!response.ok || response.redirected) {
        return parseError<TYPE>(uri, response);
    }
    return parseResponse<TYPE>(uri, response);
}

async function parseResponse<TYPE>(uri: string, response: Response): Promise<TYPE> {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
        const json = await response.json();
        return {
            ...json,
            uri
        }
    } else if (contentType && contentType.indexOf('text/plain') !== -1) {
        const text = await response.text();
        return `${text}\n${uri}` as TYPE;
    } else {
        return Promise.resolve({ uri } as TYPE);
    }
}

async function parseError<TYPE extends object = object>(
    uri: string,
    response: Response,
): Promise<TYPE> {
    const text = await response.text();
    throw new FetchError(response, uri, text);
}

function postConfig(body?: object | string) {
    return {
        body: JSON.stringify(body),
        cache: 'no-cache' as RequestCache,
        credentials: 'include' as RequestCredentials,
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        mode: 'cors' as RequestMode,
        redirect: 'follow' as RequestRedirect
    };
}