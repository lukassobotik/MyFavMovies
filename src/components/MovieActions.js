import {auth, db} from "../firebase";
import {collection, deleteDoc, doc, getDocs, setDoc} from "firebase/firestore";

export default async function addToWatchlist({item, isOnWatchlist}) {
    const user = auth.currentUser.uid.toString().trim();
    if (isOnWatchlist === false || isOnWatchlist === undefined) {
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
    } else if (isOnWatchlist === true) {
        try {
            await deleteDoc(doc(db, "users", user, "watchlist", item.id.toString()));
            return false;
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    } else console.error("isOnWatchlist isn't a boolean or undefined: ", isOnWatchlist);
}

export async function getMovieDataFromDB(item) {
    let isOnWatchlist, rating, isRated;
    const watchlistSnapshot = await getDocs(collection(db, "users", auth.currentUser.uid.toString(), "watchlist"));
    watchlistSnapshot.forEach((doc) => {
        if (doc.data().movieId.toString() === item.id?.toString()) {
            isOnWatchlist = true;
        }
    });
    const ratingSnapshot = await getDocs(collection(db, "users", auth.currentUser.uid.toString(), "ratings"));
    ratingSnapshot.forEach((doc) => {
        if (doc.data().movieId.toString() === item.id?.toString()) {
            rating = doc.data().rating;
            isRated = true;
        }
    });
    return [isOnWatchlist, rating, isRated];
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
        console.log("enter");
        try {
            await deleteDoc(doc(db, "users", user, "ratings", item.id.toString()));
            return [false, newValue];
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
}

export function getWatchProviderLink(data) {
    const loc = document.getElementById("root")?.getAttribute('locvalue').toString();
    if (data["watch/providers"]?.results[loc] !== undefined) {
        return data["watch/providers"]?.results[loc].link;
    } else if (data["watch/providers"]?.results["US"] !== undefined) {
        return data["watch/providers"]?.results["US"].link;
    }
}