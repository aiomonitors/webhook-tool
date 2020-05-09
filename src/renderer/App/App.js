import React, { useEffect } from 'react';
import Form from '../Form/Form.js';
import Store from '../Store/MyStore';
import '../styles/App.css';

const App = () => {
  const store = Store.useStore();
  
  useEffect(() => {
    store.set("loading")(false)
  }, []);

  return (
    <div>
      <div className="heading">Webhook Sender</div>
      <Form />
      </div>
  )
}

export default App