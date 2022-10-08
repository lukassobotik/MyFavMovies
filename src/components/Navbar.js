import {Link, useHistory} from "react-router-dom";
import Logo from "./icons/MyFavMovies-transparent.png";
import {UserAuth} from "../context/AuthContext";

export default function Navbar() {
    const history = useHistory();
    const {user, logOut} = UserAuth();
    console.log("user:");
    console.log(user);

    const login = () => {
        history.push('/login');
    }
    const logout = async () => {
        try {
            await logOut();
            history.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (<nav>
        <div className="navbar">
            <div className="navbar_item">
                <img id="logo" src={Logo} alt="Home" width={25} height={25} onClick={() => {history.push('/browse')}}/>
            </div>
            <div className="navbar_item">
                <Link to="/search" className="navbar-btn">Search</Link>
            </div>
            <div className="navbar_item">
                {user?.email ? <div className="account flex">
                    <Link to="/account" className="navbar-btn m-auto">Account</Link>
                        <button className="logout-btn button" onClick={logout}>Log Out</button>
                </div> :
                    <div className="account flex">
                        <button className="logout-btn button" onClick={login}>Sign In</button>
                    </div>}
            </div>
        </div>
    </nav>);
}