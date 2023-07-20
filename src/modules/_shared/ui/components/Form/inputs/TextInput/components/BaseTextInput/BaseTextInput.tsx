import { Box } from '@main-components/Base/Box';
import { useUtils } from '@modules/_shared/domain/hooks/use-utils';
import { useTheme } from '@modules/_shared/ui/theme/AppTheme';
import React from 'react';
import { Platform } from 'react-native';
import { BaseTextInputProps } from './BaseTextInputProps';
import { FormControl, TextField } from '@mui/material';

function BaseTextInput(
        {
            borderColor = 'secondaryMain',
            backgroundColor = 'secondaryLight',
            mode = 'outlined',
            dense = true,
            keyboardType,
            ...props
        }: BaseTextInputProps,
        ref
) {
    const theme = useTheme();
    const utils = useUtils();
    const leftCompWidth = props.left?.width ? props.left?.width : 0;

    const height = Platform.OS === 'ios' ? props.numberOfLines ? props.numberOfLines * 20 : undefined : undefined;

    return (
            <Box>
                {/*      <Box
                        position='absolute'
                        left={10}
                        flexDirection='row'
                        alignItems='center'
                        width={leftCompWidth + 25}
                        zIndex={9999}
                >
                    {props.left && (
                            <Box
                                    justifyContent='center'
                                    top={Platform.OS === 'web' ? 0 : 6}
                                    width={props.left.width}
                                    left={props.leftIcon ? 0 : 0}
                                    zIndex={9999}
                            >
                                {props.left.component &&
                                        cloneElement(props.left.component)}
                            </Box>
                    )}
                </Box>*/}
                <FormControl variant={'outlined'}>

                    <TextField
                            {...utils.object.omit(props, ['ref'])}
                            ref={ref}
                            autoCapitalize={'none'}
                            autoComplete={'none'}
                            value={props.value}
                            inputProps={{
                                autoCapitalize: 'none',
                                autoCorrect: 'off'
                            }}
                            /*  render={props.render}*/
                            disabled={props.disabled}
                            label={props.label}
                            error={!!props.error}
                            /*   pointerEvents={props.pointerEvents}
                               selectionColor={theme.colors.textInputColor}*/
                            /*mode='outlined'*/
                            variant={'outlined'}
                            /*        underlineColor={'transparent'}
                                    dense={dense}*/
                            /* outlineColor='transparent'*/
                            /*   style={{
                                   elevation: 0,
                                   paddingLeft: props.leftIcon
                                           ? leftCompWidth + 30
                                           : undefined,
                                   marginTop: -8,
                                   backgroundColor: 'transparent',
                                   ...Platform.select({
                                       web: {
                                           border: 0,
                                           borderRadius: 20,
                                           outline: 'none'
                                       }
                                   }),
                                   ...props.style,
                                   minHeight: height
                               }}
                               right={
                                       props.rightIcon && (
                                               <PaperInput.Icon
                                                       name={props.rightIcon.name}
                                                       size={30}
                                                       onPress={props.rightIcon.onPress}
                                                       color={props.rightIcon.color ? theme.colors[props.rightIcon.color] : theme.colors.inputPlaceholderColor}
                                               />
                                       )
                               }
                               theme={{
                                   colors: {
                                       placeholder: theme.colors.inputPlaceholderColor,
                                       text: theme.colors.textInputColor,
                                       error: theme.colors.dangerMain,
                                       primary: 'transparent'
                                   },
                                   fonts: {
                                       regular: {
                                           fontFamily: theme.textVariants.body.fontFamily
                                       }
                                   }
                               }}*/
                            /*  keyboardType={keyboardType}*/
                    />
                </FormControl>
            </Box>
    );
}

export default React.forwardRef(BaseTextInput);
