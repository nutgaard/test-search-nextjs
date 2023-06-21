import "server-only";
import {Search} from "@/components/search/Search";
import productResource from "@/resources/productResource";
import {deserializeNextJsServerSearchParams, NextJsServerSearchParams} from "@/utils/queryparams";
import {SearchFormDescription} from "@/resources/descriptors/SearchFormDescription";

interface Props {
    searchParams: NextJsServerSearchParams;
}

export default async function Home(props: Props) {
    const formData = deserializeNextJsServerSearchParams(SearchFormDescription, { limit: '1', ...props.searchParams });
    const initialData = await productResource.server.fetch(formData);

    return (
        <main>
            <h1>Testing form</h1>
            <Search initalFormData={formData} initialData={initialData} />
        </main>
    )
}
