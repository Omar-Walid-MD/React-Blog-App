import "./MainPage.css"

function TopicLogo({bgImg,bgColor,fgImg,fgColor,width})
{
    function GetBorderWidth(width)
    {
        console.log("width: " + width)
        return width/20 + "px";
    }
    return (
        <div className="topic-logo-background flex-center" style={{backgroundImage: 'url(' + require("../img/topic-logo/bg" + bgImg + ".png") + ')', backgroundColor: bgColor, width: width + "px", borderWidth: GetBorderWidth(width)}}>
            <div className="topic-logo-foreground-shadow" style={{backgroundImage: 'url(' + require("../img/topic-logo/fg" + fgImg + ".png") + ')'}}></div>
            <div className="topic-logo-foreground" style={{maskImage: 'url(' + require("../img/topic-logo/fg" + fgImg + ".png") + ')', WebkitMaskImage: 'url(' + require("../img/topic-logo/fg" + fgImg + ".png") + ')', backgroundColor: fgColor}}></div>
        </div>

    )
}

export default TopicLogo;