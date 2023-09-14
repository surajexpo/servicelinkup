import { Injectable } from "@angular/core";
import { getFirestore, collection, doc, setDoc,getDoc, getCountFromServer, where,query, getDocs } from "firebase/firestore";
import "firebase/firestore";
@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor() {}
  db = getFirestore();
  usersCol = collection(this.db, "users");
  async addUser(user: any) {
    return await setDoc(doc(this.usersCol), user);
  }
  async getAllUser() {
    return await getDoc(doc(this.usersCol));
  }
  async getlUser(id: string) {
    const q = query(this.usersCol, where("uid", "==", id));
    return await getDocs(q);
  }
  async getUserCollection() {
    return await getCountFromServer(this.usersCol);
  }
 
}
