import { View, Text, Button, StyleSheet } from "react-native";
import { login2, logout2 } from '../../Redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import HeaderForm from "../components/header";
import Footer from "../components/footer";
import VideoList from "../components/ProductCard";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  return (
    <>
      <View>
        <HeaderForm />
      </View>
      <View style={styles.container}>
        {/* <Button style={styles.button} title="Logout" onPress={() => dispatch(logout2())} /> */}
        <VideoList />
      </View>
      <View>
        <Footer />
      </View>
    </>
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
});