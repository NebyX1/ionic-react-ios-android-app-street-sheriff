import React, { useEffect, useRef, useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonToast,
  IonLoading,
  IonButtons,
  IonBackButton,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";

// Importamos la base de datos y el almacenamiento de Firebase
import { storage } from "../firebase/firebaseConfig";

// Importamos el módulo de Firestore para Capacitor
import { FirebaseFirestore } from "@capacitor-firebase/firestore";

// Importamos los elementos necesarios para subir la imagen y obtener su URL del storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Importamos el hook useAuthStore para obtener el UID del usuario autenticado
import useAuthStore from "../context/useAuthStore";

// Importamos el ícono de la cámara
import { camera } from "ionicons/icons";

// Importamos Leaflet CSS
import "leaflet/dist/leaflet.css";

// Importamos el módulo CSS
import style from "../theme/modules/writecomplaint.module.css";

//Importamos las funciones helpers
import { handleImageChange } from "../helpers/handleImageChange";
import { entrySchema } from "../helpers/validationSchemas";
import initializeMap from "../helpers/initializeMap";

// Importamos el componente de la librería de Bootstrap
import { Container, Row } from "react-bootstrap";

const WriteComplaint = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const infoUID = useAuthStore((state) => state.userUid);
  const history = useHistory();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  // Referencia a la instancia de Leaflet
  const mapRef = useRef(null);
  const [selectedPosition, setSelectedPosition] = useState({ lat: 0, lng: 0 });
  // Crea el mapa y lo asigna a la referencia
  useEffect(() => {
    initializeMap(mapRef, setSelectedPosition);
  }, []);

  // Use Formik para manejar el formulario
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      type: "",
    },
    validationSchema: entrySchema,
    onSubmit: async (values, { resetForm }) => {
      if (!image) {
        setToastMessage("Por favor, seleccione una imagen para el reclamo.");
        setShowToast(true);
        setShowLoading(false);
        return;
      }
      setShowLoading(true);
      try {
        let imageUrl = "";
        if (image) {
          const imageRef = ref(storage, `pictures/${image.fileName}`);
          const snapshot = await uploadBytes(imageRef, image.blob);
          imageUrl = await getDownloadURL(snapshot.ref);
        }
        // Crea el objeto de la denuncia con la información del formulario y la imagen
        const newComplaint = {
          title: values.title,
          description: values.description,
          type: values.type,
          status: "Procesando",
          dateAdded: new Date().toISOString(), // Usamos ISO String para la fecha
          userID: infoUID,
          location: {
            // Usamos un objeto simple para la ubicación
            lat: selectedPosition.lat,
            lng: selectedPosition.lng,
          },
          imageUrl,
        };
        // Añade una nueva denuncia a la colección "denuncias" usando el plugin de Firestore para Capacitor
        const { reference } = await FirebaseFirestore.addDocument({
          reference: "denuncias",
          data: newComplaint,
        });
        resetForm();
        setToastMessage("Denuncia agregada con éxito.");
        setShowToast(true);
        setTimeout(() => {
          history.push("/home");
        }, 2000);
      } catch (error) {
        setToastMessage(error.message);
        setShowToast(true);
      } finally {
        setShowLoading(false);
      }
    },
  });

  const onImageChange = async () => {
    await handleImageChange(setImagePreview, setImage);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="Volver" />
          </IonButtons>
          <IonTitle>Denunciar Problema</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <form onSubmit={formik.handleSubmit}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Título del Problema</IonLabel>
              <IonInput
                aria-label="Title"
                name="title"
                type="text"
                onIonChange={formik.handleChange}
                value={formik.values.title}
                onBlur={formik.handleBlur}
              />
              {formik.touched.title && formik.errors.title && (
                <Container fluid className={style.errorMessage}>{formik.errors.title}</Container>
              )}
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Descripción del Problema</IonLabel>
              <IonInput
                aria-label="Description"
                name="description"
                type="text"
                onIonChange={formik.handleChange}
                value={formik.values.description}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && (
                <Container fluid className={style.errorMessage}>
                  {formik.errors.description}
                </Container>
              )}
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">
                Tipo de Problema Denunciado
              </IonLabel>
              <IonSelect
                aria-label="tipo de problema denunciado"
                name="type"
                value={formik.values.type}
                onIonChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <IonSelectOption value="Rotura de calle/vereda">
                  Rotura de calle/vereda
                </IonSelectOption>
                <IonSelectOption value="Iluminacion">
                  Iluminacion
                </IonSelectOption>
                <IonSelectOption value="Acumulación de basura">
                  Basura
                </IonSelectOption>
                <IonSelectOption value="Otros">Otros</IonSelectOption>
              </IonSelect>
              {formik.touched.type && formik.errors.type && (
                <Container fluid className={style.errorMessage}>{formik.errors.type}</Container>
              )}
            </IonItem>
          </IonList>
          <IonItem className="ion-margin-bottom">
            <IonLabel className="ion-padding-bottom" position="stacked">
              Imagen del Problema
            </IonLabel>
            <IonButton onClick={onImageChange}>
              Seleccionar Imagen
              <IonIcon icon={camera} slot="start" />
            </IonButton>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Vista previa de la imagen"
                style={{ width: "200px", height: "auto" }}
              />
            )}
          </IonItem>
          <IonItem>
            <Container fluid className="p-0 mb-2">
            <IonLabel
              className={`ion-padding-bottom ${style.colorizeLabel}`}
              position="stacked"
            >
              Arrastre el marcador hasta donde esté el problema
            </IonLabel>
            </Container>
            <Container fluid className={`p-0 ${style.imgSize}`} ref={mapRef} style={{ height: "250px", width: "100%" }}></Container>
          </IonItem>
          <IonButton
            type="submit"
            shape="round"
            size="default"
            className="ion-margin-vertical ion-padding"
            expand="block"
          >
            Publicar Reclamo
          </IonButton>
        </form>
        <IonLoading isOpen={showLoading} message={"Por favor espere..."} />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default WriteComplaint;
