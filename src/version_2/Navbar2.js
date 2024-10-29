import HelpModal2 from "../components/helpModal2";
import ProgressBar from "../components/ProgressBar";
import { forwardRef } from "react";

const Navbar2 = forwardRef((props, ref) => {
    return (
        <nav className="navbar2">
            <h1>SVG - Städtische Verkehrs Gemeinschaft</h1>
            <div className="links">
                <HelpModal2 ref={ref}/>

            </div>
        </nav>
      );
})
 
export default Navbar2;