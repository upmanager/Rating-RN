import * as reduxActions from "@actions";
import { Text } from "@components";
import { BaseColor } from "@config";
import React, { Component } from 'react';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Button, Input, Overlay } from "react-native-elements";
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';
import { createPDF } from "@utils";

const { firebase } = reduxActions;
export class index extends Component {
    state = {
        option: '',
        options_err: "",
        visible: false,
        exporting: false
    }
    deleteOptions({ name, key }) {
        this.deletekey = key;
        this.setState({
            visible: true
        });
    }
    addOptions() {
        const { option } = this.state;
        if (!option.trim()) {
            const options_err = "Input option name";
            this.setState({ options_err });
            return;
        }
        this.setState({ option: "" });
        firebase.addOptions(option, res => {
            Toast.showWithGravity("Successfully added option", Toast.SHORT, Toast.TOP);
        });
    }
    onDelete() {
        this.setState({ visible: false });
        firebase.deleteOptions(this.deletekey).then(res => {
            Toast.showWithGravity("Successfully deleted option", Toast.SHORT, Toast.TOP);
        })
            .catch(err => {
                console.error(err);
                Toast.showWithGravity("Some went wrong", Toast.SHORT, Toast.TOP);
            });
    }
    async exportPDF() {
        try {
            const { app: { options } } = this.props;
            this.setState({ exporting: true });
            const res = await createPDF(options, 'options');
            Toast.showWithGravity(`Successfully export pdf, ${res}`, Toast.SHORT, Toast.TOP);
        } catch (error) {
        }
        this.setState({ exporting: false });
    }
    render() {
        const { option, options_err, visible, exporting } = this.state;
        const { app: { options } } = this.props;
        return (
            <View style={{ padding: 20, flex:1 }}>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <Input
                        placeholder='Enter a Options'
                        value={option}
                        onChangeText={option => this.setState({ option, options_err: "" })}
                        containerStyle={{ flex: 1 }}
                        errorStyle={!options_err && { height: 0 }}
                        errorMessage={options_err}
                        inputStyle={{ fontSize: 16 }}
                    />
                    <Button
                        title={" Save "}
                        onPress={this.addOptions.bind(this)}
                    />
                </View>
                <View style={{ alignItems: "flex-end", marginVertical: 10 }}>
                    <Button
                        title={" Export to PDF "}
                        onPress={this.exportPDF.bind(this)}
                    />
                </View>
                <FlatList
                    data={options}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onLongPress={this.deleteOptions.bind(this, item)}
                            style={{
                                backgroundColor: BaseColor.whiteColor,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 8,
                                marginHorizontal: 20,
                                marginVertical: 5,
                                padding: 10,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 12,
                                },
                                shadowOpacity: 0.58,
                                shadowRadius: 16.00,

                                elevation: 12,
                            }}>
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
                <Overlay overlayStyle={{ width: "80%", paddingTop: 20 }} visible={visible} animationType={'fade'}>
                    <Text title2 blackColor flexCenter>Are you sure to delete this option?</Text>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <View style={{ flex: 1 }} />
                        <Button
                            buttonStyle={{ backgroundColor: BaseColor.primaryColor, marginRight: 15 }}
                            onPress={this.onDelete.bind(this)}
                            title={"Delete"} />
                        <Button
                            type="outline"
                            onPress={() => this.setState({ visible: false })}
                            title={"Cancel"} />
                    </View>
                </Overlay>
                {exporting &&
                    <View style={{
                        position: "absolute",
                        justifyContent: "center",
                        alignItems: "center",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }}>
                        <View style={{
                            backgroundColor: "#00000099",
                            padding: 30,
                            borderRadius: 10,
                        }}>
                            <ActivityIndicator style={{ transform: [{ scale: 1.3 }] }} size={"large"} color={BaseColor.whiteColor} />
                            <Text whiteColor title3 style={{ marginTop: 20 }} bold>{"Export pdf..."}</Text>
                        </View>
                    </View>
                }
            </View>
        )
    }
}

const mapStateToProps = (state) => (state)
const mapDispatchToProps = { ...reduxActions }
export default connect(mapStateToProps, mapDispatchToProps)(index)
