import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  getFirestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { GameReadyConfig } from "./types";

export const idConverter: FirestoreDataConverter<any> = {
  toFirestore(data): DocumentData {
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
    };
  },
};

export type WithId<T> = { id: string } & T;

const db = getFirestore();

const getCollectionRef = <Doc>(collectionName: string) =>
  collection(db, collectionName).withConverter(
    idConverter
  ) as CollectionReference<Doc>;

const getDocRef = <Doc>(id: string, collectionName: string) =>
  doc(db, collectionName, id) as DocumentReference<Doc>;

const gameReady = <Player>(id: string) =>
  getDocRef<GameReadyConfig<Player>>(id, "gameReadyConfig");

const gamesReady = <Player>() =>
  getCollectionRef<GameReadyConfig<Player>>("gameReadyConfig");
const gamesReadyWithId = <Player>() =>
  getCollectionRef<WithId<GameReadyConfig<Player>>>("gameReadyConfig");

export const apiRefs = {
  gameReady,
  gamesReady,
  gamesReadyWithId,
};
