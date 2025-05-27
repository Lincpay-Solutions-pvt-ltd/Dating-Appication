import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import store from "./Redux/store";
import App from "./app";

export default function Layout() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
