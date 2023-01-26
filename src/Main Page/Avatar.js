import "./MainPage.css"

function Avatar({bgImg,bgColor,baseColor,accImg,accColor})
{
    return (
        <div className="avatar-container">
            <div className="avatar-background flex-center"  style={{backgroundImage: bgImg > 0 && 'url(' + require("../img/avatar/bg"+bgImg+".png") + ')', backgroundColor: bgColor}}>
                <div className="avatar-base-shadow" style={{backgroundImage: 'url(' + require("../img/avatar/base.png") + ')'}}></div>
                <div className="avatar-base" style={{maskImage: 'url(' + require("../img/avatar/base.png") + ')', WebkitMaskImage: 'url(' + require("../img/avatar/base.png") + ')', backgroundColor: baseColor}}></div>
                <div className="avatar-accessory-shadow" style={{backgroundImage: accImg > 0 && 'url(' + require("../img/avatar/a"+accImg+".png")}}></div>
                <div className="avatar-accessory" style={{backgroundImage: accImg > 0 && 'url(' + require("../img/avatar/a"+accImg+".png"), WebkitMaskImage: accImg > 0 && 'url(' + require("../img/avatar/a"+accImg+".png"), backgroundColor: accImg > 0 ? accColor : "transparent"}}></div>
            </div>
        </div>

    )
}

export default Avatar;