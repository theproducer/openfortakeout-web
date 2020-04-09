import React from "react";

export default function BusinessEntry(props) {
    return (
        <article
            className="entry"
            onMouseOver={(e) => { props.onHover(props.entry); }}
            onMouseOut={(e) => { props.onOut(props.entry); }}            
            >
            {props.entry.closed === true ? <div className='closed'>Closed</div> : null}
            <header>
                <h1>{props.entry.name}</h1>
                <div className="distance"></div>
            </header>
            <div className="business_type">{props.entry.type}</div>  
            {props.entry.tags !== null ? 
            <div className="subtypes">
                {props.entry.tags.map((tag, index) => {
                    return (
                        <span key={index}>{tag}</span>
                    );
                })}
            </div> : null }
            <div className="address">
                {props.entry.address + " " + props.entry.address2}<br />
                {props.entry.city + ", " + props.entry.state + " " + props.entry.zipcode}
            </div>
            <div className="hours"><strong>Hours: </strong>{props.entry.hours}</div>
            <div className="contact">
            <div className="phone"><span className="icon"></span><a target="_blank" href={"tel:" + props.entry.phone}>{props.entry.phone}</a></div>
                {props.entry.url !== "" ?
                    <div className="web">
                        <span className="icon"></span><a target="_blank" href={props.entry.url}>Visit Website</a>
                    </div>
                    : null}                
            </div>
            <div className="details">{props.entry.details}</div>  
            <a target="_blank" href={"/corrections.html?id=" + props.entry.id} className="corrections">Is this outdated?  Submit a update</a>          
        </article>
    );
}