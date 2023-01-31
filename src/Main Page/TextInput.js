import { useEffect, useState } from "react";
import "./TextInput.css";


function TextInput({containerType,inputType="text",selectorClass,inputLabel,inputName="",inputValue,inputFunc,maxLength=0,required,minheight=0,onInput})
{

    const [passwordVisible,setPasswordVisible] = useState(false);

    function handlePasswordVisible()
    {
        setPasswordVisible(prev => !prev);
    }

    return (
        <div className={"text-input-container " + selectorClass}>
            {
                containerType==="field" ?
                <input className="text-input text-input-field" type={inputType==="password" ? passwordVisible ? "text" : "password" : inputType} name={inputName} value={inputValue} required={required} onChange={inputFunc} autoComplete/>
                : containerType==="area" &&
                <textarea className="text-input text-input-area" type={inputType==="password" ? passwordVisible ? "text" : "password" : inputType} minheight={minheight} value={inputValue} onChange={inputFunc} onInput={onInput}></textarea>
            }
            <div className="text-input-label">{inputLabel}</div>
            {
                inputType==="password" &&
                <button className="text-input-toggle-password-button flex-center" type="button" onClick={handlePasswordVisible}>
                    {
                        passwordVisible ?
                        <i class='bx bx-show'></i>
                        : <i class='bx bx-hide'></i>
                    }
                </button>
            }
        </div>
    )
}

export default TextInput;