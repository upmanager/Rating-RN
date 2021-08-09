import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import * as reduxActions from "@actions";
import ModalSelector from 'react-native-modal-selector';
import { BaseColor } from "@config";
import { Text } from "@components";
import { Image, Button } from "react-native-elements"
import { Images } from "@assets";

export class index extends Component {
    componentDidMount() {
        this.props.getBranches();
        this.props.getOptions();
        this.props.getUsers();
        this.props.getRatings();
        this.props.getViolation();
    }
    componentDidUpdate() {
        const { app: { branches }, user: { cur_branch } } = this.props;
        if (branches && !cur_branch) {
            this.props.setBranch(branches[0]);
        }
    }
    render() {
        const { app: { branches }, user: { cur_branch } } = this.props;
        const branch_data = [...(branches || []).map(item => ({ ...item, label: item.name }))];
        return (
            <View style={{ backgroundColor: BaseColor.whiteColor, flex: 1 }}>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", }}>
                    <Image source={Images.logo}
                        style={{
                            width: 200,
                            height: 200,
                        }} resizeMode={'contain'} />
                </View>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <ModalSelector
                        data={branch_data}
                        style={{
                            width: "70%",
                        }}
                        onChange={(selected) => this.props.setBranch(selected)}>
                        <View
                            style={{ borderColor: BaseColor.primaryColor, borderWidth: 1, padding: 10, borderRadius: 8, margin: 5, alignItems: "center" }}
                        >
                            <Text>{cur_branch?.name}</Text>
                        </View>
                    </ModalSelector>
                    <Button
                        title={"   Ok   "}
                        onPress={() => this.props.navigation.navigate("Rating")}
                    />
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => (state)

const mapDispatchToProps = {
    ...reduxActions
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
