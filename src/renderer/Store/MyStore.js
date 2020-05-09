import { createConnectedStore } from 'undux';

const initialState = {
    loading: true
}

export default createConnectedStore(initialState)