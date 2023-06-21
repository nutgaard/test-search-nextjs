import { FieldValues } from 'react-hook-form/dist/types/fields';
import { FieldPath } from 'react-hook-form/dist/types/path';
import { UseFormReturn } from 'react-hook-form/dist/types';
import { UseFieldStateReturn } from '../utils/formTypes';

export function useFieldState<
    TFieldValues extends FieldValues,
    TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(name: TFieldName, form: UseFormReturn<TFieldValues>): UseFieldStateReturn<TFieldName> {
    const showError = form.formState.touchedFields[name] || form.formState.submitCount > 0;
    const error = form.formState.errors[name]?.message;
    const { ref, onChange, ...input } = form.register(name);

    return {
        input: {
            id: input.name,
            onChange: async (e) => {
                const res = await onChange(e);
                await form.trigger();
                return res;
            },
            ...input
        },
        ref,
        error: showError && typeof error === "string" ? error : undefined
    };
}