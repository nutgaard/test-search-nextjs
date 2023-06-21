import {ReadonlyURLSearchParams} from "next/navigation";

export type NextJsServerSearchParams = { [key: string]: string | string[] | undefined };

export function stringValue(name: string): QueryField<string> {
    return {
        set(params: URLSearchParams, value?: string | null) {
            if (value) {
                params.set(name, value);
            }
        },
        get(params: URLSearchParams): string | null {
            return params.get(name)
        },
        getJSON(params: NextJsServerSearchParams): string | null {
            const value = params[name];
            if (typeof value === 'string') return value;
            else if (Array.isArray(value)) return value[0] ?? null;
            else return null;
        }
    }
}
export function stringArrayValue(name: string): QueryField<string[]> {
    return {
        set(params: URLSearchParams, value?: string[] | null) {
            if (value && value.length > 0) {
                params.set(name, value.join(','))
            }
        },
        get(params: URLSearchParams): string[] | null {
            return params.get(name)?.split(',') ?? null;
        },
        getJSON(params: NextJsServerSearchParams): string[] | null {
            const value = params[name];
            if (typeof value === 'string') return value.split(',');
            else if (Array.isArray(value)) return value;
            else return null;
        }
    }
}

export function numberValue(name: string): QueryField<number> {
    return {
        set(params: URLSearchParams, value?: number | null) {
            if (value) {
                params.set(name, value.toString())
            }
        },
        get(params: URLSearchParams): number | null {
            const value = params.get(name)
            if (value) {
                return parseFloat(value)
            }
            return null;
        },
        getJSON(params: NextJsServerSearchParams): number | null {
            const value = params[name];
            if (typeof value === 'string') return parseFloat(value);
            else if (Array.isArray(value)) return parseFloat(value[0]) ?? null;
            else return null;
        }
    }
}

export function deserializeSearchParams<TDescription extends QueryParamDescription>(
    description: TDescription,
    params: URLSearchParams
): FormType<TDescription> {
    const entries = Object.entries(description)
        .map(([key, query]) => [key, query.get(params)]);

    return Object.fromEntries(entries);
}

export function deserializeNextJsServerSearchParams<TDescription extends QueryParamDescription>(
    description: TDescription,
    params: NextJsServerSearchParams
): FormType<TDescription> {
    const entries = Object.entries(description)
        .map(([key, query]) => [key, query.getJSON(params)]);
    return Object.fromEntries(entries);
}

export function serializeSearchParams<TDescription extends QueryParamDescription>(
    description: TDescription,
    data: Partial<FormType<TDescription>>
): URLSearchParams {
    const params = new URLSearchParams();
    appendSearchParams(description, params, data);
    return params;
}

export function appendSearchParams<TDescription extends QueryParamDescription>(
    description: TDescription,
    searchParams: URLSearchParams,
    data: Partial<FormType<TDescription>>
) {
    Object.entries(description)
        .forEach(([key, query]) => {
            query.set(searchParams, data[key])
        });
}

export type QueryParamDescription = {
    [key: string]: QueryField<any>
}
export interface QueryField<TData> {
    set(params: URLSearchParams, value?: TData | null): void;
    get(params: URLSearchParams): TData | null
    getJSON(params: NextJsServerSearchParams): TData | null;
}

export type FormType<QueryParams extends QueryParamDescription> = {
    [KEY in keyof QueryParams]: QueryParams[KEY] extends QueryField<infer TValue> ? TValue : never;
}