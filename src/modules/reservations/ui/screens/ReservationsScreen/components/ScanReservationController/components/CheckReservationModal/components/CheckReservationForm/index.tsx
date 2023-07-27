import { Form } from '@main-components/Form/Form';
import { Box } from '@main-components/Base/Box';
import { email, required } from '@shared/domain/form/validate';
import SaveButton from '@main-components/Form/components/SaveButton';
import React, { useEffect, useState } from 'react';
import useNotify from '@shared/domain/hooks/use-notify';
import useFindRestaurantMalls from '@modules/user/application/malls/use-find-restaurant-malls';
import SelectInput from '@main-components/Form/inputs/SelectInput';
import useFindRestaurantAreas from '@modules/tables/application/use-find-restaurant-areas';
import useGetIdentity from '@modules/auth/application/use-get-identity';
import useCreateReservation from '@modules/reservations/application/use-create-reservation';
import useUpdateReservation from '@modules/reservations/application/use-update-reservation';
import Reservation from '@modules/reservations/domain/models/reservation';
import DateInput from '@main-components/Form/inputs/DateInput';
import TimeInput from '@main-components/Form/inputs/TimeInput';
import TextInput from '@main-components/Form/inputs/TextInput';
import useRepository from '@shared/domain/hooks/use-repository';
import RestaurantMallRepository from '@modules/user/domain/repositories/restaurant-mall-repository';
import RestaurantAreaRepository from '@modules/tables/domain/repositories/restaurant-area-repository';
import DateTimeUtils from '@utils/misc/datetime-utils';
import useGetRestaurantById from '@modules/user/application/use-get-restaurant-by-id';
import PhoneTextInput from '@main-components/Form/inputs/PhoneTextInput';
import { useForm } from '@shared/domain/form/useForm';
import useGetClient from '@modules/clients/application/use-get-client';
import { ProgressBar } from '@main-components/Base/ProgressBar';
import { Icon } from '@main-components/Base/Icon';

interface ReservationFormProps {
    id?: string;
    defaultValues?: any;
    onSave: any;
    onSaving?: any;
    onError?: any;
    onSuccess?: any;
    item?: Reservation;
}


export default function CheckReservationForm(props: ReservationFormProps) {
    return (
            <Form
                    defaultValues={props.defaultValues}
                    toolbar={
                        <FormToolbar
                                item={props.item}
                                id={props.id}
                                onSave={props.onSave}
                                {...props}
                        />
                    }
            >

                <Box
                        flexDirection={'row'}
                >
                    <Box
                            flex={0.5}
                            mr={'l'}
                    >
                        <DateInput
                                label={'Fecha'}
                                required
                                validate={required()}
                                source={'date'}
                        />

                    </Box>

                    <Box flex={0.5}>
                        <TimeInput
                                label={'Hora'}
                                required
                                validate={required()}
                                source={'hour'}
                        />
                    </Box>
                </Box>

                <Box
                        flexDirection={'row'}
                        gap={'m'}
                >


                    <Box flex={0.5}>
                        <TextInput
                                source={'numberOfPeople'}
                                required
                                validate={[required()]}
                                label={'Número de personas'}
                        />
                    </Box>
                    <Box
                            flex={0.5}
                    >
                        <MyMallsSelectInput
                                source={'mallId'}
                                required
                                validate={[required()]}
                                label={'Plaza'}
                        />
                    </Box>

                    <Box flex={0.5}>
                        <SelectedTableInput
                                label={'Mesa'}
                                source={'tableId'}
                                required
                                validate={[required()]}
                        />
                    </Box>
                </Box>


                <ClientInputController />

                <ClientFieldsController />


            </Form>
    );
}

function ClientInputController() {
    const { setValue, watch } = useForm();
    const [selectedClientId, setSelectedClientId] = useState(null);
    const { data: client, loading, isRefetching } = useGetClient(selectedClientId ?? '', {
        enabled: !!selectedClientId
    });
    const isLoading = loading || isRefetching;
    const values = watch(['clientEnabled']);
    useEffect(() => {
        if (isLoading) return;
        if (!client) return;
        setValue('clientId', client.id);
        setValue('client', {
            id: client.id,
            firstName: client.firstName,
            lastName: client.lastName,
            allergies: client.allergies,
            phone: client.phone,
            email: client.email
        });
    }, [client?.id, isLoading]);


    return (
            <Box>
                <Box
                        opacity={isLoading ? 1 : 0}
                        mb={'m'}
                >
                    <ProgressBar
                            borderRadius={20}
                            progress={0}
                            indeterminate
                    />
                </Box>

            </Box>

    );
}

function ClientFieldsController() {
    const { watch } = useForm();

    return (
            <>
                <Box
                        flexDirection={'row'}
                >
                    <Box
                            flex={0.5}
                            mr={'l'}
                    >
                        <TextInput
                                required
                                validate={required()}
                                label={'Nombre'}
                                source={'client.firstName'}
                        />


                    </Box>

                    <Box flex={0.5}>
                        <TextInput
                                required
                                validate={required()}
                                label={'Apellido'}
                                source={'client.lastName'}
                        />
                    </Box>
                </Box>
                <TextInput
                        required
                        validate={[
                            required(),
                            email('Email inválido')
                        ]}
                        label={'Correo'}
                        source={'client.email'}
                />
                <PhoneTextInput
                        required
                        validate={[
                            required()
                        ]}
                        label={'Número de contacto'}
                        source={'client.phone'}
                />
                <TextInput
                        label={'Alergias'}
                        source={'client.allergies'}
                />
            </>
    );
}


function FormToolbar(props) {
    const { save, loading } = useCreateReservation();
    const { save: update, loading: updating } = useUpdateReservation();
    const notify = useNotify();
    const { identity } = useGetIdentity();
    const { data: restaurant, loading: loadingRestaurant } = useGetRestaurantById(identity?.restaurantId ?? '', {
        enabled: !!identity?.restaurantId
    });
    const [saving, setSaving] = useState(false);
    const mallRepo = useRepository<RestaurantMallRepository>('RestaurantMallRepository');
    const areaRepo = useRepository<RestaurantAreaRepository>('RestaurantAreaRepository');


    return (
            <Box alignItems={'center'}>
                <SaveButton
                        {...props}
                        label='Confirmar asistencia'
                        titleColor={'white'}
                        loading={loading || updating || saving}
                        backgroundColor={'appSuccess'}
                        uppercase={false}
                        icon={() => {
                            return <Icon
                                    name='check'
                                    numberSize={20}
                                    type={'material-community-icons'}
                                    color='white'
                            />;
                        }}
                        onSubmit={async (data) => {
                            setSaving(true);
                            props?.onSaving?.();

                            try {
                                if (!identity) throw new Error('MISSING_DATA');
                                if (!restaurant) throw new Error('MISSING_DATA');

                                const client = data.client;

                                const mall = await mallRepo.find(data.mallId);
                                const [areaId, tableId] = data.tableId?.split('*');

                                const area = (await areaRepo.findAreas()).find(el => el.id == areaId);
                                if (!area) throw new Error('MISSING_DATA');

                                const table = area.findTable(tableId);
                                if (!table) throw new Error('MISSING_DATA');
                                if (!mall) throw new Error('MISSING_DATA');


                                if (!props.item) throw new Error('MISSING_DATA');

                                const item: Reservation = props.item;

                                item.updateInfo({
                                    mall: {
                                        id: mall.id,
                                        name: mall.name
                                    },
                                    client: {
                                        id: client.id ?? data.clientId ?? '',
                                        firstName: client.firstName,
                                        lastName: client.firstName,
                                        allergies: client.allergies,
                                        phone: client.phone,
                                        email: client.email
                                    },
                                    table: {
                                        id: table.id,
                                        name: `Mesa ${table.number}`,
                                        areaId: area.id
                                    },
                                    status: 'ACTIVE',
                                    numberOfPeople: parseInt(data.numberOfPeople),
                                    date: DateTimeUtils.format(data.date, 'YYYY-MM-DD'),
                                    hour: data.hour
                                });

                                item.checkIn();

                                await update(item.id, item);

                                setSaving(false);
                                props?.onSave?.();

                                if (
                                        props?.onSuccess
                                ) {
                                    props?.onSuccess?.();
                                } else {
                                    notify('Reservación validada exitosamente', 'success', null, false, 1000);
                                }
                            } catch (e) {
                                props?.onError?.(e.message);

                            } finally {
                                setSaving(false);
                            }

                        }}
                />
            </Box>
    );
}


function MyMallsSelectInput(props: any) {
    const { data, loading } = useFindRestaurantMalls();

    return (
            <SelectInput
                    {...props}
                    choices={data?.map(e => {
                        return {
                            id: e.id,
                            label: e.name,
                            name: e.name
                        };
                    })}
            />
    );
}

function SelectedTableInput(props: any) {
    const { data: areas, ids, loading: loadingAreas } = useFindRestaurantAreas();

    const items = ids?.reduce((curr, el) => {
        const area = areas[el];
        const tables = area.tables;

        return [
            ...curr,
            ...tables.map(t => {
                return {
                    id: `${area.id}*${t.id}`,
                    name: `${area.name} - Mesa ${t.number}`
                };
            })
        ];
    }, []);

    return (
            <SelectInput
                    {...props}
                    choices={items}
            />
    );
}

