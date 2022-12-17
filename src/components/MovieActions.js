import {auth, db} from "../firebase";
import {collection, deleteDoc, doc, getDocs, setDoc} from "firebase/firestore";
import {screenSizeGroups} from "../Constants";

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
    if (newValue !== null) {
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

export function getWatchProviderLink(data) {
    const loc = document.getElementById("root").getAttribute('locvalue')?.toString();
    if (data["watch/providers"]?.results[loc] !== undefined) {
        return data["watch/providers"]?.results[loc].link;
    } else if (data["watch/providers"]?.results["US"] !== undefined) {
        return data["watch/providers"]?.results["US"].link;
    }
}

export function getAmountOfItemsOnScreen(width) {
    if (width >= screenSizeGroups.sixItems) {
        return [6, "16.666%", true];
    } else if (width >= screenSizeGroups.fiveItems && window.innerWidth <= screenSizeGroups.sixItems) {
        return [5, "20%", true];
    } else if (width >= screenSizeGroups.fourItems && window.innerWidth <= screenSizeGroups.fiveItems) {
        return [4, "25%", true];
    } else if (width >= screenSizeGroups.threeItems && window.innerWidth <= screenSizeGroups.fourItems) {
        return [3, "33.333%", true];
    } else if (width >= screenSizeGroups.twoItems && window.innerWidth <= screenSizeGroups.threeItems) {
        return [2, "50%", true];
    } else if (width < screenSizeGroups.twoItems) {
        return [2, "50%", false];
    }
}

export function getReleaseDateItem(location, item) {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let dates = [];

    const date_item = item.release_dates.results.find(date => date.iso_3166_1.toString() === location);
    date_item?.release_dates?.map((date) => {
        let parsedDate = new Date(date?.release_date?.substring(0, (date?.release_date?.length - 5))).toLocaleDateString(location, options);

        switch (date.type) {
            case 1:
                dates.push(parsedDate + " (Premiere)");
                break;
            case 2:
                dates.push(parsedDate + " (Theatrical (limited))");
                break;
            case 3:
                dates.push(parsedDate + " (Theatrical)");
                break;
            case 4:
                dates.push(parsedDate + " (Digital)");
                break;
            case 5:
                dates.push(parsedDate + " (Physical)");
                break;
            case 6:
                dates.push(parsedDate + " (TV)");
                break;
            default:
                console.error("Wrong Type of Release Date");
        }
    })
    return dates;
}

export function formatNumber(num) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    });

    if (num === 0) {
        return "Unknown";
    }

    return formatter.format(num);
}

export function getMainTrailer(item) {
    let trailer;
    item.videos?.results?.map((trailer_item) => {
        let vid_key = trailer_item?.key;
        let type = trailer_item?.type;
        if (item?.videos?.results?.length === 0 || trailer_item?.site !== "YouTube") {
            return;
        }
        if (type === "Trailer") {
            trailer = vid_key;
        } else {
            trailer = vid_key;
        }
    })
    return trailer;
}

export function formatDate(date, returnString) {
    if (date === "") return returnString;
    let loc = document.getElementById("root")?.getAttribute('locvalue');
    let options = {year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(loc ? loc : "US", options);
}