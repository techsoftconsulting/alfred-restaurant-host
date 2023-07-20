import { Form } from '@main-components/Form/Form';
import { Box } from '@main-components/Base/Box';
import { email, required } from '@shared/domain/form/validate';
import SaveButton from '@main-components/Form/components/SaveButton';
import AppIcon from '@main-components/Base/AppIcon';
import React, { useEffect, useState } from 'react';
import UuidUtils from '@utils/misc/uuid-utils';
import useNotify from '@shared/domain/hooks/use-notify';
import useFindRestaurantMalls from '@modules/user/application/malls/use-find-restaurant-malls';
import SelectInput from '@main-components/Form/inputs/SelectInput';
import useGetIdentity from '@modules/auth/application/use-get-identity';
import useCreateReservation from '@modules/reservations/application/use-create-reservation';
import useUpdateReservation from '@modules/reservations/application/use-update-reservation';
import Reservation from '@modules/reservations/domain/models/reservation';
import useFindClients from '@modules/clients/application/use-find-clients';
import DateInput from '@main-components/Form/inputs/DateInput';
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
import CheckboxInput from '@main-components/Form/inputs/CheckboxInput';
import useGetRestaurantAvailability from '@modules/reservations/application/use-get-restaurant-availability';
import ArrayUtils from '@utils/misc/array-utils';
import { Button } from '@main-components/Base/Button';
import { Icon } from '@main-components/Base/Icon';
import { IconButton } from '@main-components/Base/IconButton';
import useCancelReservation from '@modules/reservations/application/use-cancel-reservation';

interface ReservationFormProps {
    id?: string;
    defaultValues?: any;
    onSave: any;
    onSaving?: any;
    onError?: any;
    onSuccess?: any;
    item?: Reservation;
    onCancelSuccess: any;
}


export default function ReservationForm(props: ReservationFormProps) {
    return (
            <Form
                    defaultValues={{
                        ...props.defaultValues,
                        tableId: props.defaultValues?.table?.id
                    }}
                    toolbar={
                        <FormToolbar
                                item={props.item}
                                id={props.id}
                                onSave={props.onSave}
                                {...props}
                                onCancelSuccess={props.onCancelSuccess}
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

                        <ReservationDateInput
                                label={'Fecha'}
                                required
                                validate={required()}
                                source={'date'}
                        />
                    </Box>

                    <Box flex={0.5}>
                        <ReservationTimeInput
                                item={props.item}
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
                                item={props.item}
                                label={'Mesa'}
                                source={'tableId'}
                                required
                                validate={[required()]}
                        />
                    </Box>
                </Box>

                <Box flexDirection={'row'}>
                    <Box flex={0.5}>
                        <CheckboxInput
                                source={'clientEnabled'}
                                title={'Asociar cliente'}
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
    const values = watch(['clientEnabled']);
    if (!values.clientEnabled) return <Box />;

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
                        label={'Alergias'}
                        source={'client.allergies'}
                />
                <Box
                        flexDirection={'row'}
                        gap={'m'}
                >
                    <Box flex={0.5}>
                        <TextInput
                                required
                                validate={[
                                    required(),
                                    email('Email inválido')
                                ]}
                                label={'Correo'}
                                source={'client.email'}
                        />
                    </Box>

                    <Box flex={0.5}>
                        <PhoneTextInput
                                required
                                validate={[
                                    required()
                                ]}
                                label={'Número de contacto'}
                                source={'client.phone'}
                        />
                    </Box>
                </Box>
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
            <Box
                    gap={'m'}
                    alignItems={'center'}
            >
                <SaveButton
                        {...props}
                        label='Guardar'
                        titleColor={'white'}
                        loading={loading || updating || saving}
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
                            setSaving(true);
                            props?.onSaving?.();

                            try {
                                if (!identity) throw new Error('MISSING_DATA');
                                if (!restaurant) throw new Error('MISSING_DATA');

                                const client = data.client;

                                // const client = await clientRepo.getClient(data.clientId);
                                const mall = await mallRepo.find(data.mallId);
                                const tableId = data.tableId;

                                const area = (await areaRepo.findAreas()).find(el => {
                                    return el.findTable(tableId);
                                });

                                if (!area) throw new Error('MISSING_DATA');

                                const table = area.findTable(tableId);
                                if (!table) throw new Error('MISSING_DATA');
                                if (!mall) throw new Error('MISSING_DATA');


                                const clientEnabled = Boolean(data.clientEnabled);

                                if (!props.id) {

                                    const item = Reservation.fromPrimitives({
                                        id: UuidUtils.persistenceUuid(),
                                        mall: {
                                            id: mall.id,
                                            name: mall.name
                                        },
                                        client: clientEnabled ? {
                                            id: client.id ?? data.clientId ?? '',
                                            firstName: client.firstName,
                                            lastName: client.firstName,
                                            allergies: client.allergies,
                                            phone: client.phone,
                                            email: client.email
                                        } : undefined,
                                        checkedIn: false,
                                        table: {
                                            id: table.id,
                                            name: `Mesa ${table.number}`,
                                            areaId: area.id
                                        },
                                        status: 'ACTIVE',
                                        numberOfPeople: parseInt(data.numberOfPeople),
                                        code: UuidUtils.code(8),
                                        date: DateTimeUtils.format(data.date, 'YYYY-MM-DD'),
                                        hour: data.hour,
                                        restaurant: {
                                            id: identity.restaurantId,
                                            name: restaurant.name,
                                            logoUrl: restaurant.logoUrl
                                        }
                                    });

                                    await save(item);
                                    props?.onSave?.();
                                    setSaving(false);

                                    if (
                                            props?.onSuccess
                                    ) {
                                        props?.onSuccess?.();
                                    } else {
                                        notify('Reservación creada exitosamente', 'success');

                                    }

                                    return;
                                }

                                if (!props.item) return;

                                const item: Reservation = props.item;

                                item.updateInfo({
                                    mall: {
                                        id: mall.id,
                                        name: mall.name
                                    },
                                    client: clientEnabled ? {
                                        id: client.id ?? data.clientId ?? '',
                                        firstName: client.firstName,
                                        lastName: client.firstName,
                                        allergies: client.allergies,
                                        phone: client.phone,
                                        email: client.email
                                    } : undefined,
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

                                if (!clientEnabled) {
                                    item.removeClient();
                                }

                                await update(item.id, item);
                                setSaving(false);
                                props?.onSave?.();

                                if (
                                        props?.onSuccess
                                ) {
                                    props?.onSuccess?.();
                                } else {
                                    notify('Reservación creada exitosamente', 'success');

                                }
                            } catch (e) {
                                props?.onError?.(e.message);

                            } finally {
                                setSaving(false);
                            }

                        }}
                />
                <CancelButton
                        reservation={props.item}
                        onSuccess={props.onCancelSuccess}
                />
            </Box>
    );
}

function ReservationDateInput(props) {
    const { setValue } = useForm();

    return (
            <DateInput
                    {...props}
                    onChange={() => {
                        setValue('tableId', null);
                        setValue('hour', null);
                    }}
            />
    );
}

function ReservationTimeInput(props) {
    const { watch, setValue } = useForm();
    const date = watch('date');
    const hour = watch('hour');
    const { identity } = useGetIdentity();
    const {
        data: availability,
        loading: loadingAvailability
    } = useGetRestaurantAvailability(identity?.restaurantId, DateTimeUtils.format(date, 'YYYY-MM-DD'), { enabled: !!identity?.restaurantId && !!date && date !== '' });

    const slots = ArrayUtils.orderBy(ArrayUtils.uniqBy(availability?.tables.flatMap(t => t.availableSlots).map(el => {
        return {
            str: el,
            hour: DateTimeUtils.fromTime(el)
        };
    }), 'str'), ['hour'], ['asc']);

    const defaultOptions = slots?.map(e => {
        return {
            id: e.str,
            label: e.str,
            name: DateTimeUtils.format(DateTimeUtils.fromTime(e.str), 'hh:mm A')
        };
    });

    const options = !!props.item && !!hour ? ArrayUtils.uniqBy([
        ...[
            {
                id: hour,
                label: hour,
                name: DateTimeUtils.format(DateTimeUtils.fromTime(hour), 'hh:mm A')
            }
        ],
        ...defaultOptions
    ], 'id') : defaultOptions;

    return <SelectInput
            {...props}
            loading={loadingAvailability}
            choices={options}
            onChange={() => {
                setValue('tableId', null);
            }}
    />;
}

function SelectedTableInput(props: any) {
    const { watch } = useForm();
    const date = watch('date');
    const hour = watch('hour');
    const { identity } = useGetIdentity();
    const {
        data: availability,
        loading: loadingAvailability
    } = useGetRestaurantAvailability(identity?.restaurantId, DateTimeUtils.format(date, 'YYYY-MM-DD'), { enabled: !!identity?.restaurantId && !!date && date !== '' });


    const options = (!availability || !hour || hour == '') ? [] : availability?.tables.filter(el => el.availableSlots.includes(hour));

    const defaultOptions = options?.map(o => {
        return {
            id: o.id,
            name: `${o.areaName} - ${o.name}`
        };
    });
    const finalOptions = !!props.item && !!hour ? ArrayUtils.uniqBy([
        ...[
            {
                id: props.item?.table?.id,
                name: `${props.item?.table?.name}`
            }
        ],
        ...defaultOptions
    ], 'id') : defaultOptions;

    return (
            <SelectInput
                    {...props}
                    choices={finalOptions}
            />
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

function ClientSelectInput(props: any) {
    const { data, ids, loading } = useFindClients();

    return (
            <SelectInput
                    {...props}
                    choices={ids?.map(el => {
                        const client = data[el];
                        return {
                            id: el,
                            name: `${client.email} - ${client.fullName}`
                        };
                    })}
            />
    );
}

function CancelButton({ reservation, onSuccess }: { onSuccess: any; reservation?: Reservation }) {

    const [confirm, setConfirm] = useState(false);
    const { save, loading } = useCancelReservation();

    useEffect(() => {
        setConfirm(false);
    }, []);

    if (!reservation) return <Box />;
    if (!reservation.canCancel) return <Box />;

    if (confirm) {
        return (
                <Box
                        flexDirection={'row'}
                        gap={'m'}
                        alignItems={'center'}
                >
                    <Box>
                        <IconButton
                                containerSize={40}
                                borderRadius={20}
                                backgroundColor={'black'}
                                iconName={'times'}
                                iconColor={'white'}
                                iconSize={20}
                                onPress={() => {
                                    setConfirm(false);
                                }}
                        />
                    </Box>
                    <Box>
                        <Button
                                loading={loading}
                                icon={() => {
                                    return <Icon
                                            name='check'
                                            numberSize={20}
                                            type={'material-community-icons'}
                                            color='white'
                                    />;
                                }}
                                onPress={async () => {
                                    if (!reservation) return;
                                    await save(reservation.id, '');
                                    onSuccess();
                                }}
                                backgroundColor={'dangerMain'}
                                title={'Confirmar cancelación'}
                        />
                    </Box>
                </Box>

        );
    }

    return (
            <Button
                    icon={() => {
                        return <Icon
                                name='cancel'
                                numberSize={20}
                                type={'material-community-icons'}
                                color='white'
                        />;
                    }}
                    onPress={() => {
                        setConfirm(true);
                    }}
                    backgroundColor={'dangerMain'}
                    title={'Cancelar'}
            />

    );
}