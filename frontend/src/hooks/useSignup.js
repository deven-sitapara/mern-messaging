import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import config from './../config';

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const signup = async (email, password) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(config.apiBasePath + '/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'fake name', email, password })
        });
        const json = await response.json();
        // console.log('json');
        // console.log(json);
        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
            // update the auth context
            dispatch({ type: 'REGISTER_ERROR', payload: json });
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

    return { signup, isLoading, error };
};
