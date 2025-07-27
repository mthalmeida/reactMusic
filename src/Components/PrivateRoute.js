import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// Componente de rota protegida
function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.name) {
          return <Redirect to="/" />;
        }
        return <Component {...props} />;
      }}
    />
  );
}

export default PrivateRoute; 