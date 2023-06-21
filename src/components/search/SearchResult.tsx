"use client";
import {UseFormReturn} from "react-hook-form";
import {SearchFormInputs} from "@/components/search/Search";
import {useEffect, useState} from "react";
import { useDebounce } from 'usehooks-ts';
import productResource from "@/resources/productResource";


interface Props {
    form: UseFormReturn<SearchFormInputs>;
}

export function SearchResult(props: Props) {
    const [formData, setFormData] = useState<SearchFormInputs>(props.form.getValues())
    const watch = props.form.watch;

    useEffect(() => {
        watch(async (data) => {
            setFormData(data as SearchFormInputs);
        });
    }, [watch]);

    const debouncedFormData = useDebounce(formData, 200);
    const {dataUpdatedAt, ...response} = productResource.client.useFetch(debouncedFormData);

    return (
        <section>
            <h1>Search Result</h1>
            <pre>{JSON.stringify({ limit: formData.limit, response }, null, 2)}</pre>
        </section>
    );
}