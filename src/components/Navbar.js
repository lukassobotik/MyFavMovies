import {Link} from "react-router-dom";
import Logo from "./icons/Movies-1-transparent.png";
import Profile from "./icons/Profile";

export default function Navbar() {
    return (<nav>
        <div className="row">
            <div className="column">
                <img id="logo" src={Logo} alt="Home" width={25} height={25}/>
            </div>
            <div className="column">
                <Link to="/browse" className="navbar-btn">Home</Link>
            </div>
            <div className="column">
                <Link to="/login" className="navbar-btn">Log In</Link>
            </div>
            <div className="column">
                <Profile/>
            </div>
        </div>
    </nav>);
}