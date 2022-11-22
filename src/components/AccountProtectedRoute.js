import {Redirect} from "react-router-dom";
import {auth, db} from "../firebase";
import {collection, getDocs} from "firebase/firestore";
import {createContext, useContext, useEffect} from "react";

const AccountProtectedRoute = ({children}) => {
    const user = useContext(createContext(undefined));
    console.log(user);

    if (!user && (children.type.name === "Settings" || children.type.name === "Account")) {
        return <Redirect to="/login/"/>
    } else {
        return children;
    }

    //useEffect(() => {
      //  auth.onAuthStateChanged(async (user) => {
        //    redirect(user);
        //});
    //}, [user]);

};

export default AccountProtectedRoute;