import React from 'react'
import "./footer.css"
const Footer = () => {
  return (
    <div className="container">
      <div className="row justify-content-between mt-5">
        <div className="col-md-4 col-5 footer-text mt-5">
          <p className='text-start'> ©2022 - MANDOX - The Lacedameon </p>
        </div>
        <div className="col-md-4 col-5 footer-text mt-5">
          <p className='text-end'>
            #Militia We Stand
          </p>
        </div>
      </div>
    </div>
  )
}
export default Footer;
