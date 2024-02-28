// Importamos el Router de Ionic para conseguir los efectos de transición entre páginas nativos
import { IonReactRouter } from "@ionic/react-router";

// Importamos desde react-router-dom los componentes que nos permitirán definir las rutas de nuestra app
// y establecer un sistema de control de rutas por medio de Switch y Redirect
import { Redirect, Route, Switch } from "react-router-dom";

// Importamos los elementos de Ionic para estilizar la barras de navegación
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";

// Importamos los iconos que usaremos en nuestra barra de navegación
import { home as homeIcon, settings as settingsIcon } from "ionicons/icons";

// Importamos los protectores de rutas
import ProtectedRoutes from "./ProtectedRoutes";
import NonLoginRoutes from "./NonLoginRoutes";

// Importamos los componentes que usaremos para las rutas de nuestra app
import Home from "../pages/Home";
import Login from "../pages/Login";
import WriteComplaint from "../pages/WriteComplaint";
import Logout from "../pages/Logout";
import About from "../pages/About";
import Legal from "../pages/Legal";
import NotSolved from "../pages/NotSolved";
import Solved from "../pages/Solved";

const Router = () => {
  return (
    <>
      <IonReactRouter>
        <IonRouterOutlet>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/about" component={About} />
            <Route exact path="/legal" component={Legal} />

            {/* Rutas protegidas a las que solo se accede si usuario está autenticado */}
            {/* <ProtectedRoutes exact path="/settings">
              <Settings />
            </ProtectedRoutes> */}

            <ProtectedRoutes exact path="/write-complaint">
              <WriteComplaint />
            </ProtectedRoutes>

            <ProtectedRoutes exact path="/logout">
              <Logout />
            </ProtectedRoutes>

            <ProtectedRoutes exact path="/solved">
              <Solved />
            </ProtectedRoutes>

            <ProtectedRoutes exact path="/not-solved">
              <NotSolved />
            </ProtectedRoutes>

            {/* Rutas protegidas a las que solo se accede si usuario no está autenticado */}
            <NonLoginRoutes exact path="/login">
              <Login />
            </NonLoginRoutes>

            {/* Redirección de rutas no encontradas y protección de "/home" */}
            <Route path="*">
              <Redirect to="/home" />
            </Route>
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </>
  );
};

export default Router;
