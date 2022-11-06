import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import { useAuthContext } from '../hooks/useAuthContext';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    const { user } = useAuthContext();
    let routes = [];
    if (user) {
        routes.push(MainRoutes);
    } else {
        routes.push(AuthenticationRoutes);
    }
    // return useRoutes([MainRoutes, AuthenticationRoutes]);
    return useRoutes(routes);
}
