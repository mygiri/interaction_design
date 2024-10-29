import HelpModal from "./components/helpModal";
import { forwardRef } from "react";

const Navbar = forwardRef((props, ref) => {
    return (
        <nav className="navbar">
            <h1>SVG - Städtische Verkehrs Gemeinschaft</h1>
            <div className="links">
                <HelpModal ref={ref}/>
            </div>
        </nav>
      );
})
 
export default Navbar;