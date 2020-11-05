import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTwitterSquare, faInstagramSquare, faFacebookSquare} from "@fortawesome/free-brands-svg-icons"
import {faCopyright} from "@fortawesome/free-regular-svg-icons"
import {Link} from "react-router-dom"

export default function Footer(){

  return (
    <footer className="footer fixed-bottom carterOneFont">
        <div className="navbar bg-dark text-white">
          <span><FontAwesomeIcon icon={faCopyright} />SuperCalendar</span> 
          <span>
            <Link to="/">
              <FontAwesomeIcon color="white" size="2x" className="m-2" icon={faTwitterSquare} />
            </Link>
            <Link to="/">
              <FontAwesomeIcon color="white" size="2x" className="m-2" icon={faInstagramSquare} />
            </Link>
            <Link to="/">
              <FontAwesomeIcon color="white" size="2x" className="m-2" icon={faFacebookSquare} />
            </Link>
          </span>
        </div>
    </footer>
  )
  
}