import ClientRepository from '@modules/clients/domain/repositories/client-repository';
import Client from '@modules/clients/domain/models/client';
import PaginationOptions from '@modules/_shared/domain/models/pagination-options';
import SortOptions from '@shared/domain/models/sort-options';
import { getLoggedInUserSession } from '@modules/auth/infrastructure/providers/app-auth-provider';
import ClientMapper from '@modules/clients/infrastructure/mappers/client-mapper';
import APIRepository from '@shared/infrastructure/api/api-repository';

const COLLECTION_NAME = 'client';

export default class ApiClientRepository extends APIRepository implements ClientRepository {

    async findClients(
        filter?: any,
        pagination?: PaginationOptions,
        sort?: SortOptions
    ): Promise<Client[]> {
        const restaurantId = (await getLoggedInUserSession())?.restaurantId;
        if (!restaurantId) return Promise.resolve([]);

        const docs: any = await this.findByCriteriaRequest(COLLECTION_NAME, [
            {
                field: 'status',
                operator: '==',
                value: 'ACTIVE'
            },
            {
                field: 'restaurantId',
                operator: '==',
                value: restaurantId
            },
            ...(filter?.q ? [{
                field: 'email',
                operator: '==' as any,
                value: filter.q
            }] : [])], pagination, undefined, true);


        if (docs.length == 0) {
            return [];
        }

        return ClientMapper.toDomainFromArray(docs);
    }

    async updateClient(client: Client): Promise<any> {
        const data = ClientMapper.toPersistence(client);
        await this.updateById(COLLECTION_NAME, data.id, data, true);
    }

    async deleteClient(id: string): Promise<any> {
        await this.deleteById(COLLECTION_NAME, id, true);
    }

    async getClient(id: string): Promise<Client | undefined> {
        const doc: any = await this.get(`${COLLECTION_NAME}/${id}`, true);
        if (!doc) return undefined;
        return ClientMapper.toDomain(doc);
    }

    async createClient(item: Client): Promise<any> {
        const data = ClientMapper.toPersistence(item);

        await this.create(COLLECTION_NAME, data, true);
    }
}