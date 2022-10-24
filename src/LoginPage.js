import {useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import "./LoginPage.css";

function LoginPage({userList,handleUser})
{
    const navigate = useNavigate();

    const [loginInfo,setLoginInfo] = useState({
        email: "",
        password: ""
    })


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
                    navigate("/");
                    return;
                }
                else
                {
                    console.log("Password Incorrect");
                    return;
                }
            }
        }
        console.log("Email not registered");
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
            <div className="page-container flex-center" header="none">
                <form className="login-form-container flex-column" ref={LoginForm} onSubmit={Login}>
                    <h1 className="login-form-label">Log in</h1>
                    <div className="login-form-input-group flex-column">
                        <input className="login-form-input" type="email" placeholder="Enter Email" name="email" value={loginInfo.email} onChange={handleLoginInfo} required/>
                        <input className="login-form-input" type="password" placeholder="Enter Password" name="password" value={loginInfo.password} onChange={handleLoginInfo} required/>
                    </div>
                    <input className="login-form-submit" type="submit" value="Log in" disabled={readyToSubmit()} />
                </form>
            </div>
        </div>
      );
}

export default LoginPage;