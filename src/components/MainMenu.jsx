import {
  IonContent,
  IonHeader,
  IonMenu,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";

// Importamos el icono de logout
import { IonIcon } from "@ionic/react";
import { logOutOutline } from "ionicons/icons";

// Importamos el módulo de App de Capacitor
import { App } from "@capacitor/app";

// Importamos el contexto de autenticación
import useAuthStore from "../context/useAuthStore";

const MainMenu = () => {
  const { currentUser } = useAuthStore(); // Obtenemos el estado del usuario actual

  const handleCloseApp = () => {
    App.exitApp();
  };

  return (
    <IonMenu contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menú</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {currentUser ? (
            // Si el usuario está autenticado, mostramos estas opciones
            <>
              <IonItem routerLink="/logout">
                <IonLabel>Salir de la Sesión</IonLabel>
              </IonItem>
              {/* <IonItem routerLink="/settings">
                <IonLabel>Configuración</IonLabel>
              </IonItem> */}
              <IonItem routerLink="/solved">
                <IonLabel>Denuncias Archivadas Resueltas</IonLabel>
              </IonItem>
              <IonItem routerLink="/not-solved">
                <IonLabel>Denuncias Archivadas No Resueltas</IonLabel>
              </IonItem>
            </>
          ) : (
            // Si el usuario no está autenticado, mostramos solo la opción de Login
            <IonItem routerLink="/login">
              <IonLabel>Iniciar Sesión</IonLabel>
            </IonItem>
          )}
          <IonItem routerLink="/about">
            <IonLabel>Sobre Nosotros</IonLabel>
          </IonItem>
          <IonItem routerLink="/legal">
            <IonLabel>Aviso Legal</IonLabel>
          </IonItem>
          <IonItem onClick={handleCloseApp} color="danger">
            <IonIcon slot="start" icon={logOutOutline} />
            <IonLabel>Cerrar Aplicación</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default MainMenu;
