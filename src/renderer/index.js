import React from 'react';
import ReactDOM from 'react-dom';
import Store from './Store/MyStore';
import AppWrapper from './AppWrapper';

ReactDOM.render(
    <Store.Container>
        <AppWrapper />
    </Store.Container>, document.getElementById('app'));