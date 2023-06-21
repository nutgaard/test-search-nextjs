import {numberValue, stringArrayValue, stringValue} from "@/utils/queryparams";

export const SearchFormDescription = {
    query: stringValue('query'),
    region: stringArrayValue('region'),
    type: stringArrayValue('type'),
    minPrice: numberValue('minPrice'),
    maxPrice: numberValue('maxPrice'),
    limit: numberValue('limit'),
}

