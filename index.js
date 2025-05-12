import { Stack } from "expo-router";
import { Provider } from 'react-redux';
import store from './Redux/store';

export default function Layout() {
  var express_1 = __importDefault(require("express"));
  var http_1 = __importDefault(require("http"));
  return (
    <Provider store={store}>
      <Stack />
    </Provider>

  );
}
