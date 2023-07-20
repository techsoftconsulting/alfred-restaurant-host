import PaginationOptions from '@modules/_shared/domain/models/pagination-options';
import SortOptions from '@shared/domain/models/sort-options';
import { getLoggedInUserSession } from '@modules/auth/infrastructure/providers/app-auth-provider';
import ReservationRepository from '@modules/reservations/domain/respositories/reservation-repository';
import Reservation from '@modules/reservations/domain/models/reservation';
import ReservationMapper from '@modules/reservations/infrastructure/mappers/reservation-mapper';
import APIRepository from '@shared/infrastructure/api/api-repository';
import RestaurantAvailability from '@modules/reservations/domain/models/restaurant-availability';

const COLLECTION_NAME = 'reservation';

export default class ApiReservationRepository extends APIRepository implements ReservationRepository {

    async findReservations(
        filter?: any,
        pagination?: PaginationOptions,
        sort?: SortOptions
    ): Promise<Reservation[]> {
        const restaurantId = (await getLoggedInUserSession())?.restaurantId;
        if (!restaurantId) return Promise.resolve([]);

        const initialFilters = [
            {
                field: 'status',
                operator: '==',
                value: 'ACTIVE'
            },
            {
                field: 'restaurantId',
                operator: '==',
                value: restaurantId
            }
        ];

        if (filter?.range) {
            initialFilters.push({
                field: 'datetime',
                operator: '=>',
                value: filter.range?.start
            });
            initialFilters.push({
                field: 'datetime',
                operator: '<=',
                value: filter.range?.end
            });
        }

        if (filter?.date) {
            initialFilters.push({
                field: 'date',
                operator: '==',
                value: filter?.date
            });
        }

        const docs: any = await this.findByCriteriaRequest(COLLECTION_NAME, initialFilters, pagination, {
            field: 'date',
            order: 'desc'
        }, true);

        return ReservationMapper.toDomainFromArray(docs);
    }

    async updateReservation(reservation: Reservation): Promise<any> {
        const data = ReservationMapper.toPersistence(reservation);
        return this.updateById(COLLECTION_NAME, reservation.id, data, true);
    }


    async deleteReservation(id: string): Promise<any> {
        return this.deleteById(COLLECTION_NAME, id, true);
    }

    async getReservation(id: string): Promise<Reservation | undefined> {

        try {
            const doc: any = await this.get(`${COLLECTION_NAME}/${id}`, true);

            if (!doc) return undefined;

            return ReservationMapper.toDomain(doc);
        } catch {
            return undefined
        }
    }

    async createReservation(item: Reservation): Promise<any> {
        const data = ReservationMapper.toPersistence(item);
        return this.create(COLLECTION_NAME, data, true);
    }

    async getAvailability(id: string, date: string): Promise<RestaurantAvailability> {
        const doc: any = await this.get(`${COLLECTION_NAME}/availability/${id}/${date}`, true);

        if (!doc) return {
            tables: []
        };

        return {
            tables: doc
        };
    }

    cancelReservation(id: string): Promise<any> {
        return this.patch(`${COLLECTION_NAME}/${id}/cancel`, {}, true);
    }
}