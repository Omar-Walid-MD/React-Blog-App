import { useState, useRef } from "react";
import { useNavigate, Link } from 'react-router-dom';
import "./RegisterPage.css";

function RegisterPage({userList, handleUserList, handleUser})
{
    const navigate = useNavigate();

    const [newUser,setNewUser] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [confirmPassword,setConfirmPassword] = useState("");

    const [warning,setWarning] = useState("");

    function handleNewUser(event)
    {
        setNewUser({
            ...newUser,
            [event.target.name]: event.target.value
        });

        console.log(newUser);
    }

    function HandleconfirmPassword(event)
    {
        setConfirmPassword(event.target.value)
    }

    function RegisterUser(e)
    {
        e.preventDefault();

        if(newUser.password===confirmPassword)
        {
            if(userList.some((function(user){return user.username===newUser.username})))
            {
                handleWarning("Username already taken!");
                return;
            }

            if(userList.some((function(user){return user.email===newUser.email})))
            {
                handleWarning("Email already registered!");
                return;
            }

            let userToAdd = {
                ...newUser,
                id: "user-"+makeId(10)
            }
    
            fetch('http://localhost:8000/users',{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userToAdd)
            }).then(()=>{
                console.log("New Post Added.");
                handleUserList(prevList => [...prevList,userToAdd]);
                handleUser(newUser);
            })
    
            navigate("/");
            return;
        }
        else
        {
            handleWarning("Password confirmation mismatch!");
            return;
        }
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

    const RegisterForm = useRef();

    function readyToSubmit()
    {
        let allInputs = null;
        if(RegisterForm.current)
        {
            allInputs = RegisterForm.current.querySelectorAll(":required");
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
                <form className="register-form-container flex-column" ref={RegisterForm} onSubmit={RegisterUser}>
                    <h1 className="register-form-label">Register New User</h1>
                    <div className="register-form-input-group flex-column">
                        <input className="register-form-input" type="text" placeholder="Enter Username" name="username" value={newUser.username} required onChange={handleNewUser}/>
                        <input className="register-form-input" type="email" placeholder="Enter Email" name="email" value={newUser.email} required onChange={handleNewUser}/>
                        <input className="register-form-input" type="password" placeholder="Enter Password" name="password" value={newUser.password} required onChange={handleNewUser}/>
                        <input className="register-form-input" type="password" placeholder="Confirm Password" name="confirmPassword" value={confirmPassword} required onChange={HandleconfirmPassword}/>
                    </div>
                    {
                        warning !== "" &&
                        <p className="login-form-warning" onAnimationEnd={ResetWarningAnimation} ref={warningElement} animate="true">{warning}</p>
                    }
                    <input className="register-form-submit" type="submit" value="Register" disabled={readyToSubmit()} />
                </form>
            </div>
        </div>
      );
}

export default RegisterPage;