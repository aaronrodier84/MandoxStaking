import React from 'react'
import "./contact.css";
import im from "../Contact/discord.png"

const Contact = () => {
  return (

    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-12 col-10 mt-5">
          <div className="run2">
            <div className="collect-container2 ct-main mr-5 ml-5 mb-5">
              <div className="container ">
                <div className="row justify-content-md-between justify-content-center ">
                  <div className="col-md-4 col-8">
                    <div className='head2'>
                      <div className='text-md-start text-center'>
                        <h6>Customers Can Get Assistance,</h6>
                        <h6 className='mt-5'>Ask Questions on Discord</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-8 text-md-end text-center mt-md-0 mt-5">
                    <div className='head2'>
                      <p className='font-weight-bold'>Contact Us</p>
                      <a href="https://discord.com/channels/944681840822866020/944681841112264732" target="_blank"><img src={im} alt="" className='me-md-3 mt-2 img-fluid set' /></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact;
