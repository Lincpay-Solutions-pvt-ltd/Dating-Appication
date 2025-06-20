import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, usePathname } from "expo-router";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import IoniconsIcons from "react-native-vector-icons/Ionicons";
import OcticonsIcons from "react-native-vector-icons/Octicons";
import EntypoIcons from "react-native-vector-icons/Entypo";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  // Helper to determine if a route is active
  const isActive = (route) => pathname === route;

  return (
    <View style={styles.container}>
      {/* Home */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.replace("../pages/home")}
      >
        <MaterialCommunityIcons
          style={styles.icon}
          name={isActive("/pages/home") ? "thumb-up" : "thumb-up-outline"}
          size={28}
          color={isActive("/pages/home") ? "#e91e63" : "#fff"}
        />
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>

      {/* Following */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("../pages/Following")}
      >
        <MaterialIcon
          style={styles.icon}
          name={isActive("/pages/Following") ? "person" : "person-outline"}
          size={28}
          color={isActive("/pages/Following") ? "#e91e63" : "#fff"}
        />
        <Text style={styles.footerText}>Following</Text>
      </TouchableOpacity>

      {/* Explore */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("../pages/explore")}
      >
        <IoniconsIcons
          style={styles.icon}
          name={isActive("/pages/explore") ? "search" : "search-outline"}
          size={28}
          color={isActive("/pages/explore") ? "#e91e63" : "#fff"}
        />
        <Text style={styles.footerText}>Explore</Text>
      </TouchableOpacity>

      {/* Reels / Moments */}
      {pathname === "/pages/reels" ? (
        <View style={styles.item}>
          <EntypoIcons style={styles.icon} name="folder-video" size={28} color="#e91e63" />
          <Text style={styles.footerText}>Moments</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push("../pages/reels")}
        >
          <OcticonsIcons
            style={styles.icon}
            name="video"
            size={28}
            color="#fff"
          />
          <Text style={styles.footerText}>Moments</Text>
        </TouchableOpacity>
      )}

      {/* Chat List */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("../pages/profile")}
      >
        <IoniconsIcons
          style={styles.icon}
          name={isActive("/pages/profile") ? "person-circle-sharp" : "person-circle-outline"}
          size={28}
          color={isActive("/pages/profile") ? "#e91e63" : "#fff"}
        />
        <Text style={styles.footerText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#000000A0",
    borderTopWidth: 1,
    borderTopColor: "#444",
  },
  item: {
    alignItems: "center",
  },
  icon: {
    marginBottom: 2,
  },
  footerText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});