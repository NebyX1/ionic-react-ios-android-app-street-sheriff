import React from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonText,
} from "@ionic/react";

const Legal = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="Volver" />
          </IonButtons>
          <IonTitle>Condiciones de Uso</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText>
          <h2>Privacidad y Condiciones de Uso</h2>
          <p>
            En <strong>StreetSheriff</strong>, valoramos la confianza que
            depositas en nosotros al utilizar nuestra aplicación para reportar
            problemas municipales. Queremos que sepas que la privacidad de tus
            datos es una prioridad absoluta.
          </p>
          <p>
            Para acceder y utilizar StreetSheriff, se requiere una cuenta de
            Google. Sin embargo, es importante aclarar que{" "}
            <strong>no almacenamos ningún dato personal</strong> en nuestra
            aplicación o bases de datos. Los datos de tu cuenta de Google no son
            recopilados, usados, o vendidos a terceros por nuestro equipo.
          </p>
          <p>
            Una vez que realices una denuncia a través de StreetSheriff,{" "}
            <strong>esta no podrá ser borrada o modificada</strong>. Esta medida
            asegura la integridad y consistencia en la gestión de los problemas
            reportados al gobierno local, evitando incongruencias o
            inconsistencias.
          </p>
          <p>
            Es crucial entender que el uso de StreetSheriff para realizar
            denuncias <strong>no implica una obligación</strong> por parte del
            gobierno local o del equipo de StreetSheriff para que los problemas
            sean resueltos efectivamente. Nuestra herramienta está diseñada para
            notificar al gobierno local, no para establecer una orden
            vinculante.
          </p>
          <p>
            No nos hacemos responsables por el mal uso de la aplicación ni por
            los daños que se puedan causar por su uso indebido o incorrecto.
            Creemos en la responsabilidad y el buen juicio de nuestros usuarios
            para contribuir positivamente a nuestra comunidad.
          </p>
          <p>
            <strong>Las condiciones de uso</strong> descritas aquí{" "}
            <strong>pueden cambiar</strong> sin previo aviso en cualquier
            momento. Te invitamos a revisarlas periódicamente para estar al
            tanto de cualquier actualización.
          </p>
          <p>
            Agradecemos tu compromiso con la mejora de nuestra comunidad y te
            agradecemos por ser parte de StreetSheriff.
          </p>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default Legal;
