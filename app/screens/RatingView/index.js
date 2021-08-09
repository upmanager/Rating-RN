import * as reduxActions from "@actions";
import { Text } from "@components";
import { BaseColor } from "@config";
import React, { Component } from 'react';
import { FlatList, ActivityIndicator, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { Button, Switch, Overlay, Icon } from "react-native-elements";
import { connect } from 'react-redux';
import ModalSelector from 'react-native-modal-selector';
import Toast from 'react-native-simple-toast';
import { createPDF, getDeviceHeight, getDeviceWidth } from "@utils";
const { firebase } = reduxActions;
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';

export class index extends Component {
    state = {
        selected_user: {
            label: "Choose user",
            key: "",//-MIcOBwK3vQ2QbGtNQtH
        },
        selected_branch: {
            label: "Choose branch",
            key: "",//-MIcOgO3CHYNc9aHEviL
        },
        selected_date: '',
        exporting: false,
        dates: [],
        visibleCalancer: false
    }
    async exportPDF() {
        try {
            this.setState({ exporting: true });
            const res = await createPDF(this.ratingDatas, 'ratings');
            Toast.showWithGravity(`Successfully export pdf, ${res}`, Toast.SHORT, Toast.TOP);
        } catch (error) {
            console.error(error);
        }
        this.setState({ exporting: false });
    }
    compareDay(d1, d2) {
        const m1 = moment(d1);
        const m2 = moment(d2);
        if(!m1 || !m2) return false;
        return (m1.year() == m2.year() && m1.month() == m2.month() && m1.date() == m2.date());

    }
    get ratingDatas() {
        const { selected_user, selected_branch, selected_date } = this.state;
        const { app: { ratings, options } } = this.props
        let data = [];
        try {
            data = ratings.filter(item => {
                if (selected_user.key && item.UserID != selected_user.key) {
                    return false;
                }
                if (selected_branch.key && item.BranchID != selected_branch.key) {
                    return false;
                }
                if (selected_date && (!item.date || !this.compareDay(item.date, selected_date))) {
                    return false;
                }
                return true;
            });
            data = data.map(item => {
                const option = options.find(op => op.key == item.OptionID)?.name;
                return { ...item, option }
            })
                .filter(item => item.option);
        } catch (error) {
            data = [];
        }
        var total_rate = data.reduce((a, v) => a = a + v.Rate, 0);

        return [{ option: "Option", Rate: "Rate", state: "Approve" }, { option: "Total", Rate: total_rate }, ...data];
    }
    updateState(item) {
        const value = item.state == "approve" ? "block" : "approve";
        firebase.updateState(item.key, value, res => {
            Toast.showWithGravity(`Updated state`, Toast.SHORT, Toast.TOP);
        });
    }
    render() {
        const { selected_user, selected_branch, exporting, visibleCalancer, selected_date } = this.state;
        const { app: { users, branches } } = this.props;
        const user_data = [{ label: "Choose user", key: "", }, ...(users || []).map(item => ({ ...item, label: item.name }))];
        const branch_data = [{ label: "Choose branch", key: "", }, ...(branches || []).map(item => ({ ...item, label: item.name }))];

        return (
            <SafeAreaView style={{ padding: 20, flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <View style={{ flex: 1 }}>
                        <Text>    User Name</Text>
                        <ModalSelector
                            data={user_data}
                            style={{ borderColor: BaseColor.primaryColor, borderWidth: 1, padding: 10, borderRadius: 8, margin: 5 }}
                            onChange={(selected_user) => this.setState({ selected_user })}>
                            <Text>{selected_user.label}</Text>
                        </ModalSelector>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text>    Branch</Text>
                        <ModalSelector
                            data={branch_data}
                            style={{ borderColor: BaseColor.primaryColor, borderWidth: 1, padding: 10, borderRadius: 8, margin: 5 }}
                            onChange={(selected_branch) => this.setState({ selected_branch })}>
                            <Text>{selected_branch.label}</Text>
                        </ModalSelector>
                    </View>
                </View>
                <View style={{ marginVertical: 10, flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity style={{ flex: 1, flexDirection: "row" }} onPress={() => this.setState({ visibleCalancer: true })}>
                        <Text headline>  Date: {selected_date ? moment(selected_date).format('DD/MM/YYYY') : "All"}</Text>
                        {!!selected_date &&
                            <TouchableOpacity style={{}} onPress={() => {
                                this.setState({ selected_date: "" })
                            }}>
                                <Icon name={'close'} size={25} />
                            </TouchableOpacity>
                        }
                    </TouchableOpacity>
                    <View>
                        <Button
                            title={" Export to PDF "}
                            onPress={this.exportPDF.bind(this)}
                        />
                    </View>
                </View>
                <FlatList
                    data={this.ratingDatas}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ backgroundColor: BaseColor.whiteColor }}
                    renderItem={({ item, index }) => (
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                marginHorizontal: 20,
                                marginVertical: 5,
                                padding: 5,
                                flexDirection: "row"
                            }}>
                            <Text style={{ flex: 1, textAlign: "center" }}>{item.option}</Text>
                            <Text style={{ flex: 1, textAlign: "center" }}>{item.Rate}</Text>
                            {index == 0 ?
                                <Text style={{ textAlign: "center" }}>{item.state}</Text>
                                :
                                index > 1 ?
                                    <Switch value={item.state == "approve"} onChange={this.updateState.bind(this, item)} />
                                    :
                                    <View style={{ width: 40 }} />
                            }
                        </View>
                    )}
                />
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
                <Overlay visible={visibleCalancer} animationType={'fade'}>
                    <CalendarPicker
                        width={getDeviceWidth() - 60}
                        height={getDeviceHeight() - 60}
                        onDateChange={selected_date => this.setState({ selected_date, visibleCalancer: false })}
                    />
                </Overlay>
            </SafeAreaView>
        )
    }
}

const mapStateToProps = (state) => (state)
const mapDispatchToProps = { ...reduxActions }
export default connect(mapStateToProps, mapDispatchToProps)(index)
