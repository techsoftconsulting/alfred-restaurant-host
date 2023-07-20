import { useCheckPermission } from '@modules/auth/infrastructure/providers/permissions';
import { Box } from '@main-components/Base/Box';
import Forbidden from '@main-components/Base/Forbidden';

export default function ProtectedRoute({ children, route }) {
    const { ready, check } = useCheckPermission();

    if (!ready) return (
            <Box />
    );

    if (!check(route)) return (
            <Forbidden />
    );

    return children;
}