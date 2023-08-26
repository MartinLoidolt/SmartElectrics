import {StyleSheet, View} from "react-native";
import {colorPrimary, colorWhite} from "../globals/colors";

export default function () {
    return <View style={styles.noDataFoundContainer}/>;
}

const styles = StyleSheet.create({
    noDataFoundContainer: {
        backgroundColor: colorWhite,
        width: 10,
        height: 10,
        borderColor: colorPrimary,
        borderWidth: 1,
        borderRadius: 5,
        zIndex: 10,
    },
});
