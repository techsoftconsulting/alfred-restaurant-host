import { Box } from '@main-components/Base/Box';
import AppLayout from '@main-components/Layout/AppLayout';
import ScrollView from '@main-components/Utilities/ScrollView';
import React from 'react';
import ChangePasswordForm from '@modules/user/ui/components/ChangePasswordForm';
import { Card, CardContent, CardTitle } from '@main-components/Base/Card';
import { Button } from '@main-components/Base/Button';
import { Icon } from '@main-components/Base/Icon';
import useLogout from '@modules/auth/application/use-logout';
import { Form } from '@main-components/Form/Form';
import useNotify from '@shared/domain/hooks/use-notify';
import useGetIdentity from '@modules/auth/application/use-get-identity';
import useGetUser from '@modules/user/application/use-get-user';
import SaveButton from '@main-components/Form/components/SaveButton';
import AppIcon from '@main-components/Base/AppIcon';
import TextInput from '@main-components/Form/inputs/TextInput';
import { required } from '@shared/domain/form/validate';
import useSaveUser from '@modules/user/application/use-save-user';


export default function AccountSettingsScreen() {
    const { logout, loading } = useLogout();
    return (
            <AppLayout
                    title={'Mi cuenta'}
                    loading={false}
                    noPadding
            >
                <Box
                        flex={1}
                        pl={'m'}
                        mb={'m'}
                        bg={'white'}
                        pt={'m'}
                >
                    <ScrollView>


                        <Box
                                alignItems={'center'}
                                gap={'xl'}
                                flexDirection={'column'}
                        >
                            <Box
                                    width={'100%'}
                                    maxWidth={'80%'}
                            >
                                <Card>
                                    <CardTitle title={'Configuraciones básicas'} />
                                    <CardContent>

                                        <BasicDetailsForm />
                                    </CardContent>

                                </Card>
                            </Box>

                            <Box
                                    width={'100%'}
                                    maxWidth={'80%'}
                            >
                                <Card>
                                    <CardTitle title={'Cambiar clave'} />
                                    <CardContent>
                                        <ChangePasswordForm />
                                    </CardContent>

                                </Card>
                            </Box>

                            <Box
                                    width={'100%'}
                                    maxWidth={'80%'}
                            >
                                <Card>
                                    <CardTitle title={'Sesión'} />
                                    <CardContent>
                                        <Box
                                                alignItems={'center'}
                                        >
                                            <Button
                                                    flat
                                                    loading={loading}
                                                    backgroundColor={'dangerMain'}
                                                    icon={() => (
                                                            <Icon
                                                                    name={'logout'}
                                                                    type={'material'}
                                                                    numberSize={20}
                                                            />
                                                    )}
                                                    title={'Log out'}
                                                    onPress={() => {
                                                        logout();
                                                    }}
                                            />
                                        </Box>

                                    </CardContent>

                                </Card>
                            </Box>


                        </Box>

                    </ScrollView>
                </Box>
            </AppLayout>
    );
}

function BasicDetailsForm() {
    const { identity } = useGetIdentity();
    const { data: profile } = useGetUser(identity?.id, { enabled: !!identity?.id });
    const dto = profile?.toPrimitives();

    return (
            <Form
                    defaultValues={{
                        firstName: dto?.firstName,
                        lastName: dto?.lastName,
                        email: dto?.email
                    }}
                    toolbar={
                        <FormToolbar
                                onSave={() => {

                                }}
                        />
                    }
            >
                <Box
                        flexDirection={'row'}
                        gap={'m'}
                        flexWrap={'wrap'}
                >
                    <Box
                            flexBasis={100}
                            flexGrow={1}
                            flex={0.5}
                    >
                        <TextInput
                                label={'Nombre'}
                                source={'firstName'}
                                required
                                validate={required()}
                        />
                    </Box>
                    <Box
                            flexBasis={100}
                            flexGrow={1}
                            flex={0.5}
                    >
                        <TextInput
                                label={'Apellido'}
                                source={'lastName'}
                                required
                                validate={required()}
                        />
                    </Box>
                </Box>
                <Box>
                    <TextInput
                            label={'Correo electronico'}
                            source={'email'}
                            required
                            validate={required()}
                            disabled
                    />
                </Box>
                {/*<Box>
                    <PhoneTextInput
                            label={'Teléfono'}
                            source={'phone'}
                            required
                            validate={required()}
                    />
                </Box>*/}
            </Form>
    );
}

function FormToolbar(props) {

    const notify = useNotify();
    const { identity } = useGetIdentity();
    const { execute: saveUser, loading } = useSaveUser();
    const { data: user } = useGetUser(identity?.id, { enabled: !!identity });

    return (
            <Box alignItems={'center'}>
                <SaveButton
                        {...props}
                        label='Actualizar perfil'
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

                            user.updateData({
                                ...data
                            });
                            try {
                                await saveUser(
                                        user
                                );
                                props?.onSave?.();

                                notify('Actualizado con éxito', 'success');
                            } catch (e) {

                            }

                        }}
                />

            </Box>
    );
}