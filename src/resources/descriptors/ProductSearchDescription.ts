import {numberValue, stringValue} from "@/utils/queryparams";

export const ProductSearchDescription = {
    query: stringValue('q'),
    limit: numberValue('limit'),
}