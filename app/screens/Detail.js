import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Text, Header } from "@components"
import { BaseColor } from "@config";
import { Icon } from "react-native-elements"
import { t } from "@utils";

const Detail = (props) => {
    const [location, setLocation] = useState(null)
    const { data } = props.route.params
    const onConfirm = useCallback((res) => {
        setLocation(res)
    }, [])

    const addLocation = () => {
        props.navigation.navigate('CustomMapView', { viewable: false, onConfirm })
    }
    const next = () => {
        props.navigation.navigate('GiveRating', { data, location })

    }
    return (
        <View style={{ flex: 1 }}>
            <Header
                title={'Facility Info'}
                renderLeft={<Icon name={'angle-left'} color={BaseColor.whiteColor} size={30} type={'font-awesome'} />}
                onPressLeft={() => props.navigation.goBack()}
            />
            <View style={styles.container}>
                <Text subhead style={styles.text}>{t('Name of the facility')}:                  {data.name}</Text>
                <Text subhead style={styles.text}>{t('Commercial Record number')}:  {data.record_number}</Text>
                <Text subhead style={styles.text}>{t('Offices')}:            {data.offices.map(item => item.name).join(", ")}</Text>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <Text subhead style={[styles.text, { flex: 1 }]}>{t('Location of the facility')}:             {location?.description || ''}</Text>
                    <TouchableOpacity onPress={addLocation}>
                        <Text title3 bold primaryColor>Add</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                    disabled={!location}
                    style={[styles.button, !location && { backgroundColor: BaseColor.grayColor }]}
                    onPress={next}
                >
                    <Text whiteColor headline>Next</Text>
                </TouchableOpacity>
            </View>
        </View >
    )
}

export default Detail

const styles = StyleSheet.create({
    header: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BaseColor.primaryColor
    },
    container: {
        flex: 1,
        padding: 15,
        paddingTop: "30%"
    },
    text: {
        marginVertical: 10
    },
    button: {
        backgroundColor: BaseColor.primaryColor,
        padding: 12,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
    }
})