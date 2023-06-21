import { FieldValues } from 'react-hook-form/dist/types/fields';
import { FieldPath } from 'react-hook-form/dist/types/path';
import { FormElementProps } from '../../utils/formTypes';
import { useFieldState } from '../../hooks/useFieldState';
import css from './input.module.css';

interface Props<TFieldValues extends FieldValues, TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>
    extends FormElementProps<TFieldValues, TFieldName> {
    label: string;
    type: 'text' | 'number'
}

function FormInput<
    TFieldValues extends FieldValues,
    TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: Props<TFieldValues, TFieldName>) {
    const { ref, input, error } = useFieldState(props.name, props.form);

    return (
        <label>
            <span className={css.label}><b>{props.label}</b></span>
            <input ref={ref} type={props.type} className={css.input} {...input} />
            { error && <span className={css.error}>{error}</span> }
        </label>
    );
}

export default FormInput;