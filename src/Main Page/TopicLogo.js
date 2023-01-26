import "./MainPage.css";
import "./logo.css";

function TopicLogo({topicLogo})
{
    return (
        <div className="topic-logo-container">    
            <div className="topic-logo-background flex-center" style={{backgroundImage: 'url(' + require("../img/topic-logo/bg" + topicLogo.bgImg + ".png") + ')', backgroundColor: topicLogo.bgColor}}>
                <div className="topic-logo-foreground-shadow" style={{backgroundImage: 'url(' + require("../img/topic-logo/fg" + topicLogo.fgImg + ".png") + ')'}}></div>
                <div className="topic-logo-foreground" style={{maskImage: 'url(' + require("../img/topic-logo/fg" + topicLogo.fgImg + ".png") + ')', WebkitMaskImage: 'url(' + require("../img/topic-logo/fg" + topicLogo.fgImg + ".png") + ')', backgroundColor: topicLogo.fgColor}}></div>
            </div>
        </div>
    )
}

export default TopicLogo;