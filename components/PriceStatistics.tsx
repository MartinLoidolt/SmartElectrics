import {StyleSheet, Text, View} from "react-native";
import {globals, globalStyles} from "../globals/globals";
import {
    getPriceStatisticsFromNumberArray,
    getSelectedDayFromAwattarPrices,
    getSelectedMonthFromAwattarPrices
} from "../backend/functions";
import {awattarPrice, priceStatistics} from "../backend/interfaces";

type priceStatisticsProps = {
    awattarPrices: awattarPrice[];
    selectedDate: Date;
};

export default function (props: priceStatisticsProps) {

    const monthlyStatistics: priceStatistics = getPriceStatisticsFromNumberArray(getSelectedMonthFromAwattarPrices(props.awattarPrices, props.selectedDate).map(value => value.marketprice));
    const dailyStatistics: priceStatistics = getPriceStatisticsFromNumberArray(getSelectedDayFromAwattarPrices(props.awattarPrices, props.selectedDate).map(value => value.marketprice));

    return (
        <View style={styles.statisticsContainer}>
            <View style={styles.statisticRow}>
                <Text style={globalStyles.h1}>Stats</Text>
                <Text style={globalStyles.text}>Max:</Text>
                <Text style={globalStyles.text}>Min:</Text>
                <Text style={globalStyles.text}>Avg:</Text>
            </View>
            <View style={styles.statisticRow}>
                <Text
                    style={globalStyles.h1}>{props.selectedDate.toLocaleDateString("de-AT", {month: "long"})}</Text>
                <Text style={globalStyles.text}>{monthlyStatistics.max}</Text>
                <Text style={globalStyles.text}>{monthlyStatistics.min}</Text>
                <Text style={globalStyles.text}>{monthlyStatistics.avg}</Text>
            </View>
            <View style={styles.statisticRow}>
                <Text
                    style={globalStyles.h1}>{props.selectedDate.toLocaleDateString("de-AT", {dateStyle: "short"})}</Text>
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
    },
    statisticRow: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "space-evenly",
    },

});