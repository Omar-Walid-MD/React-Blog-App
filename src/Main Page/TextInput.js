import { useEffect } from "react";
import "./TextInput.css";


function TextInput({containerType,inputType="text",selectorClass,inputLabel,inputName="",inputValue,inputFunc,maxLength=0,required,minheight=0,onInput})
{
    // useEffect(()=>{
    //     console.log(inputValue==="");
    // })
    return (
        <div className={"text-input-container " + selectorClass}>
            {
                containerType==="field" ?
                <input className="text-input text-input-field" type={inputType} name={inputName} value={inputValue} required={required} onChange={inputFunc} autoComplete/>
                : containerType==="area" &&
                <textarea className="text-input text-input-area" type={inputType} minheight={minheight} value={inputValue} onChange={inputFunc} onInput={onInput}></textarea>
            }
            <div className="text-input-label">{inputLabel}</div>
        </div>
    )
}

export default TextInput;