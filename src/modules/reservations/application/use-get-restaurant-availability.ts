import useService from '@shared/domain/hooks/use-service';
import UseQueryValue from '@shared/domain/models/use-query-value';
import QueryCreator from '@shared/domain/services/query-creator';
import useRepository from '@shared/domain/hooks/use-repository';
import QueryOptions from '@shared/domain/models/query-options';
import RestaurantAvailability from '@modules/reservations/domain/models/restaurant-availability';
import ReservationRepository from '@modules/reservations/domain/respositories/reservation-repository';


type ResponseQueryValue = Omit<UseQueryValue, 'data'> & {
    data?: RestaurantAvailability;
};

export default function useGetRestaurantAvailability(id: string, date: string, options?: QueryOptions): ResponseQueryValue {
    const repo = useRepository<ReservationRepository>(
        'ReservationRepository'
    );
    const queryCreator = useService<QueryCreator>('QueryCreator');

    const queryState: ResponseQueryValue = queryCreator.execute(
        {
            id: 'restaurant-availability',
            payload: {
                id: id,
                date: date
            },
            type: ''
        },
        () => repo.getAvailability(id, date),
        {
            ...options ?? {}
        }
    );

    return queryState;
}
