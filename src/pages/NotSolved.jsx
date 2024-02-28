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

const NotSolved = () => {
  const [notSolvedProblems, setnotSolvedProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotSolvedProblems();
  }, []);

  const fetchNotSolvedProblems = async () => {
    setIsLoading(true);
    const q = query(
      collection(db, 'denuncias'),
      where('status', '==', 'No Resuelto'),
      orderBy('dateAdded', 'desc'),
      limit(30)
    );

    try {
      const querySnapshot = await getDocs(q);
      const problems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setnotSolvedProblems(problems);
    } catch (error) {
      console.error('Error fetching unsolved problems: ', error);
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
          <IonTitle>Problemas No Resueltos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        {isLoading ? (
          <IonSpinner />
        ) : (
          notSolvedProblems.length > 0 ? (
            notSolvedProblems.map((problem) => (
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
                No hay problemas no resueltos recientes.
              </IonCardContent>
            </IonCard>
          )
        )}
      </IonContent>
    </IonPage>
  );
};

export default NotSolved;
