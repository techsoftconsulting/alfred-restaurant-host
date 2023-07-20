import RestaurantRepository from '@modules/user/domain/repositories/restaurant-repository';
import APIRepository from '@shared/infrastructure/api/api-repository';
import Restaurant from '@modules/user/domain/models/restaurant';
import RestaurantMapper from '@modules/user/infrastructure/mappers/restaurant-mapper';
import RestaurantCategory from '@modules/user/domain/models/restaurant-category';

const COLLECTION_NAME = 'restaurant';

export default class ApiRestaurantRepository extends APIRepository implements RestaurantRepository {
    async getProfileBySlug(slug: string): Promise<Restaurant | undefined> {
        const doc: any = await this.get(`${COLLECTION_NAME}/slug/${slug}`, true);
        if (!doc) return undefined;
        return RestaurantMapper.toDomain(doc);
    }

    async getProfileById(id: string): Promise<Restaurant | undefined> {
        const doc: any = await this.get(`${COLLECTION_NAME}/${id}`, true);

        if (!doc) return undefined;

        return RestaurantMapper.toDomain(doc);
    }

    async findCategories(): Promise<RestaurantCategory[]> {
        const docs: any = await this.findByCriteriaRequest('profile/categories', [
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

}