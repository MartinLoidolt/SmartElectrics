import {StyleSheet} from "react-native";

export const globals = {
  priceUnit: "(Cent/kWh)",
  tax: 1.2,
  providerCost: 1.44, //in cent per kWh
};

export const StyleGuidelines = {
  marginTop: 20,
  marginBottom: 0,
  marginHorizontal: 25,
  chartYAxisLabelWidth: 25,
  chartInitialSpacingStartEnd: 8,
  buttonRadius: 14,
};

export const globalStyles = StyleSheet.create({
  h1: {
    fontWeight: "bold",
    fontSize: 18
  },
  text: {
    fontSize: 16
  }
});

