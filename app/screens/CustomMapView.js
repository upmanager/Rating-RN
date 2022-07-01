import * as reduxActions from "@actions";
import { Text } from "@components";
import { BaseColor } from "@config";
import React, { Component } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { ButtonGroup, Icon } from 'react-native-elements';
import Geocoder from 'react-native-geocoding';
import GetLocation from 'react-native-get-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { connect } from "react-redux";
import { t, getCurLan } from "@utils";
import { getStatusBarHeight } from 'react-native-status-bar-height';
const _MAPTYPE = [
  { key: 'standard', value: 'Standard' },
  { key: 'satellite', value: 'Satellite' },
  { key: 'hybrid', value: 'Hybrid' },
];
const ANDROID_DEVICE = Platform.OS == "android";

class CustomMapView extends Component {
  constructor(props) {
    super(props);
    let { route: { params } } = this.props;
    this.params = params;

    let pinLocation = {
      latitude: 24.7136,
      longitude: 46.6753,
      description: "Riyadh",
    };
    if (this.params.viewable) {
      pinLocation = this.params.data;
    }
    this.state = {
      getMyLocation: false,
      pinLocation,
      mapType: 0,
      search_location: false
    }
    Geocoder.init('AIzaSyDR-8rg4jTCxRQbLw-bVm2V6wwSjAvbbVA', { language: getCurLan() || 'en' });
  }
  componentDidMount() {
    if (this.params.viewable) return;
    const { getMyLocation } = this.state;
    if (getMyLocation) return;
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        this.setState({ getMyLocation: true });
        this.changeLocation(location);
      })
      .catch(error => {
        console.error("get my location error", error);
      })
  }
  async getDescriotion(location) {
    try {
      const res = await Geocoder.from(location);
      return res.results[0].formatted_address;
    } catch (err) {
      console.error("get location error", err);
    }
    return "";
  }
  async touchMap({ nativeEvent }) {
    if (this.params.viewable) return;
    const { coordinate } = nativeEvent;
    this.changeLocation(coordinate);
  }
  async changeLocation(pinLocation, duration = 1000) {
    if (!pinLocation.description) {
      pinLocation.description = await this.getDescriotion(pinLocation);
    }
    this.setState({ pinLocation });
    this.mapRef?.animateCamera({ center: pinLocation }, { duration });
  }
  onAutoComplete(data, details) {
    const location = details?.geometry?.location;
    this.changeLocation({ longitude: location.lng, latitude: location.lat, description: data.description });
  }
  onConfirm() {
    this.params.onConfirm(this.state.pinLocation);
    this.onClose();
  }
  onClose() {
    this.props.navigation.goBack();
  }
  render() {
    const { pinLocation, getMyLocation, mapType, search_location } = this.state;
    if ((!getMyLocation && this.viewable) || !pinLocation) return <></>;
    return (
      <View style={styles.container}>
        <View style={{ width: "100%", flexDirection: "row", paddingBottom: 10, alignItems: "center", position:'relative' }}>
          <TouchableOpacity onPress={this.props.navigation.goBack} style={{ padding: 10 }}>
            <Icon name={"angle-left"} size={30} color={BaseColor.grayColor} type={'font-awesome-5'} />
          </TouchableOpacity>
          {search_location ?
            <>
              <GooglePlacesAutocomplete
                placeholder={t('Search')}
                fetchDetails={true}
                onPress={this.onAutoComplete.bind(this)}
                query={{
                  key: 'AIzaSyDR-8rg4jTCxRQbLw-bVm2V6wwSjAvbbVA',
                  language: getCurLan() || "en"
                }}
                styles={{
                  container: { flex: 1, position: "absolute", top: 0, left: 40, right: 40, zIndex: 999 },
                  textInput: { ...styles.autocomplete_input },
                }}
              />
              <View style={{ flex: 1 }} />
            </>
            :
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text title3 style={{ textAlign: "center" }}>{pinLocation.description}</Text>
              <Text subhead grayColor style={{ textAlign: "center" }}>{`${pinLocation.latitude}° N, ${pinLocation.longitude}° E`}</Text>
            </View>
          }
          <TouchableOpacity onPress={() => this.setState({ search_location: !search_location })} style={{ padding: 10 }}>
            <Icon name={search_location ? "times" : "search-location"} size={25} color={BaseColor.grayColor} type={'font-awesome-5'} />
          </TouchableOpacity>
        </View>
        <MapView
          style={styles.mapContainer}
          ref={(ref) => this.mapRef = ref}
          showsCompass={false}
          compassStyle={{
            top: 10,
            right: 10,
          }}
          mapType={_MAPTYPE[mapType].key}
          initialRegion={{
            latitude: pinLocation.latitude,
            longitude: pinLocation.longitude,
            latitudeDelta: .5,
            longitudeDelta: .5
          }}
          initialCamera={{
            center: pinLocation,
            heading: 0,
            pitch: 1,
            zoom: 10,
            altitude: 0,
          }}
          onPress={this.touchMap.bind(this)}
        >
          <Marker coordinate={pinLocation}>
          </Marker>
        </MapView>
        <View style={{ width: "100%", padding: 10, flexDirection: "row", alignItems: "center", }}>
          <ButtonGroup
            containerStyle={{ flex: 1 }}
            buttons={_MAPTYPE.map(item => t(item.value))}
            selectedIndex={mapType}
            onPress={(mapType) => this.setState({ mapType })}
          />
          {!this.params.viewable &&
            <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={this.onConfirm.bind(this)}>
              <Icon name="check-circle" size={30} color={BaseColor.primaryColor} type={"feather"} />
            </TouchableOpacity>
          }
        </View>
      </View>
    );
  }
}


const mapStateToProps = (state) => (state)
const mapDispatchToProps = { ...reduxActions }

export default connect(mapStateToProps, mapDispatchToProps)(CustomMapView);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: getStatusBarHeight(true)
  },
  mapContainer: {
    // position: "absolute",
    flex: 1,
    // width: "100%",
    // height: "100%"
  },
  marker: {
    paddingHorizontal: 14,
    paddingBottom: 24,
    paddingTop: 8
  },
  marker_avatar: {
    width: 20,
    height: 20,
    borderRadius: 999
  },
  shadow: {
    shadowColor: BaseColor.blackColor,
    shadowOffset: {
      width: 0,
      height: ANDROID_DEVICE ? 14 : 1,
    },
    shadowOpacity: 1,
    shadowRadius: ANDROID_DEVICE ? 16 : 2,
    elevation: ANDROID_DEVICE ? 14 : 4,
  },
  autocomplete_input: {
    paddingHorizontal: 45,
    color: BaseColor.blackColor,
    fontSize: 16,
    margin: 2,
  },
  location_preview: {
    width: "100%",
    backgroundColor: BaseColor.blackOpacity,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    paddingVertical: 30
  },
  description: {
    textAlign: "center",
    marginBottom: 5
  },
  actions: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    width: "60%"
  },
  cancel_action: {
    backgroundColor: BaseColor.redColor,
    paddingHorizontal: 14
  },
  confirm_action: {
    paddingHorizontal: 14
  }
});
