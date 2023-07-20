import BaseTextareaInput from '@main-components/Form/inputs/TextInput/components/BaseTextAreaInput';
import BaseTextInput from '@main-components/Form/inputs/TextInput/components/BaseTextInput';
import useFormFieldErrors from '@modules/_shared/domain/form/use-form-field-errors';
import useInput from '@modules/_shared/domain/form/useInput';
import * as React from 'react';
import { TextInputProps } from './TextInputProps';
import { checkInputSource } from '@main-components/Form/Form';
import { BaseInput } from '@main-components/Form/inputs/BaseInput';

function TextInput({
    label,
    onBlur,
    onFocus,
    onChange,
    source,
    multiline,
    defaultValue,
    validate,
    wrapper,
    ...rest
}: TextInputProps, ref) {
    checkInputSource({ source });

    const { id, input, isRequired, meta } = useInput({
        defaultValue: defaultValue,
        validate: validate,
        source: source as string
    });

    const { hasError, error } = useFormFieldErrors(source as string);

    if (multiline) {
        return (
                <BaseInput
                        label={label}
                        WrapperComponent={wrapper as any}
                        error={hasError ? error : undefined}
                        helperText={rest.helperText}
                        noMargin={rest.noMargin}
                        required={rest.required}
                        bg={rest.bg}
                        style={rest.style}
                        hidden={rest.hidden}
                        errorColor={rest.errorColor}
                >

                    <BaseTextareaInput
                            {...rest}
                            ref={ref}
                            value={input?.value}
                            onChange={(ev) => {
                                const text = ev.currentTarget.value;
                                rest.filterText
                                        ? input?.onChange(rest.filterText(text))
                                        : input?.onChange(text);
                                onChange?.(text);
                            }}
                            onBlur={input?.onBlur}
                            onFocus={onFocus}
                    />
                </BaseInput>

                /* <BaseInput
                         label={label}
                         WrapperComponent={wrapper as any}
                         error={hasError ? error : undefined}
                         helperText={rest.helperText}
                         noMargin={rest.noMargin}
                         required={rest.required}
                         bg={rest.bg}
                         style={rest.style}
                         errorColor={rest.errorColor}
                         header={rest.header}
                 >
                     <BaseTextareaInput
                             {...rest}
                             ref={ref}
                             value={input?.value}
                             onChangeText={input?.onChange}
                             onBlur={input?.onBlur}
                             onFocus={onFocus}
                     />
                 </BaseInput>*/
        );
    }

    return (
            /*          <BaseInput
                              label={label}
                              WrapperComponent={wrapper as any}
                              error={hasError ? error : undefined}
                              helperText={rest.helperText}
                              noMargin={rest.noMargin}
                              required={rest.required}
                              bg={rest.bg}
                              style={rest.style}
                              hidden={rest.hidden}
                              errorColor={rest.errorColor}
                      >
                          <BaseTextInput
                                  {...rest}
                                  onChangeText={(text) => {
                                      rest.filterText
                                              ? input?.onChange(rest.filterText(text))
                                              : input?.onChange(text);
                                      onChange?.(text);
                                  }}
                                  style={rest.hidden ? {
                                      display: 'none'
                                  } : {}}
                                  value={input?.value}
                                  onBlur={onBlur}
                                  onFocus={onFocus}
                          />
                      </BaseInput>*/
            <BaseInput
                    label={label}
                    WrapperComponent={wrapper as any}
                    error={hasError ? error : undefined}
                    helperText={rest.helperText}
                    noMargin={rest.noMargin}
                    required={rest.required}
                    bg={rest.bg}
                    style={rest.style}
                    hidden={rest.hidden}
                    errorColor={rest.errorColor}
            >
                <BaseTextInput
                        {...rest}
                        onChange={(ev) => {

                            const text = ev.currentTarget.value;
                            rest.filterText
                                    ? input?.onChange(rest.filterText(text))
                                    : input?.onChange(text);
                            onChange?.(text);
                        }}
                        style={rest.hidden ? {
                            display: 'none'
                        } : {}}
                        type={rest.secureTextEntry ? 'password' : 'text'}
                        value={input?.value}
                        onBlur={onBlur}
                        onFocus={onFocus}
                />
            </BaseInput>

    );
}


export default React.forwardRef(TextInput);
