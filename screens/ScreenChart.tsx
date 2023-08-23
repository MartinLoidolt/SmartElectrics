import { useEffect, useState } from "react";
import {
  awattarPrice,
} from "../backend/interfaces";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Button } from "@rneui/base";
import { colorPrimary } from "../globals/colors";
import PriceChart from "../components/PriceChart";
import {StyleGuidelines} from "../globals/globals";
import {
  loadAwattarPricesWithTimeRange,
  getSelectedDayFromAwattarPrices, getTimeRangeFromAwattarPrices,
  mapAwattarPricesToChartPrices
} from "../backend/functions";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import PriceStatistics from "../components/PriceStatistics";

const flexSizes = {
  header: 1,
  chartContainer: 5,
  chartDate: 1,
  chart: 5,
  stats: 3,
};

export default function () {
  const [awattarPrices, setAwattarPrices] = useState<awattarPrice[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const insets = useSafeAreaInsets();

  async function fetchData() {
    setAwattarPrices(await loadAwattarPricesWithTimeRange(selectedDate, awattarPrices));
  }

  function getMaximumDate(): Date {
    const currentDate = new Date();

    if(currentDate.getHours() < 17) {
      return currentDate;
    } else {
      return new Date(currentDate.setDate(currentDate.getDate() + 1));
    }
  }

function isForwardButtonDisabled() {

    const currentDate = new Date();

    if(selectedDate.toDateString() === currentDate.toDateString() &&  currentDate.getHours() < 17) {
      return true;
    }

    return selectedDate.getUTCDate() !== currentDate.getUTCDate() && selectedDate > currentDate;


}

  async function changeDate(action: string, date?: Date) {
    if (action == "backward") {
      setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
    } else if (action == "forward") {
      setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)));
    } else if (action == "picker" && date) {
      setSelectedDate(date);
    }

    if(selectedDate < getTimeRangeFromAwattarPrices(awattarPrices)?.startTimeStamp || selectedDate > getTimeRangeFromAwattarPrices(awattarPrices)?.endTimeStamp) {
      await fetchData();
    }
  }

  useEffect(() => {
    fetchData().catch(console.error);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text>Icons</Text>
      </View>
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          <PriceChart
            height={
              ((((Dimensions.get("window").height -
                2 * StyleGuidelines.appMargin -
                insets.top -
                insets.bottom -
                80) /
                (flexSizes.header +
                  flexSizes.chartContainer +
                  flexSizes.stats)) *
                flexSizes.chartContainer) /
                (flexSizes.chartDate + flexSizes.chart)) *
              flexSizes.chart
            }
            prices={mapAwattarPricesToChartPrices(getSelectedDayFromAwattarPrices(awattarPrices, selectedDate))}
          />
        </View>
        <View style={styles.chartDate}>
          <Button
              color={colorPrimary}
              icon={{ name: "chevron-left", type: "font-awesome-5", size: 15 }}
              onPress={() => {
                changeDate("backward");
              }}
          />
          <RNDateTimePicker
              value={selectedDate}
              minimumDate={new Date(2013,11,21)}
              maximumDate={getMaximumDate()}
              onChange={(event, date) => {
                console.log("ONCHANGE");
                if(date) {
                  changeDate("picker", date);
                }
              }}

          />
          <Button
              color={colorPrimary}
              icon={{ name: "chevron-right", type: "font-awesome-5", size: 15 }}
              disabled={isForwardButtonDisabled()}
              onPress={() => {
                changeDate("forward");
              }}
          />
        </View>
      </View>
      <View style={styles.statistics}>
        <PriceStatistics awattarPrices={awattarPrices} selectedDate={selectedDate}/>
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
    flex: flexSizes.header,
  },
  chartContainer: {
    flex: flexSizes.chartContainer,
    zIndex: 1,
  },
  chartDate: {
    flex: flexSizes.chartDate,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    zIndex: 2,
  },
  chart: {
    flex: flexSizes.chart,
    width: "100%",
    justifyContent: "flex-end",
    zIndex: 1,
  },
  statistics: {
    flex: flexSizes.stats,
    width: "100%"
  },
});
