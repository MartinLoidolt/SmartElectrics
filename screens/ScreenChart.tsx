import {useEffect, useState} from "react";
import {
    awattarPrice,
} from "../backend/interfaces";
import images from "../assets/images";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import {Button} from "@rneui/base";
import {colorBlack, colorPrimary, colorWhite} from "../globals/colors";
import PriceChart from "../components/PriceChart";
import {globalStyles, StyleGuidelines} from "../globals/globals";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
    loadAwattarPricesWithTimeRange,
    getSelectedDayFromAwattarPrices, getTimeRangeFromAwattarPrices,
    mapAwattarPricesToChartPrices
} from "../backend/functions";
import PriceStatistics from "../components/PriceStatistics";
import { Image, ImageContentPosition } from "expo-image";

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
    const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);

    const insets = useSafeAreaInsets();

    async function fetchData() {
        setAwattarPrices(await loadAwattarPricesWithTimeRange(selectedDate, awattarPrices));
    }

    function getMaximumDate(): Date {
        const currentDate = new Date();

        if (currentDate.getHours() < 17) {
            return currentDate;
        } else {
            return new Date(currentDate.setDate(currentDate.getDate() + 1));
        }
    }

    function isForwardButtonDisabled() {

        const currentDate = new Date();

        if (selectedDate.toDateString() === currentDate.toDateString() && currentDate.getHours() < 17) {
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

        let timeRange = getTimeRangeFromAwattarPrices(awattarPrices);

        if (timeRange) {
            if (selectedDate.getTime() < timeRange?.startTimeStamp || selectedDate.getTime() > timeRange?.endTimeStamp) {
                await fetchData();
            }
        }

    }

    useEffect(() => {
        fetchData().catch(console.error);
    }, []);

    return (
        <SafeAreaView style={styles.noDataFoundContainer}>
            <View style={styles.header}>
                <View style={styles.headerLogoView}>
                    <Image
                        style={styles.headerLogo}
                        contentPosition={"top left"}
                        source={images.logo}
                        contentFit="contain"
                    />
                </View>
                <View style={styles.headerTextView}>
                    <Text style={styles.headerText}>Charts</Text>
                </View>
                <View style={styles.headerSettingsButtonView}>
                    <Button
                            type={"clear"}
                            buttonStyle={{padding: 0, margin: 0, paddingHorizontal: 0, borderRadius: 0, alignSelf: "flex-end"}}
                            icon={{name: "settings-outline", type: "ionicon", size: 32, color: colorBlack, containerStyle: {alignContent: "flex-end"}}}
                            onPress={() => {
                                
                            }}
                        />
                </View>
            </View>
            <View style={styles.chartContainer}>
                <View style={styles.chart}>
                    <PriceChart
                        height={
                            ((((Dimensions.get("window").height -
                                            StyleGuidelines.marginTop + StyleGuidelines.marginBottom -
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
                        buttonStyle={styles.button}
                        radius={StyleGuidelines.buttonRadius}
                        icon={{name: "chevron-left", type: "font-awesome-5", size: 15, color: colorWhite}}
                        onPress={() => {
                            changeDate("backward");
                        }}
                    />
                    <Button
                        size="md"
                        buttonStyle={styles.dateButton}
                        titleStyle={styles.dateTitle}
                        type="outline"
                        radius={StyleGuidelines.buttonRadius}
                        title={selectedDate.toLocaleDateString("de-AT", {dateStyle: "long", month: "long"})}
                        onPress={() => {
                            setIsDatePickerVisible(true);
                        }}
                    />
                    <Button
                        size="md"
                        buttonStyle={styles.dateButton}
                        titleStyle={styles.dateTitle}
                        type="outline"
                        radius={StyleGuidelines.buttonRadius}
                        title={"Täg."}
                        onPress={() => {
                            setIsDatePickerVisible(true);
                        }}
                    />
                    <DateTimePickerModal
                        date={selectedDate}
                        isVisible={isDatePickerVisible}
                        minimumDate={new Date(2013, 11, 21)}
                        maximumDate={getMaximumDate()}
                        mode="date"
                        display="inline"
                        accentColor={colorPrimary}
                        onConfirm={(date: Date) => {
                            if (date) {
                                changeDate("picker", date);
                            }
                            setIsDatePickerVisible(false);
                        }}
                        onCancel={() => {
                            setIsDatePickerVisible(false);
                        }}
                    />
                    <Button
                        color={colorPrimary}
                        buttonStyle={styles.button}
                        radius={StyleGuidelines.buttonRadius}
                        icon={{name: "chevron-right", type: "font-awesome-5", size: 15, color: colorWhite}}
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
    noDataFoundContainer: {
        marginTop: StyleGuidelines.marginTop,
        marginBottom: StyleGuidelines.marginBottom,
        marginHorizontal: StyleGuidelines.marginHorizontal,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        flex: flexSizes.header,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    headerLogoView: {
        flex: 2,
    },
    headerLogo: {
        flex: 1,
    },
    headerTextView: {
        flex: 7,
        alignItems: "center"
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 24
    },
    headerSettingsButtonView: {
        flex: 2,
        //marginTop: -8,
    },
    chartContainer: {
        flex: flexSizes.chartContainer,
        width: "100%",
        zIndex: 1,
    },
    chartDate: {
        flex: flexSizes.chartDate,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 2,
    },
    chart: {
        flex: flexSizes.chart,
        width: "100%",
        justifyContent: "flex-start",
        overflow: "hidden"
    },
    statistics: {
        flex: flexSizes.stats,
        width: "100%"
    },
    button: {
        height: 45,
        width: 45,
    },
    dateButton: {
        height: 45,
        borderWidth: 2,
        borderColor: colorPrimary
    },
    dateTitle: {
        color: colorPrimary
    }
});
