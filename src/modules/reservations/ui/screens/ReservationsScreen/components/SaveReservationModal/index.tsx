import { Modal, ModalHeader, ModalProps } from '@main-components/Base/Modal';
import { Box } from '@main-components/Base/Box';
import useGetReservation from '@modules/reservations/application/use-get-reservation';
import ReservationForm
    from '@modules/reservations/ui/screens/ReservationsScreen/components/SaveReservationModal/components/ReservationForm';
import useNotify from '@shared/domain/hooks/use-notify';

interface SaveReservationModalProps {
    modal: Partial<ModalProps>,
    form: {
        id?: string | undefined
        defaultValues?: any
    }
}

export default function SaveReservationModal(props: SaveReservationModalProps) {
    const { data: item, loading } = useGetReservation(props.form?.id ?? '', {
        enabled: !!props?.form?.id
    });
    const notify = useNotify();

    return (
            <Modal
                    {...props.modal}
                    contentContainerStyle={{
                        borderRadius: 20,
                        maxWidth: 700
                    }}
            >

                <Box

                        flex={1}
                >
                    <ModalHeader
                            title={props?.form?.id ? 'Actualizar reservación' : 'Agregar reservación'}
                            onClose={props.modal.onDismiss}
                            loading={loading}
                    />
                    <ReservationForm
                            id={props.form.id}
                            defaultValues={props.form.defaultValues ? props.form.defaultValues : item ? {
                                ...item?.toPrimitives(),
                                clientEnabled: item.hasClient,
                                clientId: item?.clientId,
                                mallId: item?.mallId,
                                tableId: `${item?.areaId}*${item?.tableId}`
                            } : {
                                clientEnabled: !loading
                            }}
                            item={item}
                            onSave={() => {
                                props?.modal.onDismiss?.();
                            }}
                            onError={(message) => {
                                props?.modal.onDismiss?.();

                                if (message == 'INVALID_RESERVATION') {
                                    notify('Ya hay una reservación para ese horario', 'error');
                                } else {
                                    notify('No fue posible hacer la reservacion', 'error');
                                }
                            }}
                            onCancelSuccess={() => {
                                props?.modal.onDismiss?.();
                                notify('Reservación cancelada con éxito', 'success');
                            }}
                    />
                </Box>
            </Modal>
    );
}