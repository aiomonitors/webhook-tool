import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import App from './App/App.js';
import InputPage from './InputPage/Page';
import { remote } from 'electron';
const { windowType } = remote.getCurrentWindow();

import AOS from 'aos';
import 'aos/dist/aos.css';

const AppWrapper = () => {

  useEffect(() => {
    AOS.init()
  },[])

  if(windowType === "input") {
    return <InputPage />
  }
  return <App />
  
}

export default AppWrapper;