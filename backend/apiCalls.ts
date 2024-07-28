import {awattarPrice, awattarResponse} from "./interfaces";
import {globals} from "../globals/globals";

export async function loadPrices(startTimestamp: number, endTimestamp: number) {
    let response = await fetch(`https://api.awattar.at/v1/marketdata?start=${startTimestamp}&end=${endTimestamp}`);
    let responseObject: awattarResponse = await response.json();

    let awattarPrices: awattarPrice[] = responseObject.data;

    let mappedAwattarPrices: awattarPrice[] = awattarPrices.map(value => {
        return {
            marketprice: Math.round((value.marketprice / 10) * 100 * globals.tax + globals.providerCost * 100) / 100,
            unit: globals.priceUnit,
            start_timestamp: value.start_timestamp,
            end_timestamp: value.end_timestamp
        };
    });

    console.log("Prices-Loaded-----------------------------------------------");

    return mappedAwattarPrices;
}