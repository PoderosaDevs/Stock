import { FaPlay } from "react-icons/fa6";

import Logo from "../../assets/logo.png"
import { Link } from "react-router-dom";
export function Header() {
  return (
    <div className="w-full bg-white py-3 fixed">
      <div className="max-w-[1500px] px-8 py-2 mx-auto flex justify-between">
        <Link to={'/'}>
          <img src={Logo} className="w-40" />
        </Link>
        <div>
          <Link to={'/overview'} className="bg-gray-100 text-1 rounded px-3 py-2 flex items-center gap-1.5">Vizualizar<FaPlay /></Link>
        </div>
      </div>
    </div>
  )
}