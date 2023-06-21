"use client";
import {SearchForm} from "./SearchForm";
import {SearchResult} from "./SearchResult";
import {FieldError, useForm, UseFormReturn} from "react-hook-form";
import {buildFieldError} from "@/utils/formTypes";
import {useEffect} from "react";
import {usePathname} from "@/hooks/usePathname";
import {
    FormType,
    serializeSearchParams,
} from "@/utils/queryparams";
import {QueryClientProvider} from "@tanstack/react-query";
import {QueryClient} from "@tanstack/query-core";
import productResource, {Pagination, Product} from "@/resources/productResource";
import {SearchFormDescription} from "@/resources/descriptors/SearchFormDescription";
import {useRouter} from "next/navigation";
import css from './search.module.css';


export type SearchFormInputs = FormType<typeof SearchFormDescription>

function searchFormResolver(values: SearchFormInputs) {
    const errors: Record<string, FieldError | undefined> = {};
    if (values.query && values.query.length > 3) {
        errors.query = buildFieldError(`Something is wrong: ${values.query}`)
    }
    return { values, errors }
}

const minutes = 60 * 1000;
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 10 * minutes,
            cacheTime: 10 * minutes,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: false
        }
    }
});

interface Props {
    initalFormData: SearchFormInputs;
    initialData?: Pagination<Product>;
}

export function Search(props: Props) {
    const pathName = usePathname();
    const router = useRouter();
    const form: UseFormReturn<SearchFormInputs> = useForm<SearchFormInputs>({
        resolver: searchFormResolver,
        mode: "onChange",
        defaultValues: { ...props.initalFormData }
    });
    if (props.initialData) {
        productResource.client.setPrefetched(queryClient, props.initalFormData, props.initialData)
    }

    useEffect(() => {
        form.watch((data) => {
            const queryparams = serializeSearchParams(SearchFormDescription, data as SearchFormInputs)
            const search = queryparams.toString();
            const query = search ? `?${search}` : '';
            history.replaceState({}, '', query + location.hash);
        })
    }, [form, pathName, router])

    return (
        <div className={css.wrapper}>
            <SearchForm form={form} />
            <QueryClientProvider client={queryClient}>
                <SearchResult form={form} />
            </QueryClientProvider>
        </div>
    );
}