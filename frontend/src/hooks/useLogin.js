import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import config from './../config';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(config.apiBasePath + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            // console.log(json);
            setError(json.error);
            // update the auth context
            dispatch({ type: 'LOGIN_ERROR', payload: json });
        }
        if (response.ok) {
            // save the user to local storage
            localStorage.setItem('user', JSON.stringify(json));

            // update the auth context
            dispatch({ type: 'LOGIN', payload: json });

            // update loading state
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};
