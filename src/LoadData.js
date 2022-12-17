import {collection, getDocs, query, orderBy, limit} from "firebase/firestore";
import {auth, db} from "./firebase";

export default async function LoadSettingsData() {
    const settingsSnapshot = await getDocs(collection(db, "users", auth.currentUser.uid.toString(), "settings"));
    settingsSnapshot.forEach((doc) => {
        if (doc.data().loc_iso !== undefined && doc.data().loc_iso !== null) {
            document.getElementById("root").setAttribute("locvalue", doc.data().loc_iso);
        }
        if (doc.data().lang_iso !== undefined && doc.data().lang_iso !== null) {
            document.getElementById("root").setAttribute("langvalue", doc.data().lang_iso);
        }
    });
}

export async function LoadRatings() {
    const ratingQuery = query(collection(db, "users", auth.currentUser.uid.toString(), "ratings"), orderBy("rating", "desc"), limit(9));
    const ratingsSnapshot = await getDocs(ratingQuery);
    let ratings = [];
    ratingsSnapshot.forEach((doc) => {
        if (doc.data().rating > 6) {
            ratings.push(doc.data());
        }
    });
    return ratings.sort(() => .5 - Math.random()).slice(0,3);
}