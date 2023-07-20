import PaginationOptions from '@shared/domain/models/pagination-options';
import SortOptions from '@shared/domain/models/sort-options';
import RestaurantArea from '@modules/tables/domain/models/restaurant-area';

export default interface RestaurantAreaRepository {
    findAreas(
        filter?: any,
        pagination?: PaginationOptions,
        sort?: SortOptions
    ): Promise<RestaurantArea[]>;
}