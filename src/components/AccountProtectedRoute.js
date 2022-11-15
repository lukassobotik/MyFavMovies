import {UserAuth} from "../context/AuthContext";
import {Redirect} from "react-router-dom";

const AccountProtectedRoute = ({children}) => {
    const {user} = UserAuth();

    if (!user && (children.type.name === "Settings" || children.type.name === "Account")) {
        return <Redirect to="/login/"/>
    } else {
        return children;
    }
};

export default AccountProtectedRoute;