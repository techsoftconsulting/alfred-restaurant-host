import AppLayout from '@main-components/Layout/AppLayout';
import useFindReservations from '@modules/reservations/application/use-find-reservations';
import NoItems from '@main-components/Secondary/NoItems';
import { Icon } from '@main-components/Base/Icon';
import { Box } from '@main-components/Base/Box';
import { Skeleton } from '@main-components/Base/Skeleton';
import Text from '@main-components/Typography/Text';
import { IconButton } from '@main-components/Base/IconButton';
import Reservation from '@modules/reservations/domain/models/reservation';
import DateTimeUtils from '@utils/misc/datetime-utils';
import DatetimeUtils from '@utils/misc/datetime-utils';
import ArrayUtils from '@utils/misc/array-utils';
import TextUtils from '@utils/misc/text-utils';
import ScrollView from '@main-components/Utilities/ScrollView';
import React, { useState } from 'react';
import { Agenda } from '@main-components/Base/Agenda';
import SaveReservationModal from '@modules/reservations/ui/screens/ReservationsScreen/components/SaveReservationModal';
import useConfirm from '@shared/domain/hooks/use-confirm';
import { useDeleteReservation } from '@modules/reservations/application/use-delete-reservation';
import useUpdateReservation from '@modules/reservations/application/use-update-reservation';
import { Modal } from '@main-components/Base/Modal';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import ScanReservationController
    from '@modules/reservations/ui/screens/ReservationsScreen/components/ScanReservationController';

export default function ReservationsScreen() {
    const { loading: loadingReservations } = useFindReservations({}, undefined, undefined, undefined);
    const { loading: loadingReservationsCalendar } = useFindReservations({}, undefined, undefined, {
        queryGroups: ['calendar']
    });
    const { save: updateReservation, loading: updating } = useUpdateReservation();

    const { delete: removeReservation, loading: deleting } = useDeleteReservation();

    const [showScanner, setShowScanner] = useState(false);

    const [showSaveModal, setShowSaveModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedLayout, setSelectedLayout] = useState('list');
    const [defaultValues, setDefaultValues] = useState(null);

    const confirm = useConfirm();


    const actionProps = {
        onEditItem: (id) => {
            setShowSaveModal(true);
            setEditingItem(id);
        },
        onDeleteItem: (id) => {
            confirm({
                title: 'Eliminar reservación',
                options: {
                    confirmText: 'Sí',
                    cancelText: 'No'
                },
                async onConfirm() {
                    await removeReservation(id);
                },
                content:
                        '¿Estás seguro que deseas eliminar esta reservación?'
            });
        },
        onCheckItem(item) {
            setShowScanner(true);
        }
    };
    return (
            <AppLayout
                    noPadding
                    loading={loadingReservations || loadingReservationsCalendar || deleting || updating}
                    title={'Reservaciones disponibles'}
            >

                <Box
                        p={'m'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        flexDirection={'row'}
                >
                    <Box
                            alignItems={'center'}
                            flexDirection={'row'}
                    >
                        <Box mr={'m'}>
                            <IconButton
                                    iconName={'list'}
                                    containerSize={50}
                                    backgroundColor={selectedLayout == 'list' ? 'appSuccess' : 'greyMedium'}
                                    borderRadius={50 / 2}
                                    onPress={() => {
                                        setSelectedLayout('list');
                                    }}
                            />
                        </Box>
                        <Box mr={'m'}>
                            <IconButton
                                    iconName={'calendar'}
                                    iconType={'font-awesome'}
                                    containerSize={50}
                                    backgroundColor={selectedLayout == 'calendar' ? 'appSuccess' : 'greyMedium'}
                                    borderRadius={50 / 2}
                                    onPress={() => {
                                        setSelectedLayout('calendar');
                                    }}
                            />
                        </Box>
                    </Box>

                </Box>

                <ScrollView>
                    {
                        selectedLayout == 'list' ? (
                                <>
                                    <ListView
                                            {...actionProps}
                                            updateReservation={updateReservation}
                                    />
                                </>
                        ) : (
                                <CalendarView
                                        {...actionProps}
                                        onAdd={({ date }) => {
                                            setDefaultValues({ date: date });
                                            setShowSaveModal(true);
                                        }}
                                />
                        )
                    }
                </ScrollView>


                <ScanReservationController
                        modal={{
                            visible: showScanner,
                            onDismiss() {
                                setShowScanner(false);
                            }
                        }}
                />

                <SaveReservationModal
                        modal={{
                            visible: showSaveModal,
                            onDismiss() {
                                setDefaultValues(null);
                                setEditingItem(null);
                                setShowSaveModal(false);
                            }
                        }}
                        form={{
                            defaultValues: defaultValues,
                            id: editingItem
                        }}
                />

            </AppLayout>
    );
}

function ListView(props) {
    const { data, ids, loading: loadingReservations } = useFindReservations({}, undefined, undefined, undefined);
    const items = ids?.map(el => data?.[el]) ?? [];

    const groupedItems = ArrayUtils.groupBy(items ?? [], 'date');

    if (!loadingReservations && items.length == 0) {
        return (
                <NoItems
                        title={'Aqui estarán las resevaciones listadas'}
                        icon={<Icon
                                name={'calendar'}
                                type={'ionicon'}
                                color={'greyMain'}
                                numberSize={100}
                        />}
                />
        );
    }

    return (
            <>
                {
                    Object.keys(groupedItems).map(key => {
                        const group = groupedItems[key];

                        const title = (() => {
                            const part1 = DateTimeUtils.format2(DateTimeUtils.fromString(key, 'YYYY-MM-DD'), 'iii dd');
                            const part2 = DateTimeUtils.format2(DateTimeUtils.fromString(key, 'YYYY-MM-DD'), 'MMMM');

                            return `${TextUtils.capitalize(part1)} de ${TextUtils.capitalize(part2)}`;
                        })();

                        return (
                                <Box p={'m'}>
                                    <Box
                                            paddingVertical={'s'}
                                            marginVertical={'m'}
                                            borderTopWidth={2}
                                            borderTopColor={'primaryMain'}
                                            style={{
                                                width: 'fit-content'
                                            }}
                                    >
                                        <Text
                                                variant={'heading1'}
                                                bold
                                        >{title}</Text>
                                    </Box>
                                    <Box>
                                        <ItemsList
                                                loading={loadingReservations}
                                                items={group}
                                                onEditItem={props.onEditItem}
                                                onDeleteItem={props.onDeleteItem}
                                                onCheckItem={(item: Reservation) => {
                                                    props.onCheckItem(item);
                                                }}
                                        />
                                    </Box>
                                </Box>
                        );
                    })
                }
            </>
    );
}

function CalendarView(props) {

    const [range, setRange] = useState();

    const { data, ids, loading: loadingReservationsCalendar } = useFindReservations({
        range: range
    }, undefined, undefined, {
        queryGroups: ['calendar']
    });
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [showCalendarEvent, setShowCalendarEvent] = useState(null);


    const viewItems = ids?.map(el => {
        const element = data[el];

        return {
            id: element.id,
            title: `${element.clientName}`,
            date: DatetimeUtils.fromString(`${element.date} ${element.hour}`, 'YYYY-MM-DD HH:mm')
        };
    }) ?? [];

    const calendarRef = React.createRef();


    return (
            <Box p={'m'}>
                <Agenda
                        calendarRef={calendarRef}
                        events={viewItems}
                        onMonthChange={(range) => {
                            setRange(range);
                        }}
                        onAddEvent={({ date }) => {
                            const d = DateTimeUtils.format(date, 'YYYY-MM-DD');
                            setShowCalendarEvent(d);
                        }}
                        onEventPress={(id, date) => {
                            const d = DateTimeUtils.format(date, 'YYYY-MM-DD');
                            setShowCalendarEvent(d);
                        }}
                />
                <CalendarEventsDetailsModal
                        date={showCalendarEvent}
                        onItemPress={(id) => {
                            setShowCalendarEvent(null);
                            setShowSaveModal(true);
                            setEditingItem(id);

                        }}
                        modal={{
                            visible: !!showCalendarEvent,
                            onDismiss() {
                                setShowCalendarEvent(null);
                            }
                        }}
                />

                <SaveReservationModal
                        modal={{
                            visible: showSaveModal,
                            onDismiss() {
                                setEditingItem(null);
                                setShowSaveModal(false);
                            }
                        }}
                        form={{
                            defaultValues: null,
                            id: editingItem
                        }}
                />
            </Box>
    );
}

function CalendarEventsDetailsModal({ onItemPress, ...props }) {
    const date = props.date ? DateTimeUtils.fromString(props.date, 'YYYY-MM-DD') : undefined;
    const { data: items, ids, loading: loadingReservationsCalendar } = useFindReservations({
        date: date ? props.date : undefined
    }, undefined, undefined, {
        queryGroups: ['calendar'],
        enabled: !!date
    });

    return (
            <Modal
                    {...props.modal}
                    contentContainerStyle={{
                        maxWidth: 500,
                        alignSelf: 'center',
                        borderRadius: 30,
                        top: 'calc(50% - 300px)'
                    }}
            >
                <Box
                        alignItems={'center'}
                        justifyContent={'center'}
                        height={600}
                >
                    <Text
                            bold
                            color={'black'}
                            variant={'heading4'}
                    >{date ? TextUtils.capitalize(DateTimeUtils.format2(date, 'MMM')) : undefined}</Text>
                    <Box mt={'s'}>
                        <Text
                                color={'black'}
                                style={{
                                    fontSize: 100
                                }}
                                bold
                                variant={'big1'}
                        >{date ? DateTimeUtils.format2(date, 'dd') : undefined}</Text>
                    </Box>
                    <Box mt={'s'}>
                        <Text
                                color={'black'}
                                style={{
                                    fontSize: 20
                                }}
                                bold
                                variant={'big1'}
                        >{date ? TextUtils.capitalize(DateTimeUtils.format2(date, 'EEEE')) : undefined}</Text>
                    </Box>
                    <Box
                            mt={'m'}
                            mb={'m'}
                            pb={'xs'}
                            borderBottomWidth={2}
                            borderBottomColor={'contrastLight'}
                    >
                        <Text>Reservaciones</Text>
                    </Box>
                    <Box
                            width={'100%'}
                            flex={1}
                    >
                        <ScrollView>

                            {
                                    ids?.length == 0 && (
                                            <Box
                                                    mt={'l'}
                                                    justifyContent={'center'}
                                                    alignItems={'center'}
                                            >
                                                <Text color={'greyMain'}>Sin reservaciones...</Text>
                                            </Box>
                                    )
                            }
                            {
                                [...ids ?? []].map(id => {
                                    const item = items[id];

                                    return (
                                            <TouchableOpacity
                                                    onPress={() => {
                                                        onItemPress(id);
                                                    }}
                                            >
                                                <Box
                                                        height={20}
                                                        borderRadius={10}
                                                        flex={1}
                                                        bg={'contrastLight'}
                                                        flexDirection={'row'}
                                                        p={'m'}
                                                        mb={'s'}
                                                        gap={'m'}
                                                        marginHorizontal={'l'}
                                                        justifyContent={'space-between'}
                                                >
                                                    <Box>
                                                        <Text
                                                                bold
                                                                color={'white'}
                                                        >{item.clientName}</Text>
                                                    </Box>

                                                    <Box>
                                                        <Text
                                                                bold
                                                                color={'white'}
                                                        >Hora: {item.hour}</Text>
                                                    </Box>
                                                </Box>
                                            </TouchableOpacity>
                                    );
                                })
                            }
                        </ScrollView>

                    </Box>

                </Box>
                <Box
                        position={'absolute'}
                        top={20}
                        right={0}
                >
                    <TouchableOpacity
                            onPress={() => {
                                props.modal.onDismiss();
                            }}
                    >
                        <Box
                                width={80}
                                height={80}
                        >
                            <Icon
                                    name={'close-circle-outline'}
                                    color={'dangerMain'}
                                    numberSize={40}
                                    type={'ionicon'}
                            />
                        </Box>
                    </TouchableOpacity>
                </Box>
            </Modal>

    );
}

function ItemsList({
    loading,
    items,
    onEditItem,
    onDeleteItem,
    onCheckItem
}: { loading: boolean; items: Reservation[], onCheckItem: any; onEditItem: any, onDeleteItem: any }) {

    const confirm = useConfirm();

    if (!loading && items.length == 0) {
        return (
                <NoItems
                        title={'Sin resevaciones'}
                        icon={<Icon
                                name={'calendar'}
                                type={'ionicon'}
                                color={'greyMain'}
                                numberSize={100}
                        />}
                />
        );
    }

    if (loading) {
        return (
                <Skeleton
                        type={'rectangle'}
                        loading
                        height={60}
                        style={{
                            borderRadius: 20
                        }}
                />
        );
    }

    return (
            <>
                {
                    items.map(item => {
                        return (
                                <Box
                                        bg={'contrastLight'}
                                        minHeight={60}
                                        borderRadius={20}
                                        flexDirection={'row'}
                                        alignItems={'center'}
                                        paddingHorizontal={'l'}
                                        flexWrap={'wrap'}
                                        gap={'xl'}
                                        mb={'m'}
                                        p={'s'}
                                >
                                    <Box
                                            minWidth={70}
                                    >
                                        <Text color={'white'}>{item.hour}</Text>
                                    </Box>
                                    <Box
                                            flex={1}
                                    >
                                        <Text
                                                numberOfLines={2}
                                                color={'white'}
                                        >{item.clientName}</Text>
                                    </Box>
                                    <Box flex={1}>
                                        <Text
                                                color={'white'}
                                                numberOfLines={1}
                                        >{item.clientPhone}</Text>
                                    </Box>
                                    <Box>
                                        <Box
                                                p={'s'}
                                                bg={'white'}
                                                borderRadius={13}
                                                paddingHorizontal={'m'}
                                        >
                                            <Text
                                                    bold
                                                    color={item.canceled ? 'dangerMain' : item.isCheckedIn ? 'appSuccess' : 'warningMain'}
                                            >{item.canceled ? 'Cancelado' : item.isCheckedIn ? 'Asistido' : 'En espera'}</Text>
                                        </Box>
                                    </Box>
                                    <Box
                                            flex={1}
                                            width={'100%'}
                                            minWidth={140}
                                            alignItems={'flex-end'}
                                    >
                                        <RowOptions
                                                entity={item}
                                                onEdit={() => {
                                                    onEditItem(item.id);
                                                }}
                                                onDelete={() => {
                                                    onDeleteItem(item.id);
                                                }}
                                                onCheck={() => {
                                                    onCheckItem(item);
                                                }}
                                        />
                                    </Box>
                                </Box>
                        );
                    })
                }
            </>
    );


}


function RowOptions({ entity, onEdit, onDelete, onCheck }: { onCheck: any; entity: any, onEdit: any; onDelete: any }) {
    console.log(entity.isWaiting);
    return (
            <Box
                    gap={'m'}
                    flexDirection={'row'}
            >
                {
                        !!entity?.isWaiting && (
                                <IconButton
                                        onPress={() => {
                                            onCheck();
                                        }}
                                        containerSize={40}
                                        borderRadius={40}
                                        backgroundColor={'white'}
                                        iconType={'ionicon'}
                                        iconColor={'greyDark'}
                                        iconName={'scan'}
                                        iconSize={24}
                                />
                        )
                }

                {
                        !entity?.canceled && (
                                <IconButton
                                        onPress={() => {
                                            onEdit();
                                        }}
                                        containerSize={40}
                                        borderRadius={40}
                                        backgroundColor={'white'}
                                        iconType={'feather'}
                                        iconColor={'greyDark'}
                                        iconName={'edit'}
                                        iconSize={24}
                                />
                        )
                }

                <IconButton
                        onPress={() => {
                            onDelete();
                        }}
                        containerSize={40}
                        borderRadius={40}
                        backgroundColor={'white'}
                        iconType={'feather'}
                        iconColor={'greyDark'}
                        iconName={'trash'}
                        iconSize={24}
                />

                {/*   {
                        !entity!.isCheckedIn && (
                                <IconButton
                                        onPress={() => {
                                            onCheck();
                                        }}
                                        iconType={'feather'}
                                        iconColor={'greyDark'}
                                        iconName={'check'}
                                />
                        )
                }*/}

            </Box>
    );
}