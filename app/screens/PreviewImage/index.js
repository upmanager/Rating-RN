import { ImageView } from "@components";
import { BaseColor } from "@config";
import React, { Component } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity, View, Platform } from "react-native";
import ImageViewer from 'react-native-image-zoom-viewer';
import { connect } from "react-redux";
import * as reduxActions from "@actions";
import { getDeviceWidth, getDeviceHeight, t } from "@utils";
import { Icon } from "react-native-elements";

class PreviewImage extends Component {
  constructor(props) {
    super(props);
    let { route: { params } } = this.props;
    this.params = params;
    this.params.editable = true;
    this.state = {
      indexSelected: this.params.index || 0,
      images: this.params.images
    }
  }
  get getData() {
    try {
      let { images } = this.state;
      images = images.map(item => {
        return {
          url: item.image,
          width: getDeviceWidth(),
          height: getDeviceHeight(),
          props: {
            resizeMode: 'contain'
          }
        };
      });
      return images;
    } catch (err) { }
    return [];
  }
  componentDidMount() {
    const { security } = this.params;
    if (security) {
      const limit = parseInt(global.config?.security_image_timeout);
      setTimeout(() => {
        this.props.navigation.goBack();
      }, limit > 0 ? limit : 30000);
    }
  }
  onTouchImage(touched) {
    if (touched == this.state.indexSelected) return;
    this.setState({ indexSelected: touched });
  }
  onSelect(index) {
    this.setState({ indexSelected: index, }, () => {
      this.flatListRef.scrollToIndex({
        animated: true,
        index
      });
    });
  }
  render() {
    const { indexSelected } = this.state;
    return (
      <ImageViewer
        imageUrls={this.getData}
        enableSwipeDown={true}
        index={indexSelected}
        swipeDownThreshold={200}
        loadingRender={() => <ActivityIndicator color={BaseColor.whiteColor} size={'large'} />}
        onChange={this.onSelect.bind(this)}
        renderIndicator={() => <ActivityIndicator color={BaseColor.whiteColor} size={'large'} />}
        onSwipeDown={this.props.navigation.goBack}
        failImageSource={t("Image loading failed")}
        saveToLocalByLongPress={false}
        renderImage={props => <ImageView {...props} />}
        renderHeader={() => (
          <View style={{ position: "absolute", zIndex: 9999, right: 15, top: 15, }}>
            <TouchableOpacity onPress={this.props.navigation.goBack}>
              <Icon name={"close"} size={35} color={BaseColor.whiteColor} type={'AntDesign'} />
            </TouchableOpacity>
          </View>
        )}
        footerContainerStyle={{ marginBottom: 60, width: "100%" }}
        renderFooter={() => (
          <>
            <FlatList
              ref={ref => this.flatListRef = ref}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={this.getData}
              keyExtractor={(item, index) => index.toString()}
              style={{ marginBottom: Platform.OS == "ios" ? 40 : 0 }}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => this.onTouchImage(index)} activeOpacity={0.9}>
                  <ImageView
                    style={{
                      width: 60,
                      height: 60,
                      margin: 4,
                      borderRadius: 4,
                      borderColor: index == indexSelected ? BaseColor.lightPrimaryColor : BaseColor.grayColor,
                      borderWidth: 1
                    }}
                    source={{ uri: item.url }}
                  />
                </TouchableOpacity>
              )}
            />
          </>
        )}
      />
    );
  }
}
const mapDispatchToProps = { ...reduxActions }
export default connect(null, mapDispatchToProps)(PreviewImage);
