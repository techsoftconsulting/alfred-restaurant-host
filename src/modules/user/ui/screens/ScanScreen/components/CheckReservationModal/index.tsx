import { Modal, ModalHeader, ModalProps } from '@main-components/Base/Modal';
import { Box } from '@main-components/Base/Box';
import useGetReservation from '@modules/reservations/application/use-get-reservation';
import useNotify from '@shared/domain/hooks/use-notify';
import CheckReservationForm
    from '@modules/user/ui/screens/ScanScreen/components/CheckReservationModal/components/CheckReservationForm';
import Text from '@main-components/Typography/Text';
import { Button } from '@main-components/Base/Button';

interface CheckReservationModalProps {
    modal: Partial<ModalProps>,
    form: {
        id?: string | undefined
        defaultValues?: any
    }
}

export default function CheckReservationModal(props: CheckReservationModalProps) {
    const { data: item, loading } = useGetReservation(props.form?.id ?? '', {
        enabled: !!props?.form?.id
    });
    const notify = useNotify();

    const itemDefValues = {
        ...item?.toPrimitives() ?? {},
        clientEnabled: item?.hasClient,
        clientId: item?.clientId,
        mallId: item?.mallId,
        tableId: `${item?.areaId}*${item?.tableId}`
    };
    const defaultValues = {
        clientEnabled: !loading,
        ...item && itemDefValues,
        ...props.form.defaultValues && props.form.defaultValues
    };

    return (
            <Modal
                    {...props.modal}
                    contentContainerStyle={{
                        borderRadius: 20,
                        maxWidth: 650,
                        height: 800,
                        top: `calc(50% - 400px)`
                    }}
            >

                <Box
                        flex={1}
                        height={'100%'}
                >
                    <ModalHeader
                            title={props?.form?.id ? 'Reservación de comensal' : 'Reservación de comensal'}
                            onClose={props.modal.onDismiss}
                            loading={loading}
                    />
                    {
                        !item && !loading ? (
                                <Box
                                        flex={1}
                                        height={'100%'}
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                >
                                    <Box mb={'m'}>
                                        <Text
                                                variant={'big1'}
                                                color={'contrastMain'}
                                                bold
                                        >404</Text>
                                    </Box>
                                    <Text>Reservación no encontrada</Text>
                                    <Box mt={'m'}>
                                        <Button
                                                onPress={() => {
                                                    props?.modal?.onDismiss?.();
                                                }}
                                                title={'Cerrar'}
                                                backgroundColor={'primaryMain'}
                                        />
                                    </Box>
                                </Box>
                        ) : (
                                !!item?.checkIn() ? (
                                        <Box
                                                flex={1}
                                                height={'100%'}
                                                justifyContent={'center'}
                                                alignItems={'center'}
                                        >
                                            <Box mb={'m'}>
                                                <Text
                                                        variant={'big1'}
                                                        color={'contrastMain'}
                                                        bold
                                                >Ops...</Text>
                                            </Box>
                                            <Text>Reservación ya asistida</Text>
                                            <Box mt={'m'}>
                                                <Button
                                                        onPress={() => {
                                                            props?.modal?.onDismiss?.();
                                                        }}
                                                        title={'Cerrar'}
                                                        backgroundColor={'primaryMain'}
                                                />
                                            </Box>
                                        </Box>
                                ) : (
                                        <CheckReservationForm
                                                id={props.form.id}
                                                defaultValues={defaultValues}
                                                item={item}
                                                onSave={() => {
                                                    props?.modal.onDismiss?.();
                                                    notify('Reservación confirmada', 'success', null, null, null, 1000);
                                                }}
                                                onError={(message) => {
                                                    props?.modal.onDismiss?.();

                                                    if (message == 'INVALID_RESERVATION') {
                                                        notify('Ya hay una reservación para ese horario', 'error', null, null, null, 1000);
                                                    } else {
                                                        notify('No fue posible hacer la reservacion', 'error', null, null, null, 1000);
                                                    }
                                                }}
                                        />
                                )

                        )
                    }

                </Box>
            </Modal>
    );
}