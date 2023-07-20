import PaginationOptions from '@shared/domain/models/pagination-options';
import SortOptions from '@shared/domain/models/sort-options';
import TableSchedule from '@modules/tables/domain/models/table-schedule';

export default interface TableScheduleRepository {
    findSchedules(
        filter?: any,
        pagination?: PaginationOptions,
        sort?: SortOptions
    ): Promise<TableSchedule[]>;

}