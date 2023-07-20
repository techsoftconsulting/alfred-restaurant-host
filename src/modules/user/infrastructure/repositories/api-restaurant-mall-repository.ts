import RestaurantMall from '@modules/user/domain/models/restaurant-mall';
import RestaurantMallRepository from '@modules/user/domain/repositories/restaurant-mall-repository';
import APIRepository from '@shared/infrastructure/api/api-repository';

const COLLECTION_NAME = 'mall';

export default class ApiRestaurantMallRepository extends APIRepository implements RestaurantMallRepository {

    async findAll(): Promise<RestaurantMall[]> {
        const docs: any = await this.findByCriteriaRequest(COLLECTION_NAME, [
            {
                field: 'status',
                operator: '==',
                value: 'ACTIVE'
            }
        ], undefined, undefined, true);

        return docs.map(doc => {
            return {
                slug: doc.slug,
                id: doc.id,
                name: doc.name,
                status: doc.status
            };
        });
    }


    async find(id: string): Promise<RestaurantMall | null> {
        const doc: any = await this.get(`${COLLECTION_NAME}/${id}`, true);

        if (!doc) return null;

        return {
            id: doc.id,
            name: doc.name,
            status: doc.status
        };
    }
}