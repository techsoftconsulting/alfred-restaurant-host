import useGetIdentity from '@modules/auth/application/use-get-identity';


export const permissionsConstantsDescriptions = [
    {
        id: 'ADMIN', name: 'Administrador',
        menu: ['TABLES', 'RESERVATIONS', 'SETTINGS', 'CLIENTS', 'USERS', 'MENU', 'PROMOTIONS']
    },
    {
        id: 'ADM.RESERV',
        name: 'Adm.Reservaciones',
        menu: ['RESERVATIONS', 'ACCOUNT']
    },
    {
        id: 'ADM.PROMO',
        name: 'Adm.Promociones',
        menu: ['PROMOTIONS', 'ACCOUNT']
    },
    {
        id: 'HOST',
        name: 'Host',
        menu: ['RESERVATIONS', 'ACCOUNT']
    }
];


export const useCheckPermission = () => {
    const { identity, loading: loadingIdentity } = useGetIdentity();

    return {
        ready: !loadingIdentity,
        check: (constant: string) => {
            return true;
        }
    };
};

