import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTwitterSquare, faInstagramSquare, faFacebookSquare} from "@fortawesome/free-brands-svg-icons"
import {faCopyright} from "@fortawesome/free-regular-svg-icons"
import {Link} from "react-router-dom"

export default function Footer(){

  return (
    <div className="footer fixed-bottom">
        <div className="navbar bg-dark text-white">
          <span><FontAwesomeIcon icon={faCopyright} />SuperCalendar</span> 
          <span>
            <Link>
              <FontAwesomeIcon color="white" size="2x" className="m-2" icon={faTwitterSquare} />
            </Link>
            <Link>
              <FontAwesomeIcon color="white" size="2x" className="m-2" icon={faInstagramSquare} />
            </Link>
            <Link>
              <FontAwesomeIcon color="white" size="2x" className="m-2" icon={faFacebookSquare} />
            </Link>
          </span>
        </div>
    </div>
  )
  
}