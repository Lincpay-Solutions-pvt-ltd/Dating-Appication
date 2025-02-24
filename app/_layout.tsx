import { Stack } from 'expo-router/stack';
import { Provider } from "react-redux";
import store from "./Redux/store";

export default function Layout() {
    return (
        <Provider store={store}>
            <Stack screenOptions={{ headerShown: false }} />
        </Provider>
    );
}
