import { useEffect } from "react";
import "./TextInput.css";


function TextInput({type,selectorClass,inputLabel,inputName="",inputValue,inputFunc,maxLength=0,required,minheight=0,onInput})
{
    useEffect(()=>{
        console.log(inputValue==="");
    })
    return (
        <div className={"text-input-container " + selectorClass}>
            {
                type==="field" ?
                <input className="text-input text-input-field" type="text" name={inputName} value={inputValue} required={required} onChange={inputFunc} autoComplete/>
                : type==="area" &&
                <textarea className="text-input text-input-area" minheight={minheight} value={inputValue} onChange={inputFunc} onInput={onInput}></textarea>
            }
            <div className="text-input-label">{inputLabel}</div>
        </div>
    )
}

export default TextInput;