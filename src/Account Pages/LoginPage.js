import {useState, useRef} from "react";
import { useNavigate, Link, useLocation} from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./LoginPage.css";

function LoginPage({userList,handleUser})
{
    const [tr,il8n] = useTranslation();

    const navigate = useNavigate();

    const location = useLocation();
    const { prevPath } = location.state || {};

    const [loginInfo,setLoginInfo] = useState({
        email: "",
        password: ""
    });

    const [warning,setWarning] = useState("");

    function handleLoginInfo(event)
    {
        setLoginInfo({
            ...loginInfo,
            [event.target.name]: event.target.value
        });
    }


    function Login(e)
    {
        e.preventDefault();

        for(let i = 0; i < userList.length; i++)
        {
            if(userList[i].email===loginInfo.email)
            {
                if(userList[i].password===loginInfo.password)
                {
                    console.log("Successfully logged in");
                
                    localStorage.setItem('currentUser', JSON.stringify(userList[i]));
                    handleUser(userList[i]);
                    navigate(prevPath || "/");
                    return;
                }
                else
                {
                    handleWarning("Password Incorrect!");
                    console.log("Password Incorrect");
                    return;
                }
            }
        }
        handleWarning("Email not registered!");
        console.log("Email not registered");
        return;
    }

    const warningElement = useRef();

    function handleWarning(warningText)
    {
        setWarning(warningText);
        if(warningElement.current.getAttribute("animate")==="true")
        {
            warningElement.current.setAttribute("animate","false");
        }
        warningElement.current.setAttribute("animate","true");
    }

    function ResetWarningAnimation(event)
    {
        console.log("works");
        event.target.setAttribute("animate","false");
    }

    const LoginForm = useRef();

    function readyToSubmit()
    {
        let allInputs = null;
        if(LoginForm.current)
        {
            allInputs = LoginForm.current.querySelectorAll(":required");
            console.log([...allInputs].filter((formInput)=>formInput.value==='').length);
            return [...allInputs].filter((formInput)=>formInput.value==='').length > 0;
        }
        else
        {
            return true;
        }

    }

    function makeId(length)
    {
        let result = "";
        let chars = "123456789";
        for (var i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * 9)];
        }
        return result;
    }

    return (
        <div className="main-page">
            <div className="account-page-container page-container flex-center" header="none">
                <form className="login-form-container flex-column" ref={LoginForm} onSubmit={Login}>
                    <h1 className="login-form-label">{tr("accountPages.logIn")}</h1>
                    <div className="login-form-input-group flex-column">
                        <div className="register-form-input-container">
                            <input className="register-form-input" type="text" name="email" value={loginInfo.email} required onChange={handleLoginInfo} autocomplete="false"/>
                            <div className="register-form-input-label">{tr("accountPages.enterEmail")}</div>
                        </div>
                        <div className="register-form-input-container">
                            <input className="register-form-input" type="password" name="password" value={loginInfo.password} required onChange={handleLoginInfo}/>
                            <div className="register-form-input-label">{tr("accountPages.enterPassword")}</div>
                        </div>
                        {/* <input className="login-form-input" type="email" placeholder="Enter Email" name="email" value={loginInfo.email} onChange={handleLoginInfo} required/>
                        <input className="login-form-input" type="password" placeholder="Enter Password" name="password" value={loginInfo.password} onChange={handleLoginInfo} required/> */}
                    </div>
                    {
                        warning !== "" &&
                        <p className="login-form-warning" onAnimationEnd={ResetWarningAnimation} ref={warningElement} animate="true">{warning}</p>
                    }
                    <input className="login-form-submit" type="submit" value={tr("accountPages.logIn")} disabled={readyToSubmit()} />
                </form>
                <Link className="back-button" to={prevPath || "/"}>{tr("accountPages.back")}</Link>
            </div>
        </div>
      );
}

export default LoginPage;