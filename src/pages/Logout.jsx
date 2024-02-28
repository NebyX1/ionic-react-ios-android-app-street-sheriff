import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButton,
  IonAlert,
  IonButtons,
  IonBackButton,
  IonToast,
} from "@ionic/react";

import Logo from "../assets/Logo.png";

// Importamos useHistory
import { useHistory } from "react-router-dom";

// Importamos el icono de Logout
import { RiLogoutCircleLine } from "react-icons/ri";

// Importamos FirebaseAuthentication desde @capacitor-firebase/authentication
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

// Importamos el hook de useAuthStore
import useAuthStore from "../context/useAuthStore";

// Importamos el módulo de estilos
import style from "../theme/modules/loginlogout.module.css";
import { Container, Row } from "react-bootstrap";

const Logout = () => {
  const history = useHistory();
  const { logout } = useAuthStore();
  const [showAlert, setShowAlert] = React.useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleLogout = async () => {
    try {
      await FirebaseAuthentication.signOut();
      logout();
      history.push("/home");
    } catch (error) {
      console.error("Logout failed", error);
      setToastMessage('No hemos podido cerrar sesión');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="Volver" />
          </IonButtons>
          <IonTitle>Cerrar Sesión</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className={style.buttonContainer}>
        <Container className="p-5">
          <Row>
            <img src={Logo} alt="" />
          </Row>
          <Row className="mt-4">
            <IonButton
              shape="round"
              onClick={() => setShowAlert(true)}
              expand="block"
              className={style.buttonPadding}
            >
              <RiLogoutCircleLine className="me-2" />
              Logout
            </IonButton>
            <IonToast
              isOpen={showToast}
              onDidDismiss={() => setShowToast(false)}
              message={toastMessage}
              duration={2000}
            />
            <IonAlert
              isOpen={showAlert}
              onDidDismiss={() => setShowAlert(false)}
              header={"Confirmar"}
              message={"¿Estás seguro de que quieres cerrar sesión?"}
              buttons={[
                {
                  text: "Cancelar",
                  role: "cancel",
                  cssClass: "secondary",
                  handler: (blah) => {
                    setShowAlert(false);
                  },
                },
                {
                  text: "Cerrar Sesión",
                  handler: () => {
                    handleLogout();
                  },
                },
              ]}
            />
          </Row>
        </Container>
      </IonContent>
    </IonPage>
  );
};

export default Logout;
