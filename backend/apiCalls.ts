import {awattarResponse} from "./interfaces";

export async function loadPrices(startTimestamp: number, endTimestamp: number) {
    let response = await fetch(`https://api.awattar.at/v1/marketdata?start=${startTimestamp}&end=${endTimestamp}`);
    let responseObject: awattarResponse = await response.json();

    return responseObject.data;
}