import {Dimensions, StyleSheet, Text, View} from "react-native";
import {globalStyles, StyleGuidelines} from "../globals/globals";
import {
    chartPrice,
    priceStatistics,
} from "../backend/interfaces";
import {
    colorBlack,
    colorPrimary,
    colorWhite,
} from "../globals/colors";
import {LineChart} from "react-native-gifted-charts";
import PointerComponent from "./PointerComponent";
import PointerLabelComponent from "./PointerLabelComponent";
import {useState} from "react";

type priceChartProps = {
    height: number;
    prices: chartPrice[];
};

type pointerProps = {
    pointerIndex: number,
    pointerX: number,
    pointerY: number
}

const flexSizes = {
    header: 1,
    chartContainer: 9
}

export default function (props: priceChartProps) {

    const [currentPointerProps, setCurrentPointerProps] = useState<pointerProps>();

    if (props.prices.length <= 0) {
        return (
            <View style={styles.noDataFoundContainer}>
                <Text style={globalStyles.h1}>No Data Found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={globalStyles.h1}>Aktueller Preis: {currentPointerProps?.pointerIndex}</Text>
            </View>
            <View style={styles.chartContainer}>
                <LineChart
                    data={props.prices}
                    height={(props.height / (flexSizes.header + flexSizes.chartContainer)) * flexSizes.chartContainer}
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
                            return <PointerComponent/>;
                        },
                        pointerLabelComponent: (items: chartPrice[]) =>
                            PointerLabelComponent(items),
                        showPointerStrip: false,
                        stripOverPointer: true,
                        autoAdjustPointerLabelPosition: true,
                    }}
                />
            </View>
        </View>
    );
    /*
      if (!props.priceStatistics.hasNegativePrice) {
        return positiveChart(props);
      } else {
        return negativeChart(props);
      }

     */
}

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
        <View></View>
    );
}

/*
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
 */

const styles = StyleSheet.create({
    noDataFoundContainer: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        flex: flexSizes.header
    },
    container: {
        flex: 1,
    },
    chartContainer: {
        flex: flexSizes.chartContainer
    },
    yAxisLabelContainer: {
        justifyContent: "flex-start"
    },
});
