import AppLayout from '@main-components/Layout/AppLayout';
import ReservationForm
    from '@modules/reservations/ui/screens/ReservationsScreen/components/SaveReservationModal/components/ReservationForm';
import useNavigation from '@shared/domain/hooks/navigation/use-navigation';
import { useState } from 'react';
import { Box } from '@main-components/Base/Box';
import { Modal } from '@main-components/Base/Modal';
import Text from '@main-components/Typography/Text';
import { ActivityIndicator } from '@main-components/Base/ActivityIndicator';
import { Image } from '@main-components/Base/Image';
import images from '@shared/ui/images/images';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import useNotify from '@shared/domain/hooks/use-notify';

export default function NewReservationScreen() {
    const { navigate } = useNavigation();
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const notify = useNotify();

    return (
            <AppLayout
                    title={'Nueva reserva'}
                    loading={false}

            >
                <Box
                        justifyContent={'center'}
                        flex={1}
                        maxWidth={{
                            tablet: 600,
                            large: 800
                        }}
                        alignSelf={'center'}
                >
                    <ReservationForm
                            onSaving={() => {
                                setSaving(true);
                            }}
                            onSave={() => {
                                setSuccess(true);
                            }}
                            onSuccess={() => {
                                setSuccess(true);
                            }}
                            onError={(message) => {
                                setSaving(false);
                                if (message == 'INVALID_RESERVATION') {
                                    notify('Ya hay una reservación para ese horario', 'error');
                                } else {
                                    notify('No fue posible hacer la reservacion', 'error');
                                }

                            }}
                            onCancelSuccess={() => {

                            }}
                    />
                </Box>


                <CreatingModal
                        modal={{
                            visible: saving,
                            onDismiss() {
                                setSaving(false);
                            }
                        }}
                        isSuccess={success}
                />
            </AppLayout>
    );
}

function CreatingModal(props) {
    const { navigate } = useNavigation();
    return (
            <Modal
                    {...props.modal}
                    contentContainerStyle={{
                        backgroundColor: 'black',
                        maxWidth: 500,
                        borderRadius: 20,
                        height: 400,
                        alignItems: ' center',
                        justifyContent: 'center',
                        top: 'calc(50% - 200px)'
                    }}
            >

                <Box
                        height={400}
                        flex={1}
                        alignItems={'center'}
                        justifyContent={'center'}
                >

                    {
                        props.isSuccess ? (
                                <Image
                                        source={images.SUCCESS}
                                        style={{
                                            width: 150,
                                            height: 150
                                        }}
                                />
                        ) : (
                                <ActivityIndicator
                                        color={'contrastLight'}
                                        size={100}
                                />
                        )
                    }


                    {
                        props.isSuccess ? (
                                <Box
                                        alignItems={'center'}
                                        mt={'l'}
                                        width={'100%'}
                                >
                                    <Text
                                            variant={'heading2'}
                                            bold
                                            color={'white'}
                                    >Tu reservación esta lista</Text>
                                    <Box
                                            borderTopWidth={1}
                                            borderTopColor={'contrastLight'}
                                            mt={'m'}
                                            alignItems={'center'}
                                            width={'100%'}
                                            pt={'m'}
                                    >
                                        <TouchableOpacity
                                                onPress={() => {
                                                    props?.modal?.onDismiss?.();
                                                    navigate('/reservations');
                                                }}
                                        >
                                            <Text color={'white'}>Ver reservaciones</Text>
                                        </TouchableOpacity>
                                    </Box>
                                </Box>
                        ) : (
                                <Box mt={'l'}>
                                    <Text
                                            variant={'heading2'}
                                            bold
                                            color={'white'}
                                    >Creando tu reservación</Text>
                                </Box>
                        )
                    }


                </Box>
            </Modal>
    );
}