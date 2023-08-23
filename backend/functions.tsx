import {awattarPrice, chartPrice, priceStatistics, timeRange} from "./interfaces";
import {loadPrices} from "./apiCalls";

export function mapAwattarPricesToChartPrices(awattarPrices: awattarPrice[]): chartPrice[] {
    return awattarPrices.map((awattarPrice) => {
        return {
            value: (awattarPrice.marketprice),
            label:
                new Date(awattarPrice.start_timestamp).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                }) +
                " - " +
                new Date(awattarPrice.end_timestamp).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            labelComponent: () => {},
        };
    });
}

export function mapAwattarPriceToUnit(price: number): number {

    console.log(price);

    return Math.round((price / 10) * 100 * 1.2 + 14.4) / 100;
}

export function getPriceStatisticsFromAwattarPrices(awattarPrices: awattarPrice[]): priceStatistics {
    let max = Math.max(...awattarPrices.map(value => value.marketprice));
    let min = Math.min(...awattarPrices.map(value => value.marketprice));
    let sum = 0;

    awattarPrices.forEach(value => sum += value.marketprice);

    let avg = sum / awattarPrices.length;

    return {
        max: max,
        min: min,
        avg: avg
    };
}

export function getTimeRangeOfSelectedMonth(selectedDate: Date): timeRange {
    let monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1, 0,0,0,0).getTime();
    let monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23,59,59,999).getTime();

    return {startTimeStamp: monthStart, endTimeStamp: monthEnd};
}

export function getSelectedMonthFromAwattarPrices(awattarPrices: awattarPrice[], selectedDate: Date): awattarPrice[] {
    const selectedMonthTimeRange = getTimeRangeOfSelectedMonth(selectedDate);

    const currentMonthPrices = awattarPrices.filter(awattarPrice => {
        return awattarPrice.start_timestamp >= selectedMonthTimeRange.startTimeStamp && awattarPrice.end_timestamp <= selectedMonthTimeRange.endTimeStamp;
    });

    console.log(currentMonthPrices);

    return currentMonthPrices;
}

export function getSelectedDayFromAwattarPrices(awattarPrices: awattarPrice[], selectedDate: Date): awattarPrice[] {
    const currentDayStart = selectedDate.setHours(0,0,0,0);
    const currentDayEnd = selectedDate.setHours(23,59,59,999) + 1;

    const currentDayPrices = awattarPrices.filter(awattarPrice => {
        return awattarPrice.start_timestamp >= currentDayStart && awattarPrice.end_timestamp <= currentDayEnd;
    });

    return currentDayPrices;
}

export async function loadAwattarPricesWithTimeRange(selectedDate: Date, awattarPrices: awattarPrice[]): Promise<awattarPrice[]> {
    const currentDate = new Date();
    const loadedTimeRange = getTimeRangeFromAwattarPrices(awattarPrices);

    if (!loadedTimeRange) {
        let firstDateOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1, 0, 0, 0, 0);
        let tomorrow = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1, 23, 59, 59, 999);

        newAwattarPrices = await loadPrices(firstDateOfMonth.getTime(), tomorrow.getTime());

        return newAwattarPrices;
    }

    const loadedTimeRangeStart = new Date(loadedTimeRange.startTimeStamp);
    const loadedTimeRangeEnd = new Date(loadedTimeRange.endTimeStamp);

    let newAwattarPrices: awattarPrice[];

    if (selectedDate.getTime() < new Date(loadedTimeRangeStart.getFullYear(), loadedTimeRangeStart.getMonth() - 1, loadedTimeRangeStart.getDate()).getTime() ||
        selectedDate.getTime() > new Date(loadedTimeRangeEnd.getFullYear(), loadedTimeRangeEnd.getMonth() + 1, loadedTimeRangeEnd.getDate()).getTime()
    ) {

        let firstDateOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1, 0, 0, 0, 0);
        let lastDateOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);

        newAwattarPrices = await loadPrices(
            firstDateOfMonth.getTime(),
            lastDateOfMonth.getTime()
        );

    } else {

        console.log("IN HINZUFÜGEN");

        if (selectedDate.getTime() < loadedTimeRangeStart) {
            let firstDateOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1, 0, 0, 0, 0);

            newAwattarPrices = await loadPrices(
                firstDateOfMonth.getTime(),
                loadedTimeRangeStart.getTime()
            );

            newAwattarPrices = newAwattarPrices.concat(awattarPrices);

        } else {
            if (selectedDate.getTime() > loadedTimeRangeEnd) {
                let lastDateOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);

                newAwattarPrices = await loadPrices(
                    loadedTimeRangeEnd.getTime(),
                    lastDateOfMonth.getTime()
                );

                newAwattarPrices = awattarPrices.concat(newAwattarPrices);
            }
        }
    }

    return newAwattarPrices;
}

export function getTimeRangeFromAwattarPrices(awattarPrices: awattarPrice[]): timeRange | null {
    let min;
    let max;

    if(awattarPrices.length <= 0) {
        return null;
    }

    min = Math.min(...awattarPrices.map(value => value.start_timestamp));
    max = Math.max(...awattarPrices.map(value => value.end_timestamp));

    const timeRange: timeRange = {
        startTimeStamp: min,
        endTimeStamp: max
    }

    return timeRange;
}
