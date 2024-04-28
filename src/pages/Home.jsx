import {
  IonContent,
  IonPage,
  IonFab,
  IonButton,
  IonIcon,
  IonToast,
} from "@ionic/react";

import React, { useEffect, useRef, useState } from "react";

// Importamos el icono de lista desde los iconos de Ionic
import { add as addIcon } from "ionicons/icons";

// Importamos leaftlet y su css
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Importamos el menú principal y el encabezado
import MainMenu from "../components/MainMenu";
import HomeHeader from "../components/HomeHeader";

// Importamos el componente de modal
import IssueModal from "../components/IssueModal";
import { db } from "../firebase/firebaseConfig.js";

// Importamos las funciones de Firestore
import { collection, getDocs } from "firebase/firestore";

// Importamos el hook de autenticación
import useAuthStore from "../context/useAuthStore";

function Home() {
  const mapRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProblema, setSelectedProblema] = useState(null);
  const [problemasUrbanos, setProblemasUrbanos] = useState([]);
  const { currentUser } = useAuthStore();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const loadProblemasUrbanos = async () => {
      const querySnapshot = await getDocs(collection(db, 'denuncias'));
      const problemasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })).filter(problema => // Aquí filtramos los datos
        problema.status === "Procesando" || 
        problema.status === "En Conocimiento" || 
        problema.status === "En Obra"
      );
      setProblemasUrbanos(problemasData);
  
      if (mapRef.current) {
        const map = L.map(mapRef.current, {
          zoomControl: false,
        }).setView([-34.37, -55.23], 13);
  
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '',
        }).addTo(map);
  
        map.attributionControl.setPrefix('');
  
        var customMarkerIcon = L.divIcon({
          className: 'custom-icon',
          html: '<i class="fas fa-map-marker-alt fa-3x" style="color: orange; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);"></i>',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });
  
        problemasData.forEach(problema => {
          L.marker([problema.location.lat, problema.location.lng], { icon: customMarkerIcon })
            .addTo(map)
            .bindPopup(`Tipo: ${problema.type}<br>Descripción: ${problema.description}`)
            .on('click', () => {
              setSelectedProblema(problema);
              setShowModal(true);
            });
        });
  
        setTimeout(() => map.invalidateSize(), 100);
      }
    };
  
    loadProblemasUrbanos();
  }, []);

  useEffect(() => {
    // Añadir escuchador de eventos para cambio de orientación
    const handleOrientationChange = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);

    // Limpiar el escuchador de eventos al desmontar
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return (
    <>
      <MainMenu />
      <IonPage id='main-content'>
        <HomeHeader />
        <IonContent fullscreen>
          <div id='map' ref={mapRef} style={{ height: '100vh' }}></div>
          <IonFab vertical='bottom' horizontal='center' style={{ paddingBottom: '40px' }}>
            {currentUser ? (
              <IonButton routerLink='/write-complaint' expand='block'>
                <IonIcon icon={addIcon} slot='start' />
                Denunciar Problema
              </IonButton>
            ) : (
              <IonButton onClick={() => setShowToast(true)} expand='block'>
                <IonIcon icon={addIcon} slot='start' />
                Denunciar Problema
              </IonButton>
            )}
          </IonFab>
          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message='Debe estar autenticado para efectuar una denuncia.'
            duration={2000}
          />
        </IonContent>
      </IonPage>
      <IssueModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedProblema={selectedProblema}
      />
    </>
  );
}

export default Home;