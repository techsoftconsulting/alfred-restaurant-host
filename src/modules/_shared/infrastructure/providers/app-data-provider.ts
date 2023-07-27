import ApiRestaurantRepository from '@modules/user/infrastructure/repositories/api-restaurant-repository';
import ApiRestaurantAreaRepository from '@modules/tables/infrastructure/repositories/api-restaurant-area-repository';
import ApiTableScheduleRepository from '@modules/tables/infrastructure/repositories/api-table-schedule-repository';
import ApiClientRepository from '@modules/clients/infrastructure/respositories/api-client-repository';
import ApiRestaurantMallRepository from '@modules/user/infrastructure/repositories/api-restaurant-mall-repository';
import ApiAccountsRepository from '@modules/user/infrastructure/repositories/api-accounts-repository';
import ApiReservationRepository from '@modules/reservations/infrastructure/repositories/api-reservation-repository';
import ApiAuthUserRepository from '@modules/auth/infrastructure/repositories/api-auth-user-repository';

const AppDataProvider = (userTokenId?: string) => {

    const defaultProps = {
        tokenId: userTokenId
    };

    return {
        AuthUserRepository: new ApiAuthUserRepository(),
        ClientRepository: new ApiClientRepository(defaultProps),
        RestaurantAreaRepository: new ApiRestaurantAreaRepository(defaultProps),
        RestaurantRepository: new ApiRestaurantRepository(defaultProps),
        AccountsRepository: new ApiAccountsRepository(defaultProps),
        TableScheduleRepository: new ApiTableScheduleRepository(defaultProps),
        RestaurantMallRepository: new ApiRestaurantMallRepository(defaultProps),
        ReservationRepository: new ApiReservationRepository(defaultProps)
    };
};

export default AppDataProvider;
