import React from "react";
import { Container } from "react-bootstrap"; // Importamos Container de React Bootstrap
import style from "../theme/modules/homeheader.module.css";

// Importamos el logo
import logo from "../assets/LogoName.png";
import { IonButtons, IonHeader, IonMenuButton, IonToolbar } from "@ionic/react";

const HomeHeader = () => {
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="end">
          <IonMenuButton></IonMenuButton> {/* Botón para abrir el menú */}
        </IonButtons>
        <Container fluid>
          <div className={style.logoContainer}>
            <img src={logo} alt="Logo" className={style.logoImage} />
          </div>
        </Container>
      </IonToolbar>
    </IonHeader>
  );
};

export default HomeHeader;
