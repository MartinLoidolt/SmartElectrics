import { Dimensions, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { LineChart } from "react-native-gifted-charts";
import { Button } from "@rneui/base";

import { loadPrices } from "./backend/apiCalls";
import {
  awattarPrice,
  chartPrice,
  priceStatistics,
} from "./backend/interfaces";
import { colorPrimary } from "./globals/colors";
import { StyleGuidelines } from "./globals/globals";

export default function App() {
  const [prices, setPrices] = useState<chartPrice[]>([]);
  const [priceStatistics, setPriceStatistics] = useState<priceStatistics>({
    max: 0,
    min: 0,
    hasNegativePrice: false,
  });
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const chartYAxisLabelWidth = 30;

  async function fetchData() {
    const awattarPrices: awattarPrice[] = await loadPrices(
      currentDate.setHours(0, 0, 0, 0),
      currentDate.setHours(23, 59, 59, 9999) + 1
    );

    const chartPrices: chartPrice[] = awattarPrices.map((awattarPrice) => {
      return {
        value: awattarPrice.marketprice / 10, //to make Eur/MWh to c/kWh
        label: awattarPrice.start_timestamp + "",
        labelComponent: () => {},
      };
    });

    let min = Math.min(...chartPrices.map((price) => price.value));
    let max = Math.max(...chartPrices.map((price) => price.value));

    setPriceStatistics({
      min: min,
      max: max,
      hasNegativePrice: min < 0,
    });

    setPrices(chartPrices);
  }

  function changeDate(action: string) {
    if (action == "backward") {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
    } else if (action == "forward") {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
    }

    fetchData().catch(console.error);
  }

  useEffect(() => {
    setCurrentDate(new Date());
    fetchData().catch(console.error);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text>Icons</Text>
      </View>
      <View style={styles.chartContainer}>
        <View style={styles.chartDate}>
          <Button
            color={colorPrimary}
            icon={{ name: "chevron-left", type: "font-awesome-5", size: 15 }}
            onPress={() => {
              changeDate("backward");
            }}
          />
          <Text>{currentDate.toLocaleDateString()}</Text>
          <Button
            color={colorPrimary}
            icon={{ name: "chevron-right", type: "font-awesome-5", size: 15 }}
            onPress={() => {
              changeDate("forward");
            }}
          />
        </View>
        <View style={styles.chart}>
          {prices.length != 0 ? (
            <LineChart
              data={prices}
              curved
              width={
                Dimensions.get("window").width -
                2 * StyleGuidelines.appMargin -
                chartYAxisLabelWidth
              }
              initialSpacing={0}
              adjustToWidth
              thickness={3}
              color={colorPrimary}
              disableScroll
              hideDataPoints
              showVerticalLines={false}
              yAxisThickness={0}
              xAxisThickness={0}
              yAxisOffset={Math.floor(priceStatistics.min) - 1}
              yAxisLabelWidth={chartYAxisLabelWidth}
            />
          ) : (
            <Text>NO DATA FOUND</Text>
          )}
        </View>
      </View>
      <View style={styles.statistics}>
        <Text>Stats</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: StyleGuidelines.appMargin,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flex: 1,
  },
  chartContainer: {
    flex: 5,
    width: "100%",
  },
  chartDate: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    zIndex: 1,
  },
  chart: {
    flex: 5,
    width: "100%",
  },
  statistics: {
    flex: 2,
  },
});
