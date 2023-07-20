import DatePicker from '@main-components/Form/inputs/DateInput/components/DatePicker';
import React from 'react';
import { BaseDateInputProps } from './BaseDateInputProps';
import { Box } from '@main-components/Base/Box';

const initialDate = new Date();
export default function BaseDateInput(props: BaseDateInputProps) {
    const date = props.value;

    return (
            <Box
                    p={'s'}
                    style={{ zIndex: 2 }}
            >
                <DatePicker
                        {...props}
                        show={true}
                        onChange={(date) => {
                            props.onChangeText && props.onChangeText(date);
                        }}
                        value={date}
                        mode='date'
                        minDate={props.minDate}
                        maxDate={props.maxDate}
                />
            </Box>
    );
}
