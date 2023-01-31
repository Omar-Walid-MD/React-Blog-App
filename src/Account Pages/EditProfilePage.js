import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import axios from 'axios';

import Avatar from "../Main Page/Avatar";
import TextInput from "../Main Page/TextInput";
import "./AccountPages.css";
import Footer from "../Main Page/Footer";

function EditProfilePage({userList, handleUserList, handleUser, currentUser})
{
    const location = useLocation();
    const { prevPath } = location.state || {};

    const [tr,il8n] = useTranslation();

    const navigate = useNavigate();

    const [newUser,setNewUser] = useState();

    const [avaterWindow,setAvatarWindow] = useState(false);

    const avatarDefault = {
        bgImg: 0,
        bgColor:  "#969696",
        baseColor: "#000000",
        accImg: 0,
        accColor: "#ffffff"
    };
    const [avatar,setAvatar] = useState(avatarDefault);

    const bg = 3; const acc = 6;

    const usernameAdj = [
        "Abnormal","Adorable","Adventurous","Agile","Ambitious","Awesome",
        "Beautiful","Bizzare","Bold","Bright",
        "Cautious","Cheery","Classic","Cool",
        "Dazzling","Different","Delightful",
        "Earnest","Exotic","Fabulous","Faithful","Fast","Funny",
        "Generous","Goofy","Hard","Humble",
        "Intense","Irregular","Joyful","Keen","Loud","Loving",
        "Mature","Odd","Open","Playful","Popular","Quick","Quirky",
        "Radical","Radiant","Reckless","Sharp","Solid","Special","Strong",
        "Talented","Twisted","Unique","Upbeat","Vibrant","Warm","Zealous"
    ];

    const usernameNoun = [
        "Ant","Apple","Aurora","Banana","Beam","Boy","Brother",
        "Caravan","Cat","Crayon","Daughter","Doctor","Dog","Dress",
        "Egg","Energy","Fish","Flower","Forest","Gold","Grass","Honey","Horse",
        "Insect","Jelly","Juice","King","Kite","Lamp","Lion","Lunch","Monkey",
        "Nail","Needle","Night","Orange","Oyster","Parrot","Pencil","Pizza","Potato",
        "Queen","Quill","Rainbow","Rose","School","Shoe","Stone","Sugar",
        "Teacher","Tomato","Truck","Umbrella","Van","Vulture","Whale","Zebra"
    ];

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
            [event.target.name]: avatar[event.target.name]===event.target.value ? avatarDefault[event.target.name] : event.target.value
        });
    }

    function RandomizeUsername()
    {
        let username = usernameAdj[Math.floor(Math.random() * usernameAdj.length)] + usernameNoun[Math.floor(Math.random() * usernameNoun.length)] + makeId(3);

         setNewUser({
             ...newUser,
             username: username
         });
    }

    function SaveChanges(e)
    {
        e.preventDefault();

        if(confirmPassword==="" || (confirmPassword!=="" && newUser.password===confirmPassword))
        {
            if(userList.some((function(user){return user.username===newUser.username && user.id!==currentUser.id})))
            {
                handleWarning("Username already taken!");
                return;
            }

            if(userList.some((function(user){return user.email===newUser.email && user.id!==currentUser.id})))
            {
                handleWarning("Email already registered!");
                return;
            }

            console.log(newUser);
    
            // fetch('http://localhost:8000/users',{
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(newUser)
            // }).then(()=>{
            //     console.log("New User Added.");
            //     localStorage.setItem('currentUser', JSON.stringify(newUser));
            //     handleUserList(prevList => [...prevList,newUser]);
            //     handleUser(newUser);
            // })

            axios.put('http://localhost:8000/users/'+newUser.id,
                newUser
            )
            .then(resp =>{
                console.log("Updated User Profile");
                localStorage.setItem('currentUser', JSON.stringify(newUser));
                handleUserList(prevList => [...prevList,newUser]);
                handleUser(newUser);
            }).catch(error => {
                console.log(error);
            });
    
            navigate(prevPath || "/");
            return;
        }
        else if(confirmPassword!=="" && newUser.password!==confirmPassword)
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

    function readyToSubmit(RegisterForm)
    {
        let allInputs = null;
        if(RegisterForm.current)
        {
            allInputs = RegisterForm.current.querySelectorAll(":required");
            console.log([...allInputs].filter((formInput)=>formInput.value==='').length);
            return (currentUser.password!==newUser.password && confirmPassword!=="") && [...allInputs].filter((formInput)=>formInput.value==='').length > 0;
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

    useEffect(()=>{
        if(currentUser)
        {
            setNewUser(currentUser);
            setAvatar(currentUser.avatar);
        }
    },[currentUser]);


    return (
        <div className="main-page">
            <div className="account-page-container page-container flex-center" header="none">
                {
                    newUser ?
                    <form className="login-form-container flex-column" ref={RegisterForm} onSubmit={SaveChanges}>
                        <h1 className="login-form-title">Edit Profile</h1>
                        <div className="register-form-input-group flex-row">
                            <div className="login-form-input-section flex-column">
                                <div className="register-avatar flex-center">
                                    <button className="register-avatar-open-button" type="button" onClick={function(){setAvatarWindow(true)}}>Edit Avatar</button>
                                    <Avatar bgImg={avatar.bgImg} bgColor={avatar.bgColor} baseColor={avatar.baseColor} accImg={avatar.accImg} accColor={avatar.accColor} width={150} />
                                </div>
                            </div>
                            <div className="login-form-input-section flex-column">
                                <div>
                                    <TextInput selectorClass="login-input" containerType="field" inputName="username" inputLabel={tr("accountPages.editUsername")} inputValue={newUser.username} require={true} inputFunc={handleNewUser} />
                                    {/* <input className="register-form-input" type="text" placeholder="edit Username" name="username" maxLength="20" value={newUser.username} required onChange={handleNewUser}/> */}
                                    <button className="button register-form-randomize-username-button" type="button" onClick={function(){RandomizeUsername()}}>Randomize!</button>
                                </div>
                                
                                <TextInput selectorClass="login-input" containerType="field" inputType="email" inputName="email" inputLabel={tr("accountPages.editEmail")} inputValue={newUser.email} require={true} inputFunc={handleNewUser} />
                                <TextInput selectorClass="login-input" containerType="field" inputType="password" inputName="password" inputLabel={tr("accountPages.editPassword")} inputValue={newUser.password} require={true} inputFunc={handleNewUser} />

                                {
                                    currentUser.password!==newUser.password &&
                                    <TextInput selectorClass="login-input" containerType="field" inputType="password" inputName="confirmPassword" inputLabel={tr("accountPages.confirmPassword")} inputValue={confirmPassword} require={true} inputFunc={HandleconfirmPassword} />

                                }
                            </div>
                        </div>
                        {
                            warning !== "" &&
                            <p className="login-form-warning" onAnimationEnd={ResetWarningAnimation} ref={warningElement} animate="true">{warning}</p>
                        }
                        <input className="button login-form-submit" type="submit" value="Save Changes" disabled={readyToSubmit(RegisterForm)} />
                    </form>
                    : <div className="blog-empty-label flex-center"><img src={require("../img/loading.png")} /></div>

                }
                <Link className="button back-button" to={prevPath || "/"}>Back</Link>

                {
                    avaterWindow &&
                    <div className="window-overlay flex-center">
                        <div className="register-avatar-options-container flex-column">
                            <h1>{tr("accountPages.userAvatar")}</h1>
                            <div className="register-avatar-top-row flex-row">
                                <div className="register-avatar-preview">
                                    <Avatar bgImg={avatar.bgImg} bgColor={avatar.bgColor} baseColor={avatar.baseColor} accImg={avatar.accImg} accColor={avatar.accColor} width={150} />
                                </div>
                                <div className="register-avatar-color-options-row flex-row">
                                    <input className="register-avatar-color-option" type="color" name={"bgColor"} value={avatar.bgColor} onChange={HandleAvatar} />
                                    <input className="register-avatar-color-option" type="color" name={"baseColor"} value={avatar.baseColor} onChange={HandleAvatar} />
                                    <input className="register-avatar-color-option" type="color" name={"accColor"} value={avatar.accColor} onChange={HandleAvatar} />
                                </div>
                            </div>
                            <div className="register-avatar-options-row flex-row">
                                <div className="register-avatar-image-options flex-row">
                                    {
                                        [...Array(bg).keys()].map((b)=>
                                        <button className="register-avatar-image-button flex-center" type="button" name="bgImg" value={b+1} style={{backgroundImage: 'url(' + require("../img/avatar/bg"+(b+1)+".png") + ')'}} onClick={function(event){HandleAvatar(event)}} key={"bg-option-"+b+1}></button>
                                        )
                                    }
                                    <button className="register-avatar-image-button flex-center" type="button" name="bgImg" value={0} onClick={function(event){HandleAvatar(event)}} key={"bg-option-0"}></button>
                                </div>
                            </div>
                            <div className="register-avatar-options-row flex-row">
                                <div className="register-avatar-image-options flex-row">
                                    {
                                        [...Array(acc).keys()].map((n)=>
                                        <button className="register-avatar-image-button flex-center" type="button" name="accImg" value={n+1} style={{backgroundImage: 'url(' + require("../img/avatar/a"+(n+1)+".png") + ')'}} onClick={function(event){HandleAvatar(event)}} key={"acc-option-"+n+1}></button>
                                        )
                                    }
                                    <button className="register-avatar-image-button flex-center" type="button" name="accImg" value={0} onClick={function(event){HandleAvatar(event)}} key={"acc-option-0"}></button>
                                </div>
                            </div>
                            <button className="button register-avatar-save-button flex-center" onClick={function(){setAvatarWindow(false)}}>{tr("post.save")}</button>
                        </div>
                    </div>
                }
            </div>
            <Footer />
        </div>
      );
}

export default EditProfilePage;