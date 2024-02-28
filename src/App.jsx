import React, { useEffect } from "react";
import {
  IonApp,
  setupIonicReact,
} from "@ionic/react";
import "./theme/main.css";
import Router from "./router/Router";
import useAuthStore from "./context/useAuthStore";


setupIonicReact();

function App() {

  const setUserUid = useAuthStore((state) => state.setUserUid);

  useEffect(() => {
    setUserUid();
  }, [setUserUid]);

  return (
    <IonApp>
      <Router />
    </IonApp>
  );
}

export default App;
