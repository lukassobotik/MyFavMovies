import {collection, getDocs} from "firebase/firestore";
import {auth, db} from "./firebase";

export default async function LoadSettingsData() {
    const ratingSnapshot = await getDocs(collection(db, "users", auth.currentUser.uid.toString(), "settings"));
    ratingSnapshot.forEach((doc) => {
        if (doc.data().loc_iso !== undefined && doc.data().loc_iso !== null) {
            document.getElementById("root").setAttribute("locvalue", doc.data().loc_iso);
        }
        if (doc.data().lang_iso !== undefined && doc.data().lang_iso !== null) {
            document.getElementById("root").setAttribute("langvalue", doc.data().lang_iso);
        }
    });
}