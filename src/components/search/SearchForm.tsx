import {UseFormReturn} from "react-hook-form";
import {SearchFormInputs} from "@/components/search/Search";
import Input from "@/components/input/Input";
import Checkboxes from "@/components/checkboxes/Checkboxes";

interface Props {
    form: UseFormReturn<SearchFormInputs>
}

const regions = [
    { name: 'Oslo', value: 'oslo'},
    { name: 'Innlandet', value: 'innlandet'},
    { name: 'Finnmark', value: 'finnmark'},
]
export function SearchForm(props: Props) {
    return (
        <section>
            <h1>Search Form</h1>
            <Input name="query" label="Query" type="text" form={props.form} />
            <Checkboxes name="region" form={props.form} options={regions}/>
            <Input name="minPrice" label="Minimum price" type="number" form={props.form} />
            <Input name="maxPrice" label="Maximum price" type="number" form={props.form} />
            <Input name="limit" label="Limit" type="number" form={props.form} />
        </section>
    );
}