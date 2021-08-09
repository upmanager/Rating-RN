import * as reduxActions from "@actions";
import { Text } from "@components";
import { BaseColor } from "@config";
import auth from '@react-native-firebase/auth';
import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { Button } from "react-native-elements";
import { AirbnbRating } from 'react-native-ratings';
import { connect } from 'react-redux';
const { firebase } = reduxActions;
import Toast from 'react-native-simple-toast';

export class index extends Component {
    componentDidMount() {
        this.rate = []
    }
    get getRatingdata() {
        const { app: { options, ratings }, user: { cur_branch } } = this.props;
        const cur_uid = auth().currentUser.uid;
        var data = options.map(item => {
            const rate_ref = ratings.find(rat => rat.OptionID == item.key && rat.BranchID == cur_branch.key && rat.UserID == cur_uid);
            return { ...item, rate: rate_ref?.state == "approve" ? rate_ref?.Rate : 0, ref_key: rate_ref?.key };
        });
        return data;
    }
    onFinishRating(item, count) {
        const index = this.rate.findIndex(rat => rat.key == item.key);
        if (index >= 0) {
            this.rate[index] = {
                key: item.key,
                rate: count,
                ref_key: item.ref_key
            }
        } else {
            this.rate.push({
                key: item.key,
                rate: count,
                ref_key: item.ref_key
            });
        }
    }
    giveRate() {
        const { user: { cur_branch } } = this.props;
        const cur_uid = auth().currentUser.uid;
        this.rate = this.rate.map(item => ({ OptionID: item.key, Rate: item.rate, ref_key: item.ref_key, BranchID: cur_branch.key, UserID: cur_uid }));
        firebase.rateOption(this.rate);
        Toast.showWithGravity("Save Rating, Please wait till admin approve.", Toast.SHORT, Toast.TOP);
        this.props.navigation.navigate("Violation");
    }
    render() {
        const { user: { cur_branch } } = this.props;
        return (
            <View style={{ backgroundColor: BaseColor.whiteColor, flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text title2 bold style={{ marginBottom: 10 }}>{cur_branch?.name}</Text>
                <FlatList
                    data={this.getRatingdata}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ width: "100%", paddingHorizontal: "10%" }}
                    renderItem={({ item, index }) => (
                        <View style={{ flexDirection: "row", flex: 1 }}>
                            <Text headline style={{ flex: 1, paddingRight: 20 }}>{item.name} </Text>
                            <AirbnbRating reviews={[]} size={30} showRating={false} onFinishRating={this.onFinishRating.bind(this, item)} defaultRating={item.rate} />
                        </View>
                    )}
                />
                <Button
                    title={"   Ok   "}
                    buttonStyle={{ marginVertical: 20 }}
                    onPress={this.giveRate.bind(this)}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => (state)

const mapDispatchToProps = {
    ...reduxActions
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
