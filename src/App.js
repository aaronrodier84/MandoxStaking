import React, {useState} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Stake from './Components/Stake';
import Home from './Components/Home';
import Header from "./Components/Header";
import {connect, Provider} from 'react-redux';
import store from './Redux/store';
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";
import {ToastContainer} from "react-toastify";
import {Spin} from "antd";
// import 'antd/dist/antd.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const override = `
  position: absolute;
  margin: auto;
  border-color: red;
  opacity: 0.7;
  z-index: 1;
`;
  return (
    <Provider store={store}>
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <div className="main">
        {/*<Spin spinning={isLoading} size="large">*/}

          <div className="container">

            <Router>
              <Header/>
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="stake" element={<Stake setIsLoading={setIsLoading}/>}/>
              </Routes>
              <Contact/>
              <Footer/>
              <ToastContainer autoClose={5000} hideProgressBar/>


            </Router>
          </div>
        {/*</Spin>*/}

      </div>

    </Provider>
  );
}

export default App;
