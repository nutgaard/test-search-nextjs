import {useQuery, useQueryClient, UseQueryResult} from "@tanstack/react-query";
import {SearchFormInputs} from "@/components/search/Search";
import {appendSearchParams, serializeSearchParams} from "@/utils/queryparams";
import {http} from "@/resources/fetch";
import {SearchFormDescription} from "@/resources/descriptors/SearchFormDescription";
import {QueryClient} from "@tanstack/query-core";
import {ProductSearchDescription} from "@/resources/descriptors/ProductSearchDescription";

function queryKey(data: SearchFormInputs) {
    return ['product', serializeSearchParams(SearchFormDescription, data).toString()];
}
function serverUrl(data: SearchFormInputs) {
    const url = new URL('https://dummyjson.com/products');
    appendSearchParams(ProductSearchDescription, url.searchParams, data)
    return url.toString();
}
function clientUrl(data: SearchFormInputs) {
    const url = new URL('http://localhost:3000/ny-bolig/api/products');
    appendSearchParams(SearchFormDescription, url.searchParams, data)
    return url.toString();
}


export interface Pagination<TItem> {
    products: TItem[];
    total: number;
    skip: number;
    limit: number;
}
export interface Product {
    id: string;
    title: string;
    description: string;
}

const client = {
    async fetch(data: SearchFormInputs): Promise<Pagination<Product>> {
        return http.get(clientUrl(data))
    },
    setPrefetched(queryClient: QueryClient, data: SearchFormInputs, initialData: Pagination<Product>) {
        queryClient.setQueryData(queryKey(data), initialData);
    },
    useFetch(data: SearchFormInputs): UseQueryResult<Pagination<Product>> {
        return useQuery({
            queryKey: queryKey(data),
            queryFn: () => this.fetch(data),
            keepPreviousData: true
        });
    }
};
const server = {
    async fetch(data: SearchFormInputs): Promise<Pagination<Product>> {
        return http.get(serverUrl(data))
    },
}

export default {
    client,
    server
};