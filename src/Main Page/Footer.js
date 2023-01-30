import { useRef } from "react";
import i18next from "i18next";

import "./Footer.css";

function Footer()
{
    const langCheckbox = useRef();
    const themeCheckbox = useRef();

    function setLanguage(lang)
    {
      i18next.changeLanguage(lang);
      document.body.setAttribute("lang",lang);
      localStorage.setItem("lang",lang);
    }

    function setTheme(event)
    {
        let theme = event.target.getAttribute("theme");
        document.body.setAttribute("theme",theme);
        localStorage.setItem("theme",theme);
    }

    function HandleWindows(event)
    {
        // console.log(event.currentTarget.id);
        if(event.currentTarget.id==="footer-theme-checkbox")
        {
            if(langCheckbox.current.checked) langCheckbox.current.checked = false;
        }
        else if(event.currentTarget.id==="footer-lang-checkbox")
        {
            if(themeCheckbox.current.checked) themeCheckbox.current.checked = false;
        }
    }
    return (
        <footer className="footer flex-row">
            <div className="footer-settings flex-row">
                <div className="footer-menu flex-center">
                    <input type="checkbox" className="footer-checkbox hidden-checkbox" id="footer-lang-checkbox" ref={langCheckbox} onClick={HandleWindows}/>
                    <label htmlFor="footer-lang-checkbox" className="footer-button" ><i className='bx bx-world'></i></label>
                    <div className="footer-dropdown flex-column">
                        <button className="footer-lang-button" lang="en" onClick={function(){setLanguage("en")}}>English</button>
                        <button className="footer-lang-button" lang="ar" onClick={function(){setLanguage("ar")}}>العربية</button>
                    </div>
                </div>
                <div className="footer-menu flex-center">
                    <input type="checkbox" className="footer-checkbox hidden-checkbox" id="footer-theme-checkbox" ref={themeCheckbox} onClick={HandleWindows}/>
                    <label htmlFor="footer-theme-checkbox" className="footer-button"><i className='bx bxs-palette'></i></label>
                    <div className="footer-dropdown flex-column">
                        <button className="footer-theme-button" theme="aurora" onClick={setTheme} >Aurora</button>
                        <button className="footer-theme-button" theme="platinum" onClick={setTheme} >Platinum</button>
                        <button className="footer-theme-button" theme="hazelnut" onClick={setTheme} >Hazelnut</button>
                        <button className="footer-theme-button" theme="ocean" onClick={setTheme} >Ocean</button>
                        <button className="footer-theme-button" theme="nightfall" onClick={setTheme} >Nightfall</button>
                    </div>
                </div>
            </div>
            <div className="footer-credits flex-row">
                Omar Walid Diab © 2023
            </div>
        </footer>
    )
}

export default Footer;