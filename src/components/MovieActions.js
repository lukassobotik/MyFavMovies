import {auth, db} from "../firebase";
import {deleteDoc, doc, setDoc} from "firebase/firestore";

export const playClick = () => {

}

export default async function addToWatchlist({item, isOnWatchlist}) {
    const user = auth.currentUser.uid.toString().trim();
    if (!isOnWatchlist) {
        try {
            await setDoc(doc(db, "users", user, "watchlist", item.id.toString()), {
                item: item,
                movieId: item?.id,
                name: item?.title
            });
            return true;
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    } else {
        try {
            await deleteDoc(doc(db, "users", user, "watchlist", item.id.toString()));
            return false;
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
}

export const saveRating = async (newValue, rating, item) => {
    const user = auth.currentUser.uid.toString().trim();
    if (rating !== null) {
        try {
            await setDoc(doc(db, "users", user, "ratings", item.id.toString()), {
                item: item,
                movieId: item?.id,
                name: item?.title,
                rating: newValue
            });
            return [true, newValue];
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    } else {
        try {
            await deleteDoc(doc(db, "users", user, "ratings", item.id.toString()));
            return [false, newValue];
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
}