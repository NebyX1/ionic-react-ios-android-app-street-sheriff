import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import { query, collection, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

import style from '../theme/modules/tables.module.css';

const Solved = () => {
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSolvedProblems();
  }, []);

  const fetchSolvedProblems = async () => {
    setIsLoading(true);
    const q = query(
      collection(db, 'denuncias'),
      where('status', '==', 'Resuelto'),
      orderBy('dateAdded', 'desc'),
      limit(30)
    );

    try {
      const querySnapshot = await getDocs(q);
      const problems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSolvedProblems(problems);
    } catch (error) {
      console.error('Error fetching solved problems: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='/home' text='Volver' />
          </IonButtons>
          <IonTitle>Problemas Resueltos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        {isLoading ? (
          <IonSpinner />
        ) : (
          solvedProblems.length > 0 ? (
            solvedProblems.map((problem) => (
              <IonCard key={problem.id} className={style.problemCard}>
                <IonCardHeader>
                  <IonCardSubtitle>{problem.title}</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>
                    <b>Descripción:</b> {problem.description}
                  </p>
                  <p>
                    <b>Denuncia:</b>{' '}
                    {new Date(problem.dateAdded).toLocaleDateString()}
                  </p>
                  <p>
                    <b>Resolución:</b>{' '}
                    {new Date(problem.dateModified).toLocaleDateString()}
                  </p>
                  <p>
                    <b>Observaciones:</b> {problem.observations}
                  </p>
                </IonCardContent>
              </IonCard>
            ))
          ) : (
            <IonCard>
              <IonCardContent className='ion-text-center'>
                No hay problemas resueltos recientes.
              </IonCardContent>
            </IonCard>
          )
        )}
      </IonContent>
    </IonPage>
  );
};

export default Solved;
