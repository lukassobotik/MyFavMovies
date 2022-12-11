import {Redirect} from "react-router-dom";
import {auth} from "../../firebase";
import {useEffect, useState} from "react";
import './Account.css';

const AccountProtectedRoute = ({children}) => {
    const user = auth.currentUser;
    const [returnObject, setReturnObject] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
       auth.onAuthStateChanged(async (user) => {
           if (!user && (children.type.name === "Settings" || children.type.name === "Account")) {
               setReturnObject(<Redirect to="/login/"/>);
           } else {
               setReturnObject(children);
           }
           setIsLoading(false);
       });
    }, [user]);

    return !isLoading && returnObject;
};

export default AccountProtectedRoute;