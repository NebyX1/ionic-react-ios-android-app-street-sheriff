import React from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
} from "@ionic/react";

import style from "../theme/modules/tables.module.css"; // Usamos el mismo módulo de estilo

const IssueModal = ({ showModal, setShowModal, selectedProblema }) => {
  return (
    <IonModal isOpen={showModal} cssClass="my-custom-class" onDidDismiss={() => setShowModal(false)}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Detalles del Problema</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowModal(false)}>Cerrar</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {selectedProblema && (
          <IonCard className={style.problemCard}>
            <IonCardHeader>
              <IonCardSubtitle><b>Título:</b> {selectedProblema.title}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <p><b>Descripción:</b> {selectedProblema.description}</p>
              <p><b>Fecha:</b> {new Date(selectedProblema.dateAdded).toLocaleDateString('es')}</p>
              <p><b>Estado:</b> {selectedProblema.status}</p>
              <p><b>Tipo:</b> {selectedProblema.type}</p>
              <p><b>Observaciones:</b> {selectedProblema.observations ? selectedProblema.observations : "Aún no disponible"}</p>
              {selectedProblema.imageUrl && (
                <img src={selectedProblema.imageUrl} alt="Imagen del problema" className={style.imgSize} />
              )}
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonModal>
  );
};

export default IssueModal;


