import { FieldValues } from 'react-hook-form/dist/types/fields';
import { FieldPath } from 'react-hook-form/dist/types/path';
import { FormElementProps } from '../../utils/formTypes';
import { useFieldState } from '../../hooks/useFieldState';
import css from './checkboxes.module.css';


export interface CheckboxOptions {
    name: string;
    value: string;
}
interface Props<TFieldValues extends FieldValues, TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>
    extends FormElementProps<TFieldValues, TFieldName> {
    options: CheckboxOptions[]
}

interface SingleProps<TFieldValues extends FieldValues, TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>
    extends FormElementProps<TFieldValues, TFieldName> {
    option: CheckboxOptions
}

function Checkboxes<
    TFieldValues extends FieldValues,
    TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: Props<TFieldValues, TFieldName>) {
    const showError = props.form.formState.touchedFields[props.name] || props.form.formState.submitCount > 0;
    const error = props.form.formState.errors[props.name]?.message;
    return (
        <>
            { props.options.map((option, i) => (<Checkbox key={i} option={option} name={props.name} form={props.form}/>))}
            { showError && typeof error === "string" ? <span className={css.error}>{error}</span> : null }
        </>
    );
}

function Checkbox<
    TFieldValues extends FieldValues,
    TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: SingleProps<TFieldValues, TFieldName>) {
    const { ref, input, error } = useFieldState(props.name, props.form);
    return (
        <label className={css.label}>
            <input ref={ref} type="checkbox" className={css.checkbox} value={props.option.value} {...input} />
            <span>{props.option.name}</span>
        </label>
    );
}

export default Checkboxes;