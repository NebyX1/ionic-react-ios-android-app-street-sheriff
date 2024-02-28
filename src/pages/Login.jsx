import React, { useState } from "react";
import {
  IonPage,
  IonBackButton,
  IonButtons,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButton,
  IonToast,
} from "@ionic/react";

import Logo from "../assets/Logo.png";

// Importamos useHistory
import { useHistory } from "react-router-dom";

// Importamos el icono de Google
import { ImGoogle } from "react-icons/im";

// Importamos FirebaseAuthentication desde @capacitor-firebase/authentication
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

// Importamos el hook de useAuthStore
import useAuthStore from "../context/useAuthStore";

// Importamos el módulo de estilos
import style from "../theme/modules/loginlogout.module.css";
import { Container, Row } from "react-bootstrap";

// Importamos Preferences de Capacitor para el almacenamiento local
import { Preferences } from "@capacitor/preferences";

const Login = () => {
  const history = useHistory();
  const { setUserUid } = useAuthStore();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleLogin = async () => {
    try {
      // Usamos FirebaseAuthentication para iniciar sesión con Google
      const result = await FirebaseAuthentication.signInWithGoogle();
      if (result.user) {
        // Guardamos el UID del usuario en Preferences para persistencia
        await Preferences.set({
          key: "userUid",
          value: result.user.uid,
        });
        // Actualizamos el estado de autenticación con el UID
        setUserUid(result.user.uid);
        setToastMessage("El inicio de sesión ha sido exitoso");
        setShowToast(true);
        setTimeout(() => {
          history.push("/home");
        }, 2000);
      }
    } catch (error) {
      console.error("Login failed", error);
      setToastMessage("No hemos podido iniciar sesión");
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Volver</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className={style.buttonContainer}>
        <Container className="p-5">
          <Row>
            <img src={Logo} alt="Logo" className={style.logo} />
          </Row>
          <Row Row className="mt-4">
            <IonButton
              shape="round"
              onClick={handleLogin}
              expand="block"
              className={style.buttonPadding}
            >
              <ImGoogle className="me-2" /> Login con Google
            </IonButton>
            <IonToast
              isOpen={showToast}
              onDidDismiss={() => setShowToast(false)}
              message={toastMessage}
              duration={2000}
            />
          </Row>
        </Container>
      </IonContent>
    </IonPage>
  );
};

export default Login;
