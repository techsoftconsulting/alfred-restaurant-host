import ObjectUtils from '@utils/misc/object-utils';
import DateTimeUtils from '@utils/misc/datetime-utils';

interface ReservationClient {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string,
    allergies: string
}

interface ReservationTable {
    id: string;
    name: string;
    areaId: string;
}

interface ReservationRestaurant {
    id: string;
    name: string;
    logoUrl?: string;
}

interface ReservationMall {
    id: string;
    name: string;
}

export interface ReservationProps {
    id: string;
    code: string,
    restaurant: ReservationRestaurant
    client?: ReservationClient
    date: string,
    hour: string,
    table: ReservationTable,
    mall: ReservationMall,
    status: string;
    numberOfPeople: number;
    checkedIn: boolean;
    checkedInAt?: Date,
    canceled?: boolean
}

export interface ReservationPrimitiveProps extends ReservationProps {

}

export default class Reservation {

    constructor(private props: ReservationProps) {

    }

    get id() {
        return this.props.id;
    }

    get clientId() {
        return this.props.client?.id;
    }

    get mallId() {
        return this.props.mall.id;
    }

    get areaId() {
        return this.props.table.areaId;
    }

    get tableId() {
        return this.props.table.id;
    }

    get date() {
        return this.props.date;
    }

    get clientAllergies() {
        return this.props.client?.allergies;
    }

    get canCancel() {
        if (this.props.canceled) return false;
        if (this.props.checkedIn) return false;
        return !DateTimeUtils.isPast(DateTimeUtils.fromTime(this.props.date, 'YYYY-MM-DD'));
    }

    get hour() {
        return this.props.hour;
    }

    get hasClient() {
        if (!this.props.client) return false;
        if (Object.keys(this.props.client).length == 0) return false;
        return !!this.props.client;
    }

    get clientName() {
        const defaultText = `Sin cliente - ${this.props.code}`;
        if (!this.props.client) return defaultText;
        if (Object.keys(this.props.client).length == 0) return defaultText;
        return `${this.props.client.firstName} ${this.props.client.lastName}`;
    }

    get clientPhone() {
        const defaultText = `Sin teléfono`;
        if (!this.props.client) return defaultText;
        if (Object.keys(this.props.client).length == 0) return defaultText;
        return `${this.props.client.phone}`;
    }

    get tableNumber() {
        return this.props.table.name;
    }

    get table() {
        return this.props.table;
    }

    get mallName() {
        return this.props.mall.name;
    }

    get numberOfPeople() {
        return this.props.numberOfPeople;
    }

    get isCheckedIn() {
        return this.props.checkedIn;
    }

    get canceled() {
        return this.props.canceled;
    }

    static fromPrimitives(props: ReservationPrimitiveProps) {
        return new Reservation({
            ...props
        });
    }

    checkIn() {
        this.props.checkedIn = true;
        this.props.checkedInAt = new Date();
    }

    updateInfo(info: Omit<Partial<ReservationProps>, 'id' | 'code' | 'createdAt'>) {
        this.props = ObjectUtils.merge(this.props, info);
    }

    removeClient() {
        this.props.client = undefined;
    }

    toPrimitives(): ReservationPrimitiveProps {
        return {
            ...this.props
        };
    }
}
