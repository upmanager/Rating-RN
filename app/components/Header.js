import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BaseColor } from "@config";
import { Text } from "@components";
import { LinearProgress } from 'react-native-elements';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export default class Header extends Component {
    render() {
        const { renderLeft, renderRight, renderCenter, title, onPressLeft, onPressRight, loading, height } = this.props;
        return (
            <>
                <View style={[styles.container, height && { height }]}>
                    <View style={[styles.action, { alignItems: "flex-start" }]}>
                        {renderLeft && (
                            <TouchableOpacity onPress={onPressLeft}>
                                {renderLeft}
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={{ flex: 1 }}>
                        {!!renderCenter && renderCenter}
                        {!!title && <Text title3 whiteColor flexCenter>{title}</Text>}
                    </View>
                    <View style={[styles.action, { alignItems: "flex-end" }]}>
                        {renderRight && (
                            <TouchableOpacity onPress={onPressRight}>
                                {renderRight}
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                {loading &&
                    <LinearProgress color={"primary"} style={{ height: 10 }} />
                }
            </>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        backgroundColor: BaseColor.primaryColor,
        padding: 10,
        paddingTop: getStatusBarHeight(true)
    },
    action: {
        width: 40
    }
});
