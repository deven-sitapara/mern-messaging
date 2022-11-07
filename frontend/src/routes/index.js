import { Navigate, useLocation, useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import { useAuthContext } from '../hooks/useAuthContext';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    const { user } = useAuthContext();
    const location = useLocation();
    const current_location = location.pathname.slice(1);// remove first /slash from /chat url
    
    let routes = [];
    if (user) {
        routes.push(MainRoutes);
    } else {
        routes.push(AuthenticationRoutes);
    }
    // console.log(current_location);
    // console.log(routes);

    // if(location.pathname){
    //     const found_routes = routes.filter(route => {
    //         return route.path === current_location ;
    //     });
    //     console.log('found_routes');
    //     console.log(found_routes);
    //     console.log(found_routes.length);
    //     if(found_routes === 0){
    //         return <Navigate to="/" />
    //     }
    // }

    // return useRoutes([MainRoutes, AuthenticationRoutes]);
    return useRoutes(routes);
}
