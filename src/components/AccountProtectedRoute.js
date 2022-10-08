import {UserAuth} from "../context/AuthContext";
import {Redirect} from "react-router-dom";

const AccountProtectedRoute = ({children}) => {
    const {user} = UserAuth();

    if (!user) {
        return <Redirect to="/login"/>
    } else {
        return children;
    }
};

export default AccountProtectedRoute;