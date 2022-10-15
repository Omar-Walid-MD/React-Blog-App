import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import "./RegisterPage.css";

function RegisterPage({handleUserList})
{
    const navigate = useNavigate();

    const [newUser,setNewUser] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [confirmPassword,setConfirmPassword] = useState("");

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
                handleUserList(prevList => [...prevList,userToAdd])
            })
    
            navigate("/");
            return
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
            <div className="page-container flex-center">
                <form className="register-form-container flex-column" onSubmit={RegisterUser}>
                    <h1 className="register-form-label">Register New User</h1>
                    <div className="register-form-input-group flex-column">
                        <input className="register-form-input" type="text" placeholder="Enter Username" name="username" value={newUser.username} onChange={handleNewUser}/>
                        <input className="register-form-input" type="email" placeholder="Enter Email" name="email" value={newUser.email} onChange={handleNewUser}/>
                        <input className="register-form-input" type="password" placeholder="Enter Password" name="password" value={newUser.password} onChange={handleNewUser}/>
                        <input className="register-form-input" type="password" placeholder="Confirm Password" name="confirmPassword" value={confirmPassword} onChange={HandleconfirmPassword}/>
                    </div>
                    <input className="register-form-submit" type="submit" />
                </form>
            </div>
        </div>
      );
}

export default RegisterPage;