import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App/App.js';
import { remote } from 'electron';
const { windowType } = remote.getCurrentWindow();

const AppWrapper = () => {
  if (windowType === "auth") return (
      <div className="something">
          <h1>App</h1>
      </div>
  );
  return <App />;
}

ReactDOM.render(<AppWrapper />, document.getElementById('app'));