import { Stack } from 'expo-router/stack';
import { Provider } from "react-redux";
import { StyleSheet, Platform, StatusBar } from "react-native";
import store from "./Redux/store";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
    return (
        <SafeAreaView style={styles.AndroidSafeArea}>
            <Provider store={store}>
                <Stack screenOptions={{ headerShown: false }} />
            </Provider>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    }
});