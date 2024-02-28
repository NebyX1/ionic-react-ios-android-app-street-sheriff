import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import useAuthStore from '../context/useAuthStore';
import { IonLoading } from '@ionic/react';

const NonLoginRoutes = ({ children, ...rest }) => {
  const { currentUser, isLoading } = useAuthStore(); // Usamos currentUser e isLoading

  if (isLoading) {
     // Muestra el componente IonLoading mientras se verifica el estado de autenticación
     return <IonLoading isOpen={true} message={"Please wait..."} />;
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
      !currentUser ? ( // Verificamos si no hay un currentUser
          children
        ) : (
          <Redirect
            to={{
              pathname: "/home",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

export default NonLoginRoutes;