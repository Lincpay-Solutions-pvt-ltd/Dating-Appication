import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, Button } from "react-native";
import LoginScreen from "./loginPage";
import LayoutUI from "./_layout";
import ProfileScreen from "./main/profile";
import HeaderForm from "./components/header";

import { useSelector } from 'react-redux';
export default function Main() {

    const { isAuthenticated, user } = useSelector((state) => state.auth);
    return (
        <>
            {isAuthenticated ? <ProfileScreen/> : <LoginScreen />}
        </>
    );
}
