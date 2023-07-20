import AccountUser from '@modules/user/domain/models/account-user';
import AccountsRepository from '@modules/user/domain/repositories/accounts-repository';
import AccountMapper from '../mappers/account-mapper';
import APIRepository from '@shared/infrastructure/api/api-repository';

const COLLECTION_NAME = 'profile';

export default class ApiAccountsRepository extends APIRepository implements AccountsRepository {

    async find(id: string): Promise<AccountUser | null> {
        const doc: any = await this.get(`${COLLECTION_NAME}`, true);

        if (!doc) return null;

        return AccountMapper.toDomain(doc);
    }

    async findByEmail(email: string): Promise<AccountUser | null> {
        const docs: any = await this.findByCriteriaRequest(COLLECTION_NAME, [
            {
                field: 'status',
                operator: '==',
                value: 'ACTIVE'
            },
            {
                field: 'email',
                operator: '==',
                value: email
            }
        ], undefined, undefined, true);

        if (docs.length == 0) return null;

        return AccountMapper.toDomain(docs[0]);
    }

    async save(user: AccountUser): Promise<void> {
        const dto = AccountMapper.toPersistence(user);

        const foundUser = await this.find(user.id);
        if (!foundUser) {
            throw new Error('NOT_LOGGED');
        }

        try {
            return this.patch(COLLECTION_NAME, {
                ...dto,
                email: foundUser.email
                // credentials: user.credentials,
                // restaurantId: restaurantId
            }, true);
        } catch (e) {
            throw  new Error(e);
        }

    }
}