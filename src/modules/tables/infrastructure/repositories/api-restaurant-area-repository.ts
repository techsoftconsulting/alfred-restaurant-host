import RestaurantAreaRepository from '@modules/tables/domain/repositories/restaurant-area-repository';
import PaginationOptions from '@shared/domain/models/pagination-options';
import RestaurantArea from '@modules/tables/domain/models/restaurant-area';
import SortOptions from '@shared/domain/models/sort-options';
import AreaMapper from '@modules/tables/infrastructure/mappers/area-mapper';
import { getLoggedInUserSession } from '@modules/auth/infrastructure/providers/app-auth-provider';
import APIRepository from '@shared/infrastructure/api/api-repository';

const COLLECTION_NAME = 'restaurant';

export default class ApiRestaurantAreaRepository extends APIRepository implements RestaurantAreaRepository {

    async findAreas(filter?: any, pagination?: PaginationOptions, sort?: SortOptions): Promise<RestaurantArea[]> {
        const restaurantId = (await getLoggedInUserSession())?.restaurantId;
        if (!restaurantId) return Promise.resolve([]);


        const doc: any = await this.get(`${COLLECTION_NAME}/${restaurantId}`, true);

        if (!doc) return [];

        return AreaMapper.toDomainFromArray(doc.areas);
    }

}