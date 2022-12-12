import "./preloader.css";
import "../base64_preloader.css";

const Preloader = () => {
    return (
        <div className="preloader">
            <div className="logoPreolder" id="preloader">
                <div className='logo imageLogoPreolderLogo'>
                    <div className='imageLogoPreolderblock imageLogoPreolder blob'></div>
                </div>
            </div>
        </div>
    )
};

export default Preloader;
