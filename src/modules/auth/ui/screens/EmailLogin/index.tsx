import SaveButton from '@main-components/Form/components/SaveButton';
import useLoginWithEmailAndPassword from '@modules/auth/application/use-login-with-email-and-password';
import { email, required } from '@shared/domain/form/validate';
import React, { useState } from 'react';
import { useTheme } from '@shared/ui/theme/AppTheme';
import { Form } from '@main-components/Form/Form';
import PasswordInput from '@main-components/Form/inputs/PasswordInput';
import Text from '@main-components/Typography/Text';
import { Box } from '@main-components/Base/Box';
import EmailTextInput from '@main-components/Form/inputs/EmailTextInput';
import useParams from '@shared/domain/hooks/navigation/use-params';
import useGetRestaurantBySlug from '@modules/user/application/use-get-restaurant-by-slug';
import { Image } from '@main-components/Base/Image';
import TextInput from '@main-components/Form/inputs/TextInput';
import ForgotPasswordModal from '@modules/auth/ui/screens/EmailLogin/ForgotPasswordModal';
import { Button } from '@main-components/Base/Button';

export default function EmailLogin() {
    const theme = useTheme();
    const params = useParams();

    const restaurantId = params.id;
    const { data: restaurant, loading } = useGetRestaurantBySlug(restaurantId, {
        enabled: !!restaurantId
    });
    const foundId = restaurant?.id;
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    if (loading) return <Box></Box>;

    return (
            <Box
                    bg={'white'}
                    flex={1}
                    justifyContent={'center'}
                    style={{
                        backgroundImage: `linear-gradient(${theme.colors.contrastMain},${theme.colors.contrastLight}) `
                    }}
            >
                <Box
                        flex={0}
                        bg='white'
                        borderWidth={1}
                        borderColor={'primaryLightest'}
                        paddingVertical={'xl'}
                        width={'100%'}
                        borderRadius={20}
                        maxWidth={400}
                        style={{
                            minHeight: 'fit-content'

                        }}
                        p={'m'}
                        margin={'m'}
                        alignSelf={'center'}
                        justifyContent={'center'}
                >
                    <Text
                            variant={'heading4'}
                            color={'primaryMain'}
                            align={'center'}
                    >Iniciar sesión</Text>
                    {
                            !!foundId && (
                                    <Box mt={'m'}>
                                        <AuthScreenTitle
                                                icon={
                                                    <Image
                                                            source={{ uri: restaurant?.logoUrl }}
                                                            style={{
                                                                borderRadius: 150 / 2,
                                                                width: 150,
                                                                height: 150,
                                                                resizeMode: 'contain'
                                                            }}
                                                    />
                                                }
                                                title={restaurant?.name}
                                        />
                                    </Box>


                            )
                    }

                    <Box mt={'m'}>
                        <Form
                                defaultValues={{}}
                                style={{
                                    marginHorizontal: theme.spacing.m
                                }}
                                toolbar={<LoginButtonContainer restaurantId={restaurant?.id} />}
                                onSubmit={() => {
                                }}
                        >
                            {
                                    !foundId && (
                                            <Box mt={'m'}>
                                                <TextInput
                                                        label={'Código de restaurante'}
                                                        source={'slug'}
                                                        required
                                                        validate={[
                                                            required('Escribe el código del restaurante')
                                                        ]}
                                                        placeholder='Código asignado'
                                                />
                                            </Box>
                                    )
                            }
                            <EmailTextInput
                                    source='email'
                                    mode='rounded'
                                    required
                                    label='Correo electrónico'
                                    placeholder='Ej. myemail@domain.com'
                                    validate={[
                                        required('Escribe tu correo electrónico'),
                                        email('Correo inválido')
                                    ]}
                                    filterText={(text) => {
                                        return text?.replace(/ /g, '');
                                    }}
                                    autoFocus={true}
                            />

                            <PasswordInput
                                    source='password'
                                    required
                                    placeholder='Escribe tu contraseña'
                                    validate={required()}
                                    mode='rounded'
                                    label='Contraseña'
                            />
                            <Box
                                    mb='m'
                                    mt='s'
                                    alignItems={'center'}
                            >
                                <Button
                                        mode='text'
                                        uppercase={false}
                                        titleColor='primaryMain'
                                        onPress={() => {
                                            setShowForgotPassword(true);
                                        }}
                                        title='Olvidé mi contraseña'
                                />
                            </Box>
                        </Form>
                    </Box>

                </Box>
                <Box
                        alignItems={'center'}
                        mt={'m'}
                >
                    <Text color={'white'}>powered by Alfred©</Text>
                </Box>

                <ForgotPasswordModal
                        modal={{
                            visible: showForgotPassword,
                            onDismiss() {
                                setShowForgotPassword(false);
                            }
                        }}
                />
            </Box>
    );
}


function LoginButtonContainer(props: any) {
    const { login, loading } = useLoginWithEmailAndPassword();

    const submitLoginForm = async (values: {
        email: string;
        password: string;
        slug?: string;
        restaurantId: string
    }) => {
        try {
            if (!values.slug && !props.restaurantId) return;

            await login({
                email: values.email,
                password: values.password,
                slug: values.slug,
                restaurantId: props.restaurantId
            });
        } catch (error) {
            throw new Error(error);
        }
    };

    return (
            <Box
                    alignItems={'center'}
                    marginHorizontal={'m'}
            >
                <SaveButton
                        {...props}
                        label='Ingresar'
                        titleColor={'white'}
                        loading={loading}
                        backgroundColor={'primaryMain'}
                        uppercase={false}
                        onSubmit={async (data) => {
                            await submitLoginForm(data);
                        }}
                />
            </Box>
    );
}

function AuthScreenTitle({ title, icon }) {
    return (
            <Box
                    marginHorizontal={'m'}
                    mb={'m'}
            >
                <Box
                        justifyContent='center'
                        alignItems='center'
                        mb='s'
                >
                    {icon}
                </Box>
                <Box
                        paddingHorizontal='m'
                        mb='s'
                >
                    <Text
                            align='center'
                            bold
                    >
                        {title}
                    </Text>
                </Box>
            </Box>
    );
}
