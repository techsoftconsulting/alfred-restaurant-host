import React, { useEffect, useState } from 'react';
import { BaseSelectPickerInputProps } from './BaseSelectPickerInputProps';
import { Autocomplete, FormControl, TextField } from '@mui/material';
import { useTheme } from '@shared/ui/theme/AppTheme';

export default function BaseSelectPickerInput(
        props: BaseSelectPickerInputProps
) {
    const {
        value,
        onChange,
        orderValues,
        choices = [],
        placeholder = 'Selecciona',
        error,
        optionText,
        optionValue,
        multiple = false,
        searchPlaceholderText,
        hideSearch = false,
        loading,
        disabled,
        canClear = true,
        ...rest
    } = props;

    const finalOptionValue = optionValue ? optionValue : 'id';
    const finalOptionText = optionText ? optionText : 'name';
    const [selectedItems, setSelectedItems] = useState<any>(multiple ? [] : null);

    const onConfirm = (e, newValue) => {
        if (!newValue) {
            onChange(null);
            return;
        }
        onChange && onChange(multiple ? newValue?.map(v => v[finalOptionValue]) : newValue[finalOptionValue]);
    };

    useEffect(() => {
        if (!value) {
            setSelectedItems(multiple ? [] : null);
            return;
        }

        if (multiple) {
            setSelectedItems(choices.filter(v => {
                return (value ?? []).includes(v[finalOptionValue]);
            }));
            return;
        }

        setSelectedItems(choices.find(v => v[finalOptionValue] === value));

    }, [choices, value]);
    const theme = useTheme();

    return (

            <FormControl
                    error={!!props.error}
                    variant={'outlined'}
            >
                <Autocomplete
                        loading={props.loading}
                        multiple={props.multiple ?? false}
                        placeholder={props.placeholder}
                        value={orderValues ? orderValues(selectedItems) : selectedItems}
                        onChange={onConfirm}
                        disableClearable={!props.canClear}
                        options={choices}

                        getOptionSelected={(option, value) => {
                            return option[finalOptionValue] === value?.[finalOptionValue];
                        }}
                        getOptionLabel={(option) => option[finalOptionText]}
                        disabled={props.disabled}
                        renderInput={(params) => <TextField {...params}
                                placeholder={props.placeholder}
                                error={!!props.error}
                                InputProps={{
                                    ...params.InputProps
                                    /* style: {
                                         paddingTop: 0,
                                         paddingBottom: 0
                                     }*/
                                }}
                                fullWidth
                                style={{
                                    borderRadius: 20
                                }}
                        />}

                />
            </FormControl>
    );

}
