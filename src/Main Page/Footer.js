import "./Footer.css";

function Footer({setLanguage})
{

    function setTheme(event)
    {
        let theme = event.target.getAttribute("theme");
        document.body.setAttribute("theme",theme);
        localStorage.setItem("theme",theme);
    }
    return (
        <footer className="footer flex-row">
            <div className="footer-settings flex-row">
                <div className="footer-menu flex-center">
                    <input type="checkbox" className="footer-checkbox hidden-checkbox" id="footer-lang-checkbox"/>
                    <label htmlFor="footer-lang-checkbox" className="footer-button"><i className='bx bx-world'></i></label>
                    <div className="footer-dropdown flex-column">
                        <button className="footer-lang-button" lang="en" onClick={function(){setLanguage("en")}}>English</button>
                        <button className="footer-lang-button" lang="ar" onClick={function(){setLanguage("ar")}}>العربية</button>
                    </div>
                </div>
                <div className="footer-menu flex-center">
                    <input type="checkbox" className="footer-checkbox hidden-checkbox" id="footer-theme-checkbox"/>
                    <label htmlFor="footer-theme-checkbox" className="footer-button"><i className='bx bxs-palette'></i></label>
                    <div className="footer-dropdown flex-column">
                        <button className="footer-theme-button" theme="basic" onClick={setTheme} >Basic</button>
                        <button className="footer-theme-button" theme="platinum" onClick={setTheme} >Platinum</button>
                        <button className="footer-theme-button" theme="hazelnut" onClick={setTheme} >Hazelnut</button>
                        <button className="footer-theme-button" theme="ocean" onClick={setTheme} >Ocean</button>
                        <button className="footer-theme-button" theme="night" onClick={setTheme} >Night</button>
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