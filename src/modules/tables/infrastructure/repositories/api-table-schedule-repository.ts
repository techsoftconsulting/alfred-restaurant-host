import PaginationOptions from '@shared/domain/models/pagination-options';
import SortOptions from '@shared/domain/models/sort-options';
import { getLoggedInUserSession } from '@modules/auth/infrastructure/providers/app-auth-provider';
import TableScheduleRepository from '@modules/tables/domain/repositories/table-schedule-repository';
import TableSchedule from '@modules/tables/domain/models/table-schedule';
import TableScheduleMapper from '@modules/tables/infrastructure/mappers/table-schedule-mapper';
import APIRepository from '@shared/infrastructure/api/api-repository';

const COLLECTION_NAME = 'table-schedule';

export default class ApiTableScheduleRepository extends APIRepository implements TableScheduleRepository {

    async findSchedules(filter?: any, pagination?: PaginationOptions, sort?: SortOptions): Promise<TableSchedule[]> {
        const restaurantId = (await getLoggedInUserSession())?.restaurantId;
        if (!restaurantId) return Promise.resolve([]);

        const docs: any = await this.findByCriteriaRequest(COLLECTION_NAME, [{
            field: 'restaurantId',
            operator: '==',
            value: restaurantId
        }], pagination, undefined, true);

        if (docs.length == 0) {
            return [];
        }

        return TableScheduleMapper.toDomainFromArray(docs);
    }

}