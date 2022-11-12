import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import config from './../config';
import { gql, useMutation } from '@apollo/client';

export const registrationMutationGQL  = gql`
mutation($registerInput: RegisterInput){
    register(registerInput: $registerInput){
      user {
        email
        id
        name
        name
      }
      tokens {
        access {
          expires
          token
        }
      }
    }
  }`;


export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();
    const [mutateRegistration] = useMutation(registrationMutationGQL);

    const signup = async (email, password) => {
        setIsLoading(true);
        setError(null);

        // const response = await fetch(config.apiBasePath + '/auth/register', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ name: 'fake name', email, password })
        // });
        // const json = await response.json();
        // console.log('json');
        // console.log(json);

        const response = await mutateRegistration({
            variables:{
                "registerInput": {
                    "name": "Fake User", 
                    "password": password,
                    "email": email
                    }
                },
          });
         console.log('response.data.register');
         console.log(response.data.register);
        

         if (response.errors && response.errors.message) {
            setIsLoading(false);
            setError(response.errors[0].message);
            // update the auth context
            dispatch({ type: 'REGISTER_ERROR', payload: response });
        }
        if (response?.data?.register) {
            // save the user to local storage
            localStorage.setItem('user', JSON.stringify(response.data.register));

            // update the auth context
            dispatch({ type: 'LOGIN', payload: response.data.register });

            // update loading state
            setIsLoading(false);
        }
    };

    return { signup, isLoading, error };
};
