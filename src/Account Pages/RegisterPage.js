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

    const [avatar,setAvatar] = useState({
        bgColor:  "#969696",
        baseColor: "#000000",
        acc: 0,
        accColor: "#ffffff"
    });

    const acc = 4   ;

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

    function HandleAvatar(event)
    {
        setAvatar({
            ...avatar,
            [event.target.name]: event.target.value
        });

        console.log(avatar);
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
                id: "user-"+makeId(10),
                subbedTopics: [],
                likes: [],
                dislikes: [],
                savedPosts: []
            }
    
            fetch('http://localhost:8000/users',{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userToAdd)
            }).then(()=>{
                console.log("New User Added.");
                localStorage.setItem('currentUser', JSON.stringify(userToAdd));
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
                    <div className="resgister-form-input-group flex-row">
                        <div className="register-form-input-section flex-column">
                            <div className="register-avatar flex-column">

                                {/* Here is the avatar */}
                                <div className="avatar-background flex-center" style={{backgroundColor: avatar.bgColor, width: 150 + "px"}}>
                                    <div className="avatar-base-shadow" style={{backgroundImage: 'url(' + require("../img/avatar/base.png") + ')'}}></div>
                                    <div className="avatar-base" style={{maskImage: 'url(' + require("../img/avatar/base.png") + ')', WebkitMaskImage: 'url(' + require("../img/avatar/base.png") + ')', backgroundColor: avatar.baseColor}}></div>
                                    <div className="avatar-accessory-shadow" style={{backgroundImage: 'url(' + require("../img/avatar/a"+avatar.acc+".png")}}></div>
                                    <div className="avatar-accessory" style={{backgroundImage: 'url(' + require("../img/avatar/a"+avatar.acc+".png"), WebkitMaskImage: 'url(' + require("../img/avatar/a"+avatar.acc+".png"), backgroundColor: avatar.accColor}}></div>
                                </div>
                                <div className="register-avatar-options-container flex-column">
                                    <div className="register-avatar-options-row flex-row">
                                        <input className="register-avatar-color-option" type="color" name={"bgColor"} value={avatar.bgColor} onChange={HandleAvatar} />
                                        <input className="register-avatar-color-option" type="color" name={"baseColor"} value={avatar.baseColor} onChange={HandleAvatar} />
                                        <input className="register-avatar-color-option" type="color" name={"accColor"} value={avatar.accColor} onChange={HandleAvatar} />

                                    </div>
                                    <div className="register-avatar-options-row flex-row">
                                        <div className="register-avatar-image-options flex-row">
                                            {
                                                [...Array(acc).keys()].map((n)=>
                                                <button className="topic-logo-image-button flex-center" type="button" name="acc" value={n} style={{backgroundImage: 'url(' + require("../img/avatar/a"+(n)+".png") + ')'}} onClick={function(event){HandleAvatar(event)}} key={"bg-option-"+n}></button>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="register-form-input-section flex-column">
                            <input className="register-form-input" type="text" placeholder="Enter Username" name="username" value={newUser.username} required onChange={handleNewUser}/>
                            <input className="register-form-input" type="email" placeholder="Enter Email" name="email" value={newUser.email} required onChange={handleNewUser}/>
                            <input className="register-form-input" type="password" placeholder="Enter Password" name="password" value={newUser.password} required onChange={handleNewUser}/>
                            <input className="register-form-input" type="password" placeholder="Confirm Password" name="confirmPassword" value={confirmPassword} required onChange={HandleconfirmPassword}/>
                        </div>
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