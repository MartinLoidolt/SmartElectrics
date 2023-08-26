import {StyleSheet, Text, View} from "react-native";
import {globals, globalStyles} from "../globals/globals";
import {
    getPriceStatisticsFromAwattarPrices,
    getSelectedDayFromAwattarPrices,
    getSelectedMonthFromAwattarPrices
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
            <View style={styles.statisticFirstRow}>
                <Text style={globalStyles.h1}>Stats</Text>
                <Text style={globalStyles.text}>Maximum:</Text>
                <Text style={globalStyles.text}>Minimum:</Text>
                <Text style={globalStyles.text}>Mittelwert:</Text>
            </View>
            <View style={styles.statisticRow}>
                <Text style={globalStyles.h1}>{props.selectedDate.toLocaleDateString("de-AT", {month: "long"})}</Text>
                <Text style={globalStyles.text}>{monthlyStatistics.max}</Text>
                <Text style={globalStyles.text}>{monthlyStatistics.min}</Text>
                <Text style={globalStyles.text}>{monthlyStatistics.avg}</Text>
            </View>
            <View style={styles.statisticRow}>
                <Text style={globalStyles.h1}>Heute</Text>
                <Text style={globalStyles.text}>{dailyStatistics.max}</Text>
                <Text style={globalStyles.text}>{dailyStatistics.min}</Text>
                <Text style={globalStyles.text}>{dailyStatistics.avg}</Text>
            </View>
            <View style={styles.statisticRow}>
                <Text style={globalStyles.h1}>Einheit</Text>
                <Text style={globalStyles.text}>{globals.priceUnit}</Text>
                <Text style={globalStyles.text}>{globals.priceUnit}</Text>
                <Text style={globalStyles.text}>{globals.priceUnit}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    statisticsContainer: {
        flex: 1,
        height: "100%",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    statisticFirstRow: {
        flex: 5,
        width: "100%",
        justifyContent: "space-evenly",
    },
    statisticRow: {
        flex: 4,
        width: "100%",
        justifyContent: "space-evenly",
    },
});