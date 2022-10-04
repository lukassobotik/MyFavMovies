import {Link} from "react-router-dom";

export default function Profile() {
    return <div className="profile">
        <Link to="/profile" className="navbar-btn">Profile</Link>
        <button className="logout-btn">Logout</button>
    </div>;
}