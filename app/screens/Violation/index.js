import * as reduxActions from "@actions";
import { Text, ImageView } from "@components";
import { BaseColor } from "@config";
import React, { Component } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import ModalSelector from 'react-native-modal-selector';
import { getDeviceWidth } from "@utils";
const itemWidth = getDeviceWidth() / 2 - 60;
export class index extends Component {
    state = {
        selected_user: {
            label: "Choose user",
            key: "",
        },
        selected_branch: {
            label: "Choose branch",
            key: "",
        }
    }
    get ratingDatas() {
        const { selected_user, selected_branch } = this.state;
        const { app: { violations } } = this.props
        let data = [];
        try {
            data = violations.filter(item => {
                if (selected_user.key && item.UserID != selected_user.key) {
                    return false;
                }
                if (selected_branch.key && item.BranchID != selected_branch.key) {
                    return false;
                }
                return true;
            });
        } catch (error) {
            data = [];
        }
        return [...data, ...data];
    }
    pressImage(images) {
        this.props.navigation.navigate("PreviewImage", { images });
    }
    render() {
        const { selected_user, selected_branch } = this.state;
        const { app: { users, branches } } = this.props
        const user_data = [{ label: "Choose user", key: "", }, ...(users || []).map(item => ({ ...item, label: item.name }))];
        const branch_data = [{ label: "Choose branch", key: "", }, ...(branches || []).map(item => ({ ...item, label: item.name }))]; return (
            <View style={{ padding: 20 }}>
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
                <FlatList
                    data={this.ratingDatas}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    numColumns={2}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={this.pressImage.bind(this, item.Images)}
                            style={{
                                backgroundColor: BaseColor.whiteColor,
                                justifyContent: "center",
                                alignItems: "center",
                                margin: 10,
                                width: itemWidth + 20,
                                padding: 10,
                                borderRadius: 8
                            }}>
                            {item?.Images?.length > 0 &&
                                <ImageView
                                    source={{ uri: item.Images[0].image }}
                                    firebaseStorage
                                    style={{ width: itemWidth, height: itemWidth }}
                                />
                            }
                            <Text style={{ flex: 1, textAlign: "center" }} numberOfLines={5}>{item.Comment}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => (state)
const mapDispatchToProps = { ...reduxActions }
export default connect(mapStateToProps, mapDispatchToProps)(index)
