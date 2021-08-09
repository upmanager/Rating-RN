import * as reduxActions from "@actions";
import { Text } from "@components";
import { BaseColor } from "@config";
import { getDeviceWidth } from "@utils";
import React, { Component } from 'react';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Button, Icon, Image, Input } from "react-native-elements";
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';
import auth from '@react-native-firebase/auth';
const item_width = getDeviceWidth() / 3 - 30;
const { firebase } = reduxActions;
export class index extends Component {
    state = {
        comments: "",
        images: [],
        loading: false,
    }
    componentDidMount() {
    }
    selectImage() {
        ImagePicker.openPicker({
            compressImageQuality: .99,
            multiple: true,
            mediaType: "photo"

        })
            .then(res => {
                this.setState({
                    images: [...this.state.images, ...res]
                })
            })
            .catch(err => console.error("open picker", err));
    }
    async newViolation() {
        const { user: { cur_branch } } = this.props;
        const { images, comments } = this.state;
        if (!comments) {
            Toast.showWithGravity("Input the comment", Toast.SHORT, Toast.TOP);
            return;
        } else if (images.length <= 0) {
            Toast.showWithGravity("Select one more image", Toast.SHORT, Toast.TOP);
            return;
        }
        this.setState({ loading: true });
        try {
            const uploaded_images = await firebase.uploadImages(images);
            const UserID = auth().currentUser.uid;
            const data = {
                BranchID: cur_branch.key,
                Images: uploaded_images,
                UserID
            }
            firebase.putViolation(data, res => {
                Toast.showWithGravity("Successfully submitted", Toast.SHORT, Toast.TOP);
                this.setState({ loading: false });
            });
        } catch (error) {
            this.setState({ loading: false });
        }
    }
    render() {
        const { images, comments, loading } = this.state;
        return (
            <View style={{ backgroundColor: BaseColor.whiteColor, flex: 1, padding: 10, alignItems: "center" }}>
                <Input
                    multiline={true}
                    placeholder={"type your comments"}
                    inputStyle={{ height: 160, textAlignVertical: "top" }}
                    value={comments}
                    onChangeText={comments => this.setState({ comments })}
                />
                <View style={{ flex: 1, alignItems: "center" }}>
                    <FlatList
                        data={images}
                        keyExtractor={(_, index) => index.toString()}
                        numColumns={3}
                        renderItem={({ item, index }) => (
                            <View style={{ width: item_width, margin: 5 }}>
                                <Image source={{ uri: item.path }} style={{ width: item_width, height: item_width }} />
                                <TouchableOpacity style={{ position: "absolute", top: 0, right: 0 }} onPress={() => {
                                    images.splice(index, 1);
                                    this.setState({ images: [...images] })
                                }}>
                                    <Icon name={'close'} size={30} />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <TouchableOpacity style={{ flex: 1 }} onPress={this.selectImage.bind(this)}>
                        <Text>Select image</Text>
                    </TouchableOpacity>
                </View>
                <Button
                    title={"OK"}
                    onPress={this.newViolation.bind(this)}
                    buttonStyle={{ paddingHorizontal: 60 }}
                />
                {loading &&
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
                            <Text whiteColor title3 style={{ marginTop: 20 }} bold>{"Loading..."}</Text>
                        </View>
                    </View>
                }
            </View>
        )
    }
}

const mapStateToProps = (state) => (state)

const mapDispatchToProps = {
    ...reduxActions
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
