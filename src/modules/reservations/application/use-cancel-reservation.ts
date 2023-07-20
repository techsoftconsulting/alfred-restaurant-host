import useUpdate from '@shared/domain/hooks/resources/use-update';
import useNotify from '@shared/domain/hooks/use-notify';
import ReservationRepository from '@modules/reservations/domain/respositories/reservation-repository';

export default function useCancelReservation() {
    const notify = useNotify();

    return useUpdate<string, ReservationRepository>({
        resource: 'reservations',
        repository: 'ReservationRepository',
        fn: (repo, ...rest) => repo.cancelReservation(rest[0]),
        onSuccess: (response, queryClient, params) => {
        },
        onFailure: () => {

        }
    });
}
