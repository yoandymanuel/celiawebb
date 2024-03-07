import { firebase } from "@/lib/firebase";
import "firebase/storage";
import "firebase/firestore";
// import 'firebase/storage';
import { v4 as uuidv4 } from "uuid";
import { CONST } from "@/lib/GLOBALS/CONSTANTS/Constants";
import { StorageService } from "./StorageService";
import { string } from "zod";
import {data} from "@/lib/db_json";
class StorageFirebaseService implements StorageService {
  private storage: firebase.storage.Storage;
  private firestore: firebase.firestore.Firestore;
  private imageUploadsNames: string[] = [];

  constructor() {
    this.storage = firebase.storage();
    this.firestore = firebase.firestore();
  }
  async listAll(): Promise<{ id: string }[]> {
    let firebaseData = await this.firestore
      .collection(CONST.FIRABSE_BD.RESTAURANTES)
      .orderBy("createAt", "desc")
      .get();
    return firebaseData.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
  async getAllTypeOfKitchens(): Promise<{ id: string }[]> {
    let firebaseData = await this.firestore
      .collection(CONST.FIRABSE_BD.TIPO_COCINA)
      .get();
    return firebaseData.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async save(data:any): Promise<void> {
    const collectionRef = this.firestore.collection(CONST.FIRABSE_BD.RESTAURANTES);
    await collectionRef.add(data);
  }
  async uploadFile(files: File[]): Promise<string[]> {
    files.forEach(async (file) => {
      const fileName = uuidv4();
      const path: string = `${CONST.DIRS.IMGAGE_RESTAURANT}/test/${fileName}`;
      await this.storage.ref().child(path).put(file);
      this.imageUploadsNames.push(fileName);
    });
    return this.imageUploadsNames;
  }
}

export default new StorageFirebaseService();
