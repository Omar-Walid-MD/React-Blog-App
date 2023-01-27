import { useEffect, useRef, useState } from "react";


function PopUp({popup, setPopUps})
{
    const [once,setOnce] = useState(true);

    function removePopUp()
    {
        console.log("removed");
        setPopUps(popUps => popUps.filter((popUp)=>popUp.id!==popup.id));
    }

    useEffect(()=>{

        if(once)
        {
            setPopUps(prev => prev.map((p)=> p.id!==popup.id ? ({...p,active: !p.active}) : p));
            setOnce(false);
            setPopUps(prev => prev.map((p)=> p.id===popup.id ? {...p,active: !p.active} : p));
            setTimeout(() => {
                setPopUps(prev => prev.map((p)=> p.id===popup.id ? {...p,active: !p.active} : p));
            }, 5000);
        }
    })

    return (
        <div className="popup flex-center" active={popup.active ? "true" : "false"} onTransitionEnd={function(){if(!popup.active)removePopUp();}}>
            <p className="popup-text">{popup.text}</p>
        </div>
    )
}
function PopUpContainer({popUps,setPopUps})
{
    

    return (
        <div className="popup-container flex-center">
        {
            popUps.map((popup)=>
            <PopUp popup={popup} setPopUps={setPopUps} key={popup.id} />)
        }
        </div>
    )
}

export default PopUpContainer;