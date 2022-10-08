import {Link, useHistory} from "react-router-dom";
import Logo from "./icons/MyFavMovies-transparent.png";

export default function Navbar() {
    const history = useHistory();

    const click = () => {
      history.push('/login');
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
                <div className="account flex">
                    <Link to="/account" className="navbar-btn m-auto">Account</Link>
                    <button className="logout-btn button" onClick={click}>Login</button>
                </div>
            </div>
        </div>
    </nav>);
}