import {Link, useHistory} from "react-router-dom";
import Logo from "../Icons/MyFavMovies-transparent.png";
import {MdAccountCircle, MdSearch, MdSettings} from "react-icons/md";
import React, {useState} from "react";
import AccountProtectedRoute from "./Account Route/AccountProtectedRoute";
import {screenSizeGroups} from "../Constants";
import Popover from '@mui/material/Popover';
import {signOut} from "firebase/auth";
import {auth} from "../firebase";

export default function Navbar() {
    const history = useHistory();
    console.log(auth.currentUser);
    const user = auth.currentUser;
    const [isMobileSized, setIsMobileSized] = useState(false);
    const [accountPopoverAnchorEl, setAccountPopoverAnchorEl] = React.useState(null);
    const isAccountPopoverOpen = Boolean(accountPopoverAnchorEl);
    const popoverId = isAccountPopoverOpen ? 'account-popover' : undefined;

    const logout = async () => {
        try {
            await signOut(auth);
            history.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    window.addEventListener('resize', (() => handleMobileSize()));

    function handleMobileSize() {
        if (window.innerWidth < screenSizeGroups.twoItems) {
            const el = document.getElementById("logout_btn");
            if (el !== null) {
                el.style.visibility = "hidden";
                el.style.display = "none";
            }
            document.getElementById("navbar_settings").style.display = "none";
            document.getElementById("navbar_search").style.display = "none";
            setIsMobileSized(true);
        } else {
            handleAccountMenuClose();
            const el = document.getElementById("logout_btn");
            if (el !== null) {
                el.style.visibility = "visible";
                el.style.display = "block";
            }
            document.getElementById("navbar_settings").style.display = "block";
            document.getElementById("navbar_search").style.display = "block";
            setIsMobileSized(false);
        }
    }

    const handleAccountClick = (event) => {
        if (isMobileSized) {
            setAccountPopoverAnchorEl(event.currentTarget);
        } else {
            history.push("/account/");
        }
    };

    const handleAccountMenuClose = () => {
        setAccountPopoverAnchorEl(null);
    };

    return (<nav onLoad={handleMobileSize}>
        <div className="navbar">
            <div className="navbar_item">
                <Link to="/browse/"><img id="logo" src={Logo} alt="Home" width={25} height={25}/></Link>
            </div>
            <div id="navbar_search" className="navbar_item">
                <Link to="/" className="navbar-btn"><MdSearch size={25}/></Link>
            </div>
            <div id="navbar_settings" className="navbar_item">
                <Link to="/settings/"><AccountProtectedRoute><MdSettings size={25}/></AccountProtectedRoute></Link>
            </div>
            <div className="navbar_item">
                {user?.email ? <div className="account flex">
                    <div className="w-[40px] h-fit text-justify flex items-center justify-center rounded-full overflow-hidden" onClick={handleAccountClick}>
                        {user.photoURL ? <img src={user.photoURL} alt="Profile"/> :
                            <div>
                                <MdAccountCircle size={40}/>
                            </div>
                        }
                    </div>
                        <button id={"logout_btn"} className="logout-btn button" onClick={logout}>Log Out</button>
                </div> :
                    <div className="account flex">
                        <Link to="/login/" className="logout-btn button"><button>Sign In</button></Link>
                    </div>}
                <Popover id={popoverId} open={isAccountPopoverOpen} anchorEl={accountPopoverAnchorEl} onClose={handleAccountMenuClose} anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}>
                    <div className="w-full h-full p-3 text-black cursor-pointer" onClick={() => history.push("/account/")}>Account</div>
                    <div className="w-full h-full p-3 text-black cursor-pointer" onClick={() => history.push("/settings/")}>Settings</div>
                    <div className="w-full h-full p-3 text-black cursor-pointer" onClick={() => history.push("/search/")}>Search</div>
                </Popover>
            </div>
        </div>
    </nav>);
}