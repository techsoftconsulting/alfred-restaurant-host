import AppLayout from '@main-components/Layout/AppLayout/AppLayout.web';
import ScrollView from '@main-components/Utilities/ScrollView';
import * as React from 'react';

export default function DashboardScreen() {
    return (
            <AppLayout
                    noPadding
                    loading={false}
                    title={'Dashboard'}
            >


                <ScrollView>


                </ScrollView>

            </AppLayout>
    );
}
