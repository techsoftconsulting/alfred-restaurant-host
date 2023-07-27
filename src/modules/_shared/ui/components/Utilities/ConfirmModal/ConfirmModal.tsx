import { Box } from '@main-components/Base/Box';
import { Button } from '@main-components/Base/Button';
import { Modal, ModalProps } from '@main-components/Base/Modal';
import Text from '@main-components/Typography/Text';
import { useTheme } from '@modules/_shared/ui/theme/AppTheme';
import React from 'react';
import { Platform } from 'react-native';
import { Image } from '@main-components/Base/Image';
import images from '@shared/ui/images/images';
import { IconButton } from '@main-components/Base/IconButton';

interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
    onConfirm: () => void;
    onClose?: () => void;
    showCancel?: boolean;
    title: string | JSX.Element;
    content: string | JSX.Element;
    cancelText?: string;
    confirmText?: string;
}

export default function ConfirmModal({
    showCancel = true,
    ...props
}: ConfirmModalProps) {
    const theme = useTheme();
    return (
            <Modal
                    {...props}
                    onDismiss={props.onClose}
                    contentContainerStyle={{
                        backgroundColor: 'black',
                        borderRadius: 20,
                        width: Platform.select({
                            web: '70%',
                            default: '90%'
                        }),
                        flex: Platform.select({
                            web: undefined,
                            default: 0
                        }),
                        top: '30%',
                        alignSelf: 'center',
                        padding: 20
                    }}
            >
                <Box
                        position={'absolute'}
                        right={10}
                        top={10}
                        zIndex={99999}
                >
                    <IconButton
                            onPress={() => {
                                props.onClose?.();
                            }}
                            iconSize={40}
                            iconName={'close-circle-outline'}
                            iconType={'ionicon'}
                    />
                </Box>
                <Box alignItems={'center'}>
                    <Image
                            source={images.WARNING}
                            style={{
                                width: 150,
                                height: 150
                            }}
                    />
                </Box>
                <Box style={{ paddingBottom: 0 }}>
                    <Box
                            padding='m'
                            style={{ paddingBottom: 0 }}
                            justifyContent='center'
                            mb='s'
                    >
                        <Box>
                            {typeof props.title !== 'string' ? (
                                    props.title
                            ) : (
                                    <Text
                                            align={'center'}
                                            color='white'
                                            variant='heading3'
                                    >
                                        {props.title}
                                    </Text>
                            )}
                        </Box>
                        <Box></Box>
                    </Box>
                    <Box padding='l'>
                        {typeof props.content !== 'string' ? (
                                props.content
                        ) : (
                                <Text
                                        color='white'
                                        align={'center'}
                                        variant='body'
                                >
                                    {props.content}
                                </Text>
                        )}
                    </Box>
                    <Box
                            width='100%'
                            flexDirection='row'
                            justifyContent='center'
                            paddingVertical={'m'}
                    >
                        {/* <Box
                                flex={0.4}
                                mr={'m'}
                        >
                            {showCancel && (
                                    <Button
                                            title={props.cancelText || 'Cancelar'}
                                            titleColor={'greyDark'}
                                            compact
                                            flat
                                            block
                                            backgroundColor={'greyLight'}
                                            onPress={() => {
                                                props.onClose && props.onClose();
                                            }}
                                    />
                            )}
                        </Box>*/}
                        <Box flex={0.4}>
                            <Button
                                    title={props.confirmText || 'Aceptar'}
                                    mode='contained'
                                    titleColor='white'
                                    backgroundColor={'primaryMain'}
                                    compact
                                    flat
                                    block
                                    style={{
                                        borderRadius: 0,
                                        borderBottom: `1px solid ${theme.colors.contrastMain}`
                                    }}
                                    onPress={() => {
                                        props.onConfirm();
                                    }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Modal>
    );
}
