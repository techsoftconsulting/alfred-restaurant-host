import { USER_ROLE } from '@modules/auth/domain/services/auth-provider';

interface AdminUserCredentials {
    oldPassword?: string;
    email: string;
    password: string;
}

interface AdminUserProps {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    credentials?: AdminUserCredentials;
    roles: USER_ROLE[];
    type: string;
    customPasswordConfigured: boolean;
}

interface AdminUserPrimitiveProps extends AdminUserProps {

}

export default class AccountUser {
    constructor(private props: AdminUserProps) {

    }

    get fullName() {
        return `${this.props.firstName} ${this.props.lastName}`;
    }

    get id() {
        return this.props.id;
    }

    get roleName() {
        return '';
    }

    get email() {
        return this.props.email;
    }

    get customPasswordConfigured() {
        return this.props.customPasswordConfigured;
    }

    get credentials() {
        return this.props.credentials;
    }

    get hasCredentials() {
        return !!this.props.credentials && (!!this.props.credentials.email || !!this.props.credentials.password);
    }

    static fromPrimitives(props: AdminUserPrimitiveProps) {
        return new AccountUser({
            ...props,
            email: props.email.toLowerCase(),
            credentials: props.credentials ? {
                ...props.credentials,
                email: props.credentials.email.toLowerCase()
            } : undefined
        });
    }

    updateData(data: Partial<AdminUserProps>) {
        this.props.firstName = data.firstName ? data.firstName : this.props.firstName;
        this.props.lastName = data.lastName ? data.lastName : this.props.lastName;
    }

    setCustomPasswordConfigured() {
        this.props.customPasswordConfigured = true;
    }

    updateCredentials(credentials: AdminUserCredentials) {
        this.props.credentials = credentials;
    }

    toPrimitives(): AdminUserPrimitiveProps {
        return {
            ...this.props
        };
    }

}