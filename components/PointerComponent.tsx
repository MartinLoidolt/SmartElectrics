import { StyleSheet, View } from "react-native";
import { colorPrimary, colorWhite } from "../globals/colors";

export default function () {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorWhite,
    width: 10,
    height: 10,
    borderColor: colorPrimary,
    borderWidth: 1,
    borderRadius: 5,
  },
});
