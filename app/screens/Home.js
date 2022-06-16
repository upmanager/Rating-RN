import * as reduxActions from "@actions";
import React, { Component } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Text } from "@components"
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { t } from "@utils";

export class index extends Component {
    state = {
        query: ''
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
                <Text headline>{t("Qty")}: {item.qty}</Text>
                <Text headline>{t("Manager")}:</Text>
                <View style={{ paddingHorizontal: 20 }}>
                    <Text subhead>{t("Name")}: {item.manager?.name}</Text>
                    <Text subhead>{t("Email")}: {item.manager?.email}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    get facilitiesData() {
        const { query } = this.state;
        const { app: { facilities } } = this.props;
        var data = [...(facilities || [])];

        const regex = new RegExp(`${query.trim()}`, 'i');

        return data.filter(item => {
            return (
                (item.name).search(regex) >= 0 ||
                (item.manager?.name).search(regex) >= 0
            )
        });
    }
    render() {
        const { query } = this.state;
        return (
            <View style={{ padding: 12, flex: 1 }}>
                <Input
                    placeholder={t('Search facilities')}
                    value={query}
                    onChangeText={query => this.setState({ query })}
                    leftIcon={<Icon name='search' size={24} color='black' />}
                />
                <FlatList
                    data={this.facilitiesData}
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