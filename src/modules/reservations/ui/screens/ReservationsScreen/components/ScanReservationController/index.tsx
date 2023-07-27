import QRScanner, { useHandleOrientation } from '@main-components/Utilities/QRScanner';
import { Box } from '@main-components/Base/Box';
import useNotify from '@shared/domain/hooks/use-notify';
import { useEffect, useState } from 'react';
import CheckReservationModal
    from '@modules/reservations/ui/screens/ReservationsScreen/components/ScanReservationController/components/CheckReservationModal';
import { Modal, ModalProps } from '@main-components/Base/Modal';
import { useTheme } from '@shared/ui/theme/AppTheme';
import Text from '@main-components/Typography/Text';
import { Icon } from '@main-components/Base/Icon';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';


interface ScanModalModalProps {
    modal: Partial<ModalProps>,
    onScan: any
}

export default function ScanReservationController(props: {
    modal: Partial<ModalProps>,
}) {

    const [incomingData, setIncomingData] = useState(null);

    useEffect(() => {
        setIncomingData(null);
    }, []);

    return (
            <>
                <ScanModal
                        modal={{ ...props.modal }}
                        onScan={(data) => {
                            setIncomingData(data);
                        }}
                />
                <CheckReservationModal
                        modal={{
                            visible: !!incomingData,
                            onDismiss() {
                                setIncomingData(null);
                            }
                        }}
                        form={{
                            id: incomingData?.id
                        }}
                />
            </>
    );
}


function ScanModal(props: ScanModalModalProps) {

    const notify = useNotify();
    const theme = useTheme();
    const { orientation } = useHandleOrientation();
    const HEIGHT = orientation === 'LANDSCAPE' ? 600 : 600;
    const [init, setInit] = useState(false);

    useEffect(() => {
        setInit(false);
    }, [props?.modal?.visible]);

    useEffect(() => {
        setInit(false);
    }, [orientation]);

    return (
            <Modal
                    {...props.modal}
                    contentContainerStyle={{
                        borderRadius: 20,
                        maxWidth: 600,
                        height: HEIGHT,
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: theme.colors.primaryMain,
                        top: `calc(50% - ${HEIGHT / 2}px)`
                    }}
            >
                <Box
                        width={'100%'}
                        alignItems={'center'}
                        justifyContent={'center'}
                >
                    {
                        init ? (
                                <QRScanner
                                        orientation={orientation}
                                        onScanned={(scanvalue) => {
                                            try {
                                                const data = JSON.parse(scanvalue);
                                                props.modal?.onDismiss?.();
                                                props.onScan(data);
                                            } catch (e) {
                                                props.modal?.onDismiss?.();
                                                notify('No fue posible interpretar el QR', 'error', null, false, 1000);
                                            }
                                        }}
                                        size={250}
                                        onError={() => {

                                        }}
                                />
                        ) : (
                                <Box
                                        flex={1}
                                        alignItems={'center'}
                                        justifyContent={'center'}
                                >
                                    <Box>
                                        <TouchableOpacity
                                                onPress={() => {
                                                    setInit(true);
                                                }}
                                        >
                                            <Icon
                                                    name={'scan'}
                                                    type={'ionicon'}
                                                    color={'white'}
                                                    numberSize={180}
                                            />
                                            <Box
                                                    alignItems={'center'}
                                                    justifyContent={'center'}
                                                    mt={'m'}
                                            >

                                                <Box
                                                        pb={'s'}
                                                        borderBottomWidth={2}
                                                        borderBottomColor={'contrastLight'}
                                                >
                                                    <Text
                                                            bold
                                                            variant={'heading4'}
                                                            color={'white'}
                                                    >Iniciar escaner</Text>
                                                </Box>


                                            </Box>
                                        </TouchableOpacity>
                                    </Box>

                                </Box>
                        )
                    }

                </Box>
            </Modal>
    );
}