Cuando empaqueto el build con electron, al parecer esto me está dando problemas, el filtro que tengo establecido:
"
index-70e53b47.js:3159 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'createIcon')
    at h._initIcon (index-70e53b47.js:3159:78576)
    at h.onAdd (index-70e53b47.js:3159:77506)
    at h._layerAdd (index-70e53b47.js:3159:69603)
    at h.whenReady (index-70e53b47.js:3159:44447)
    at h.addLayer (index-70e53b47.js:3159:69880)
    at h.addTo (index-70e53b47.js:3159:68936)
    at index-70e53b47.js:3529:2864
    at Array.forEach (<anonymous>)
    at B (index-70e53b47.js:3529:2800)
_initIcon @ index-70e53b47.js:3159
onAdd @ index-70e53b47.js:3159
_layerAdd @ index-70e53b47.js:3159
whenReady @ index-70e53b47.js:3159
addLayer @ index-70e53b47.js:3159
addTo @ index-70e53b47.js:3159
(anonymous) @ index-70e53b47.js:3529
B @ index-70e53b47.js:3529
await in B (async)
(anonymous) @ index-70e53b47.js:3529
qy @ index-70e53b47.js:40
Y0 @ index-70e53b47.js:40
YU @ index-70e53b47.js:40
wh @ index-70e53b47.js:40
rF @ index-70e53b47.js:40
Uf @ index-70e53b47.js:38
nd @ index-70e53b47.js:40
dP @ index-70e53b47.js:37
aw @ index-70e53b47.js:37
pS @ index-70e53b47.js:37
Rz @ index-70e53b47.js:37
handleMouseUp_ @ unknown
index-70e53b47.js:3159 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading '_leaflet_events')
    at Eu (index-70e53b47.js:3159:24795)
    at Nr (index-70e53b47.js:3159:23927)
    at h._removeIcon (index-70e53b47.js:3159:79386)
    at h.onRemove (index-70e53b47.js:3159:77737)
    at h.removeLayer (index-70e53b47.js:3159:69987)
    at index-70e53b47.js:3529:2781
    at h.eachLayer (index-70e53b47.js:3159:70230)
    at B (index-70e53b47.js:3529:2713)
"

"
import React, { useEffect, useRef, useState } from "react";
import { Button, Subtitle1, Tooltip, Select } from "@fluentui/react-components";
import { SlideTextRegular } from "@fluentui/react-icons";
import useAuth from "../auth/useAuth";
import { Col, Container, Row } from "react-bootstrap";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";

// Importamos los iconos desde react-icons
import {
  IoLogOutOutline,
  IoDocumentTextOutline,
  IoInformationCircle,
  IoFlagOutline,
} from "react-icons/io5";
import { BsDatabaseAdd, BsDatabaseDash } from "react-icons/bs";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaMapMarkerAlt } from "react-icons/fa";

// Importamos el modulo de estilos
import styles from "../styles/home.module.css";

// Importamos todos los modales
import IssueModal from "../components/IssueModal";
import AboutModal from "../components/AboutModal";
import SolvedModal from "../components/SolvedModal";
import ArchivedModal from "../components/ArchivedModal";
import StatusModal from "../components/StatusModal";
import ReportModal from "../components/ReportModal";

const Home = () => {
  // Función para cerrar la aplicación
  const closeApp = () => {
    window.electron.closeApp();
  };

  const { logout } = useAuth();
  const mapRef = useRef(null);
  const [problemasUrbanos, setProblemasUrbanos] = useState([]);
  const [selectedProblema, setSelectedProblema] = useState(null);
  const [filtro, setFiltro] = useState("");

  // Controlador de Modales
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSolvedModal, setShowSolvedModal] = useState(false);
  const [showArchivedModal, setShowArchivedModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const loadProblemasUrbanos = async (filtro = "") => {
    const querySnapshot = await getDocs(collection(db, "denuncias"));
    let problemasData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filtra los datos para excluir siempre los casos "Resuelto" y "No Resuelto",
    // además de aplicar el filtro seleccionado, si es que hay alguno.
    problemasData = problemasData.filter((problema) => {
      const esEstadoExcluido =
        problema.status === "Resuelto" || problema.status === "No Resuelto";
      if (filtro) {
        return problema.status === filtro && !esEstadoExcluido;
      } else {
        // Si no hay filtro seleccionado (Todos), simplemente excluye los estados no deseados
        return !esEstadoExcluido;
      }
    });

    // Inicializar el mapa si aún no se ha creado
    if (!mapRef.current || !mapRef.current._leaflet_id) {
      mapRef.current.innerHTML = ""; // Limpia el contenedor del mapa si es necesario
      const map = L.map(mapRef.current).setView([-34.37, -55.23], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "",
      }).addTo(map);

      map.attributionControl.setPrefix("");

      var customMarkerIcon = L.divIcon({
        className: 'custom-icon',
        html: '<i class="fas fa-map-marker-alt fa-3x" style="color: orange; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      // Guarda la instancia del mapa para uso futuro
      mapRef.current.mapInstance = map;
    } else {
      // Limpia los marcadores existentes
      mapRef.current.mapInstance.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
          mapRef.current.mapInstance.removeLayer(layer);
        }
      });
    }

    // Agrega nuevos marcadores
    problemasData.forEach((problema) => {
      L.marker([problema.location.lat, problema.location.lng], { icon: customMarkerIcon })
        .addTo(mapRef.current.mapInstance)
        .bindPopup(
          `Tipo: ${problema.type}<br>Descripción: ${problema.description}`
        )
        .on("click", () => {
          setSelectedProblema(problema);
          setShowIssueModal(true);
        });
    });

    setProblemasUrbanos(problemasData);
  };

  useEffect(() => {
    loadProblemasUrbanos(filtro); // Carga inicial con todos los datos
  }, [filtro]); // Recargar cuando el filtro cambia

  // Función para manejar cambios en el select de filtro
  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
  };

  return (
    <>
      <Container className="p-0" fluid>
        <Row className={`mb-1 d-flex ${styles.bandHeight}`}>
          <Subtitle1 className="d-flex align-items-center justify-content-center">
           <h3 className="mt-1 text-white">Sistema de Gestión de Reclamos Ciudadanos &nbsp; <span className="text-primary">Street Sheriff</span></h3>
          </Subtitle1>
        </Row>
        <Row className={`mb-1 ${styles.buttonBandHeight}`}>
          <Col md={8}></Col>
          <Col md={4} className="d-flex">
            <label className="mt-2 me-2" htmlFor="selector">
              Filtrar por:
            </label>
            <Select
              className="me-5"
              id="selector"
              value={filtro}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              <option value="Procesando">Procesando</option>
              <option value="En Conocimiento">En Conocimiento</option>
              <option value="En Obra">En Obra</option>
            </Select>
            <Button
              onClick={() => loadProblemasUrbanos(filtro)}
              className="me-2"
            >
              <FaMapMarkerAlt className="me-1 m-e" /> Refrescar Mapa
            </Button>
            <Tooltip
              content="Este botón permite actualizar el mapa por si hay nuevos problemas que no ha sido renderizados aún desde el servidor"
              relationship="label"
            >
              <Button icon={<SlideTextRegular />} size="large" />
            </Tooltip>
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            <Row className="ms-2 mb-2">
              <Button onClick={() => setShowStatusModal(true)}>
                <IoFlagOutline className="me-1" /> Cambiar Status
              </Button>
            </Row>

            <Row className="ms-2 mb-2">
              <Button onClick={() => setShowReportModal(true)}>
                <IoDocumentTextOutline className="me-1" /> Generar Reporte
              </Button>
            </Row>

            <Row className="ms-2 mb-2">
              <Button onClick={() => setShowSolvedModal(true)}>
                <BsDatabaseAdd className="me-1" /> Ver Denuncias Resueltas
              </Button>
            </Row>

            <Row className="ms-2 mb-2">
              <Button onClick={() => setShowArchivedModal(true)}>
                <BsDatabaseDash className="me-1" /> Ver denuncias Archivadas
              </Button>
            </Row>

            <Row className="ms-2 mb-2">
              <Button onClick={() => setShowAboutModal(true)}>
                <IoInformationCircle className="me-1" /> Sobre Street Sheriff
              </Button>
            </Row>

            <Row className="ms-2 mb-2">
              <Button onClick={logout}>
                <IoLogOutOutline className="me-1" /> Cerrar sesión
              </Button>
            </Row>

            <Row className="ms-2 mb-2">
              <Button onClick={closeApp}>
                <IoMdCloseCircleOutline className="me-1" /> Salir
              </Button>
            </Row>
          </Col>
          <Col md={10}>
            <Container
              fluid
              ref={mapRef}
              className={`p-0 ${styles.mapFormatting}`}
            ></Container>

            {/* Acá van todos los modales que vamos a usar */}
            <IssueModal
              showModal={showIssueModal}
              setShowModal={setShowIssueModal}
              selectedProblema={selectedProblema}
            />

            <AboutModal
              showModal={showAboutModal}
              setShowModal={setShowAboutModal}
            />

            <SolvedModal
              showModal={showSolvedModal}
              setShowModal={setShowSolvedModal}
            />

            <ArchivedModal
              showModal={showArchivedModal}
              setShowModal={setShowArchivedModal}
            />

            <StatusModal
              showModal={showStatusModal}
              setShowModal={setShowStatusModal}
            />

            <ReportModal
              showModal={showReportModal}
              setShowModal={setShowReportModal}
            />
          </Col>
        </Row>
        <Row className={`mt-1 ${styles.bandHeight}`}></Row>
      </Container>
    </>
  );
};

export default Home;

"

Cómo soluciono ese problema?