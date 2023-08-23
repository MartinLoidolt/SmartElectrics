import { Dimensions, StyleSheet, Text } from "react-native";
import { StyleGuidelines } from "../globals/globals";
import {
  chartPrice,
  priceStatistics,
} from "../backend/interfaces";
import {
  colorBlack,
  colorPrimary,
  colorWhite,
} from "../globals/colors";
import {
  LineChart,
} from "react-native-gifted-charts/src/index";
import PointerComponent from "./PointerComponent";
import PointerLabelComponent from "./PointerLabelComponent";

type priceChartProps = {
  height: number;
  prices: chartPrice[];
  priceStatistics: priceStatistics;
};

export default function (props: priceChartProps) {
  if (props.prices.length <= 0) {
    return <Text>No Data Found</Text>;
  }

  return positiveChart(props);
/*
  if (!props.priceStatistics.hasNegativePrice) {
    return positiveChart(props);
  } else {
    return negativeChart(props);
  }

 */
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorWhite,
    width: 10,
    height: 10,
    borderColor: colorBlack,
    borderWidth: 1,
    borderRadius: 5,
  },
    yAxisLabelContainer: {
        justifyContent: "flex-start"
    },
});

function calculateChartWidth() {
  return Math.trunc(
    Dimensions.get("window").width -
      2 * StyleGuidelines.appMargin -
      2 * StyleGuidelines.chartInitialSpacingStartEnd -
      StyleGuidelines.chartYAxisLabelWidth -
      2
  );
}

function positiveChart(props: priceChartProps) {
  return (
    <LineChart
      data={props.prices}
      height={props.height}
      width={calculateChartWidth()}
      adjustToWidth
      initialSpacing={StyleGuidelines.chartInitialSpacingStartEnd}
      endSpacing={StyleGuidelines.chartInitialSpacingStartEnd}
      disableScroll
      curved
      noOfSections={7}
      areaChart
      color={colorPrimary}
      startFillColor={colorPrimary}
      hideDataPoints
      showVerticalLines={false}
      yAxisThickness={0}
      xAxisThickness={0}
      thickness={3}
      yAxisLabelWidth={StyleGuidelines.chartYAxisLabelWidth}
      yAxisLabelContainerStyle={styles.yAxisLabelContainer}
      pointerConfig={{
        radius: 5,
        pointerColor: colorWhite,
        pointerLabelWidth: 150,
        pointerComponent: () => {
          return <PointerComponent />;
        },
        showPointerStrip: false,
        //autoAdjustPointerLabelPosition: true,
        pointerLabelComponent: (items: chartPrice[]) =>
          PointerLabelComponent(items),
      }}
    />
  );
}

function negativeChart(props: priceChartProps) {
  return (
    <LineChart
      areaChart
      data={props.prices}
      height={
        ((props.priceStatistics.max - props.priceStatistics.avg) /
          (props.priceStatistics.max - props.priceStatistics.min)) *
        props.height
      }
      width={calculateChartWidth()}
      adjustToWidth
      initialSpacing={StyleGuidelines.chartInitialSpacingStartEnd}
      endSpacing={StyleGuidelines.chartInitialSpacingStartEnd}
      disableScroll
      curved
      noOfSections={Math.round(
        ((props.priceStatistics.max - props.priceStatistics.avg) /
          (props.priceStatistics.max - props.priceStatistics.min)) *
          7
      )}
      noOfSectionsBelowXAxis={Math.round(
        ((props.priceStatistics.avg - props.priceStatistics.min) /
          (props.priceStatistics.max - props.priceStatistics.min)) *
          7
      )}
      color={colorPrimary}
      startFillColor={colorPrimary}
      hideDataPoints
      showVerticalLines={false}
      yAxisThickness={0}
      xAxisThickness={0}
      thickness={3}
      yAxisLabelWidth={StyleGuidelines.chartYAxisLabelWidth}
      pointerConfig={{
        radius: 5,
        pointerColor: colorWhite,
        pointerLabelWidth: 150,
        pointerComponent: () => {
          return <PointerComponent />;
        },
        showPointerStrip: false,
        //autoAdjustPointerLabelPosition: true,
        pointerLabelComponent: (items: chartPrice[]) =>
          PointerLabelComponent(items),
      }}
    />
  );
}
