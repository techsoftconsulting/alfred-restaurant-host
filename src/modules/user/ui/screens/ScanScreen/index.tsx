import AppLayout from '@main-components/Layout/AppLayout';
import QRScanner from '@main-components/Utilities/QRScanner';
import ScrollView from '@main-components/Utilities/ScrollView';
import { Box } from '@main-components/Base/Box';
import useNotify from '@shared/domain/hooks/use-notify';
import CheckReservationModal from '@modules/user/ui/screens/ScanScreen/components/CheckReservationModal';
import { useEffect, useState } from 'react';

export default function ScanScreen() {
    const notify = useNotify();

    const [incomingData, setIncomingData] = useState(null);

    useEffect(() => {
        setIncomingData(null);
    }, []);
    return (
            <AppLayout
                    title={'Escaneo de QR'}
                    loading={false}
                    noPadding
            >
                <ScrollView>
                    <Box
                            alignSelf={'center'}
                            style={{
                                aspectRatio: 1 / 1
                            }}
                            width={'100%'}
                            maxWidth={700}
                    >


                        <QRScanner
                                onScanned={(scanvalue) => {
                                    try {
                                        const data = JSON.parse(scanvalue);

                                        setIncomingData(data);

                                    } catch (e) {
                                        notify('No fue posible interpretar el QR', 'error', null, false, 1000);
                                    }
                                }}
                                size={250}
                                onError={() => {
                                    //notify('No fue posible leer el QR', 'error', null, false, 1000);
                                }}
                        />

                    </Box>
                </ScrollView>

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
            </AppLayout>
    );
}