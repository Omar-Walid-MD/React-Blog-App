import "./logo.css";

function VectorIcon({selectorClass,imgPath})
{
    return (
        <div className="vector-icon-container flex-center">
            <div className="vector-icon-shadow" style={{backgroundImage: "url(" + (imgPath) + ")"}}></div>
            <div className={selectorClass + " vector-icon"}></div>
        </div>
    )
}

export default VectorIcon;