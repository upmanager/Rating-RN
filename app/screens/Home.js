import * as reduxActions from "@actions";
import React, { Component } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Text } from "@components"

export class index extends Component {
    state = {
    }
    componentDidMount() {
        this.props.getFacility();
        this.props.getQuestions();
    }
    onFacilityPress(item) {
        this.props.navigation.navigate('Detail', { data: item })
    }
    renderItem({ item, index }) {
        return (
            <TouchableOpacity style={styles.itemContainer} onPress={this.onFacilityPress.bind(this, item)}>
                <Text title2 bold style={{ flex: 1, textAlign: "center" }}>{item.name}</Text>
                <Text headline>Qty: {item.qty}</Text>
                <Text headline>Manager:</Text>
                <View style={{ paddingHorizontal: 20 }}>
                    <Text subhead>name: {item.manager?.name}</Text>
                    <Text subhead>email: {item.manager?.email}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { } = this.state;
        const { app: { facilities } } = this.props;
        return (
            <View style={{ padding: 12, flex: 1 }}>
                <FlatList
                    data={facilities}
                    // numColumns={1}
                    keyExtractor={(item, index) => index}
                    renderItem={this.renderItem.bind(this)}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => (state)
const mapDispatchToProps = { ...reduxActions }
export default connect(mapStateToProps, mapDispatchToProps)(index)


const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        margin: 6,
        borderRadius: 12,
        backgroundColor: "#fff",
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    }
});