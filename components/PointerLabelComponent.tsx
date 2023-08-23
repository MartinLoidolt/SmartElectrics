import { StyleSheet, Text, View } from "react-native";
import {globals} from "../globals/globals";
import { chartPrice } from "../backend/interfaces";
import { colorWhite } from "../globals/colors";
import {mapAwattarPriceToUnit} from "../backend/functions";

export default function (items: chartPrice[]) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{items[0].label}</Text>
      <Text style={styles.text}>
        {mapAwattarPriceToUnit(items[0].value) + globals.priceUnit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorWhite,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6.3,
    zIndex: 1,
  },
  text: { textAlign: "center" },
});
