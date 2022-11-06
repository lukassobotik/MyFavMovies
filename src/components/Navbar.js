import {Link, useHistory} from "react-router-dom";
import Logo from "./icons/MyFavMovies-transparent.png";
import {UserAuth} from "../context/AuthContext";
import {MdSearch, MdAccountCircle, MdSettings} from "react-icons/md";
import React from "react";
import AccountProtectedRoute from "./AccountProtectedRoute";

export default function Navbar() {
    const history = useHistory();
    const {user, logOut} = UserAuth();

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
                <Link to="/" className="navbar-btn"><MdSearch size={25}/></Link>
            </div>
            <div className="navbar_item">
                <Link to="/settings"><AccountProtectedRoute><MdSettings size={25}/></AccountProtectedRoute></Link>
            </div>
            <div className="navbar_item">
                {user?.email ? <div className="account flex">
                    <Link to="/account" className="navbar-btn m-auto"><div className="w-[40px] h-[40px] text-justify flex items-center justify-center rounded-full overflow-hidden">
                        {user.photoURL ? <img src={user.photoURL} alt="Profile"/> :
                            <MdAccountCircle size={40}/>
                        }
                    </div></Link>
                        <button className="logout-btn button" onClick={logout}>Log Out</button>
                </div> :
                    <div className="account flex">
                        <button className="logout-btn button" onClick={login}>Sign In</button>
                    </div>}
            </div>
        </div>
    </nav>);
}