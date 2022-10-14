import Layout from "./Layout";
import {UserAuth} from "../context/AuthContext";
import {useHistory} from "react-router-dom";
import {MdPerson, MdSettings} from "react-icons/md"

export default function Account() {
    const {user} = UserAuth();
    const history = useHistory();

    document.onmousedown = () => {
        return true;
    };

    function settings() {
        history.push('/settings')
    }

    return (
        <Layout>
            <div className="flex h-screen">
                <div className="w-1/4 h-full border-r-2 border-r-black flex profile_overview text-xs sm:text-xs md:text-2xl lg:text-4xl">
                    <div className="fixed m-2 w-[5px] sm:w-[15px] md:w-[25px] lg:w-[30px]">
                        <MdSettings className="" size={50} color="#000000" onClick={settings}/>
                    </div>
                    <div className="flex justify-center">
                        <div className="h-fit aspect-square w-3/5 mt-5 text-justify flex items-center justify-center rounded-full bg-gradient-to-r p-1 from-[#fe934c] to-[#fc686f]">
                            <div className="w-full h-full text-justify flex items-center justify-center rounded-full overflow-hidden">
                                <MdPerson className="" size={500} color="#000000"/>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 w-full">{user ? user.displayName : 'Username'}</div>
                </div>
                <div className="w-3/4 h-full">

                </div>
            </div>
        </Layout>
    )
}