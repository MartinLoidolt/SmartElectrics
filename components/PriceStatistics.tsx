import {StyleSheet, Text, View} from "react-native";
import {globals, globalStyles} from "../globals/globals";
import {
    getPriceStatisticsFromAwattarPrices,
    getSelectedDayFromAwattarPrices,
    getSelectedMonthFromAwattarPrices, mapAwattarPriceToUnit
} from "../backend/functions";
import {awattarPrice, priceStatistics} from "../backend/interfaces";

type priceStatisticsProps = {
    awattarPrices: awattarPrice[];
    selectedDate: Date;
};

export default function(props: priceStatisticsProps) {

    const monthlyStatistics: priceStatistics = getPriceStatisticsFromAwattarPrices(getSelectedMonthFromAwattarPrices(props.awattarPrices, props.selectedDate));
    const dailyStatistics: priceStatistics = getPriceStatisticsFromAwattarPrices(getSelectedDayFromAwattarPrices(props.awattarPrices, props.selectedDate));

    return (
        <View style={styles.statisticsContainer}>
            <View style={styles.statisticsMonthly}>
                <Text style={globalStyles.h1}>{props.selectedDate.toLocaleDateString("de-AT", {month: "long"})} {globals.priceUnit}</Text>
                <Text>Max: {mapAwattarPriceToUnit(monthlyStatistics.max)}</Text>
                <Text>Min: {mapAwattarPriceToUnit(monthlyStatistics.min)}</Text>
                <Text>Avg: {mapAwattarPriceToUnit(monthlyStatistics.avg)}</Text>
            </View>
            <View style={styles.statisticsToday}>
                <Text style={globalStyles.h1}>Heute {globals.priceUnit}</Text>
                <Text>Max: {mapAwattarPriceToUnit(dailyStatistics.max)}</Text>
                <Text>Min: {mapAwattarPriceToUnit(dailyStatistics.min)}</Text>
                <Text>Avg: {mapAwattarPriceToUnit(dailyStatistics.avg)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    statisticsContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    statisticsMonthly: {
        width: "100%",
        flex: 1,
    },
    statisticsToday: {
        width: "100%",
        flex: 1,
    }
});