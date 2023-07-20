import { Box } from '@main-components/Base/Box';
import { useAppLayout } from '@modules/_shared/ui/hooks/use-app-layout';
import React, { useEffect, useState } from 'react';
import { Theme, useTheme } from '@modules/_shared/ui/theme/AppTheme';
import { CLOSED_DRAWER_WIDTH, DRAWER_WIDTH } from '@main-components/Layout/AppLayout/drawer-constants';
import BaseAppHeader from '@main-components/Layout/BaseAppHeader/BaseAppHeader.web';
import { ProgressBar } from '@main-components/Base/ProgressBar';
import useGetIdentity from '@modules/auth/application/use-get-identity';
import useGetUser from '@modules/user/application/use-get-user';
import { Modal, ModalHeader } from '@main-components/Base/Modal';
import { Form } from '@main-components/Form/Form';
import PasswordInput from '@main-components/Form/inputs/PasswordInput';
import { minLength, required } from '@shared/domain/form/validate';
import useNotify from '@shared/domain/hooks/use-notify';
import { useForm } from '@shared/domain/form/useForm';
import useUpdatePassword from '@modules/user/application/use-update-password';
import SaveButton from '@main-components/Form/components/SaveButton';
import AppIcon from '@main-components/Base/AppIcon';


interface AppLayoutProps {
    children: JSX.Element;
    bg?: keyof Theme['colors'];
    title?: string;
    loading?: boolean;
    headerBgColor?: string;
    LoadingComponent?: JSX.Element;
    noPadding?: boolean;
}

export default function AppLayout(props: AppLayoutProps) {
    const collapsed = useAppLayout((values) => values.collapsedMenu);
    const width = !collapsed ? DRAWER_WIDTH : CLOSED_DRAWER_WIDTH;
    const theme = useTheme();

    // useUpdateNavigationTitle(props.title ?? '');

    return (

            <Box
                    testID={'app-layout'}
                    bg={'white'}
                    style={{
                        backgroundColor: props.bg ? theme.colors[props.bg] : theme.colors.greyLightest,
                        paddingBottom: 0 /* Trial bar */,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1
                    }}
            >

                <AppHeaderController
                        title={props.title}
                        backgroundColor={props.headerBgColor ?? 'white'}
                />
                <Box
                        height={props.loading ? 3 : 0}
                        style={{
                            opacity: props.loading ? 1 : 0
                        }}
                >
                    <ProgressBar
                            borderRadius={0}
                            progress={100}
                            indeterminate
                    />
                </Box>


                <Box
                        flex={1}
                        height='100%'
                        {...!props.noPadding && {
                            padding: 's',
                            style: {
                                paddingHorizontal: 20
                            }
                        }}

                        bg={props.bg ?? 'white'}
                >
                    {props.children}
                </Box>

                <ConfigurePasswordModal />
            </Box>
    );
}


function ConfigurePasswordModal() {
    const { identity } = useGetIdentity();
    const { data: profile } = useGetUser(identity?.id, { enabled: !!identity?.id });

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!profile) return;
        setShowModal(!profile.customPasswordConfigured);
    }, [profile?.id]);

    return (
            <Modal
                    visible={showModal}
                    dismissable={false}
                    contentContainerStyle={{
                        maxWidth: 400
                    }}
            >
                <Box>
                    <ModalHeader
                            title={'Configura tu clave'}
                            onClose={() => {

                            }}
                            loading={false}
                            showClose={false}
                    />
                    <Form
                            defaultValues={{}}
                            toolbar={
                                <FormToolbar
                                        onSave={() => {
                                            setShowModal(false);
                                        }}
                                />
                            }
                    >
                        <PasswordInput
                                source='oldPassword'
                                required
                                placeholder='Escribe tu contraseña actual'
                                validate={required()}
                                mode='rounded'
                                label='Contraseña actual'
                        />

                        <PasswordInput
                                source='password'
                                required
                                placeholder='Escribe tu nueva contraseña'
                                validate={[required(), minLength(8, 'Por favor, ingresa una clave de al menos 8 caracteres')]}
                                mode='rounded'
                                label='Contraseña nueva'
                        />
                    </Form>
                </Box>
            </Modal>
    );
}


function FormToolbar(props) {

    const notify = useNotify();
    const { identity } = useGetIdentity();
    const { setError } = useForm();

    const { execute: updatePassword, loading } = useUpdatePassword();
    const { data: user } = useGetUser(identity?.id, { enabled: !!identity });

    return (
            <Box alignItems={'center'}>
                <SaveButton
                        {...props}
                        label='Guardar'
                        titleColor={'white'}
                        loading={loading}
                        backgroundColor={'primaryMain'}
                        uppercase={false}
                        icon={() => {
                            return <AppIcon
                                    name='save'
                                    size={20}
                                    color='white'
                            />;
                        }}
                        onSubmit={async (data) => {
                            if (!identity) return;
                            if (!user) return;

                            try {
                                await updatePassword(
                                        user,
                                        identity.email,
                                        data.oldPassword,
                                        data.password
                                );
                                props?.onSave?.();

                                notify('Tu clave ha sido guardada exitosamente', 'success');
                            } catch (e) {
                                if (e.message.toUpperCase() == 'INVALID_CREDENTIALS') {
                                    setError('oldPassword', {
                                        message: 'Clave inválida'
                                    });
                                    return;
                                }

                                console.log(e);
                            }

                        }}
                />

            </Box>
    );
}

function AppHeaderController(props: { backgroundColor?: string; navigation: any, title?: string }) {

    return (
            <BaseAppHeader
                    title={props.title}
                    backgroundColor={props.backgroundColor}
                    navigation={props.navigation}
                    currentUser={{
                        fullName: '',
                        profilePictureUrl: undefined
                    }}
            />
    );
}
