import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import config from './../config';
import { gql, useMutation } from '@apollo/client';



export const loginMutationGQL  = gql`
  mutation($loginInput: LoginInput){
  login (loginInput: $loginInput ){
    user {
      email
      id
      name
      role
    }
    tokens {
      access {
        expires
        token
      }
      refresh {
        expires
        token
      }
    }
  }
}
`;
export const LoginMutation = () => {
}

export const useLogin = () => {
    const [loginError, setLoginError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();
    const [mutateLogin /*, { data, loading, error } */ ] = useMutation(loginMutationGQL);

    const login = async (email, password) => {
        setIsLoading(true);
        setLoginError(null);

        // const response = await fetch(config.apiBasePath + '/auth/login', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email, password })
        // });
        const response = await mutateLogin({ 
            variables: {
                "loginInput": {
                  "email": email,
                  "password": password,  
                }
              }
         });
         console.log('response.data.login');
         console.log(response.data.login);
        
        // const json = response ; // await response.json();

        if (response.errors && response.errors.message) {
            setIsLoading(false);
            // console.log(json);
            setLoginError(response.errors[0].message);
            // update the auth context
            dispatch({ type: 'LOGIN_ERROR', payload: response });
        }
        if (response?.data?.login) {
            // save the user to local storage
            localStorage.setItem('user', JSON.stringify(response.data.login));

            // update the auth context
            dispatch({ type: 'LOGIN', payload: response.data.login });

            // update loading state
            setIsLoading(false);
        }
    };

    return { login, isLoading, loginError };
};
