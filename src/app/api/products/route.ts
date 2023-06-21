import "server-only";
import {Request} from "next/dist/compiled/@edge-runtime/primitives/fetch";
import {deserializeSearchParams} from "@/utils/queryparams";
import {SearchFormDescription} from "@/resources/descriptors/SearchFormDescription";
import {NextResponse} from "next/server";
import productResource from "@/resources/productResource";

export async function GET(request: Request) {
    console.log('request.url', request.url);
    const url = new URL(request.url);
    const params = deserializeSearchParams(SearchFormDescription, url.searchParams);

    const response = await productResource.server.fetch(params);

    return NextResponse.json(response)
}