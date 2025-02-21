import React, { useState } from "react";
import { Provider } from 'react-redux';
import store from '../Redux/store';
import Main from "./main";

export default function App() {
    return (
        <Provider store = {store}>
            <Main />
        </Provider>
    );
}
