import {Dimensions, StyleSheet, Text, View} from "react-native";
import {globalStyles, StyleGuidelines} from "../globals/globals";
import {
    chartPrice, priceStatistics,
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
import {getPriceStatisticsFromNumberArray} from "../backend/functions";

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

function roundUpToNextMultipleOfTen(number: number) {
    const divided = number / 10;
    const roundedUp = Math.ceil(divided);
    const result = roundedUp * 10;
    return result;
}

function roundDownToNextMultipleOfNegativeTen(number: number) {
    const divided = number / -10;
    const roundedUp = Math.ceil(divided);
    const result = roundedUp * -10;
    return result;
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

    const priceStatistics: priceStatistics = getPriceStatisticsFromNumberArray(props.prices.map(value => value.value));
    const hasNegativePrices: boolean = props.prices.some(chartPrice => chartPrice.value < 0);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={globalStyles.h1}>Aktueller Preis: {currentPointerProps?.pointerIndex}</Text>
            </View>
            {hasNegativePrices ? negativeChart(props, priceStatistics) : positiveChart(props)}
        </View>
    );
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

function calculateChartHeight(props: priceChartProps) {
    return (props.height / (flexSizes.header + flexSizes.chartContainer)) * flexSizes.chartContainer;
}

function positiveChart(props: priceChartProps) {
    return (
        <View style={styles.chartContainer}>
            <LineChart
                data={props.prices}
                height={calculateChartHeight(props)}
                width={calculateChartWidth()}
                adjustToWidth
                initialSpacing={StyleGuidelines.chartInitialSpacingStartEnd}
                endSpacing={StyleGuidelines.chartInitialSpacingStartEnd}
                disableScroll
                curved
                noOfSections={5}
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
                    pointerLabelHeight: 100,
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
    );
}


function negativeChart(props: priceChartProps, priceStatistics: priceStatistics) {
    return (
        <View style={styles.chartContainer}>
            <LineChart
                data={props.prices}
                height={
                    ((priceStatistics.max - priceStatistics.avg) /
                        (priceStatistics.max - priceStatistics.min)) *
                    calculateChartHeight(props)
                }
                width={calculateChartWidth()}
                adjustToWidth
                initialSpacing={StyleGuidelines.chartInitialSpacingStartEnd}
                endSpacing={StyleGuidelines.chartInitialSpacingStartEnd}
                disableScroll
                curved
                areaChart
                noOfSections={4}
                noOfSectionsBelowXAxis={1}
                stepValue={5}
                stepHeight={(((priceStatistics.max - priceStatistics.avg) /
                        (priceStatistics.max - priceStatistics.min)) *
                    calculateChartHeight(props)) / 5}
                minValue={-10}
                maxValue={20}
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
                    pointerLabelHeight: 100,
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
    );
}


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


/*
OLD NEGATIVE CHART
 */

/*
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
                5
            )}
            noOfSectionsBelowXAxis={Math.round(
                ((props.priceStatistics.avg - props.priceStatistics.min) /
                    (props.priceStatistics.max - props.priceStatistics.min)) *
                5
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
                    return <PointerComponent/>;
                },
                showPointerStrip: false,
                //autoAdjustPointerLabelPosition: true,
                pointerLabelComponent: (items: chartPrice[]) =>
                    PointerLabelComponent(items),
            }}
        />
 */
