import * as reduxActions from "@actions";
import { connect } from "react-redux";
import { StyleSheet, View, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BaseColor } from "@config"
import { Header, Text } from "@components"
import { ButtonGroup, Icon } from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker';
import { t } from "@utils"

const GiveRating = (props) => {
    const { data, location } = props.route.params;

    const [questions, setQuestions] = useState([])
    const [selectedCategory, setSelectedCategory] = useState({})
    const [selectStatus, setSelectStatus] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setQuestions(props.app.questions)
    }, [props.app.questions]);

    useEffect(() => {
        if (selectedCategory?.id > 0) {

        } else if (questions?.length > 0) {
            setSelectedCategory(questions[0])
        } else {
            setSelectedCategory(null)
        }
        return () => {

        }
    }, [questions]);

    const updateImage = (questionIndex, url, imgIndex = -1) => {
        var tmpData = [...(selectStatus || [])]
        var images = tmpData[questionIndex].images || []

        if (imgIndex >= 0) {
            images.splice(imgIndex, 1)
        } else {
            images.push(url)
        }
        tmpData[questionIndex] = { ...tmpData[questionIndex], images };
        setSelectStatus(tmpData)
    }

    const selectImage = (questionIndex, isCamera) => {
        const options = {
            cropping: true,
            compressImageQuality: 0.7
        };
        const response = (image) => {
            const choose_image = {
                type: image.mime || "image/png",
                name: `${new Date().getTime()}.${image?.mime?.split("/")[1] || "avatar.png"}`,
                uri: image.path
            };
            updateImage(questionIndex, choose_image)
        }
        if (isCamera) {
            ImagePicker.openCamera(options)
                .then(response)
                .catch(console.log);
        } else {
            ImagePicker.openPicker(options)
                .then(response)
                .catch(console.log);
        }
    };
    const renderImage = (data, index, dataIndex = 0) => {
        return (
            <View style={{ flex: 1, position: "relative", margin: 8, justifyContent: "center", alignItems: "center", height: 100, backgroundColor: "#ddd", borderRadius: 12, overflow: 'hidden' }}>
                <Image source={data} style={{ width: 100, height: 100 }} resizeMode={'cover'} />
                <TouchableOpacity onPress={() => updateImage(dataIndex, '', index)} style={{ backgroundColor: "#fff", position: "absolute", width: 30, height: 30, borderRadius: 30, top: -5, right: -5, justifyContent: 'flex-end' }}>
                    <Icon name='close' color={BaseColor.redColor} />
                </TouchableOpacity>
            </View>
        )
    }
    const setMatch = (questionIndex, questionid, value) => {
        var tmp = [...(selectStatus || [])]
        var new_data = { match: value, questionid, images: [] };
        if (questionIndex >= 0) {
            tmp[questionIndex] = new_data
        } else {
            tmp = [...tmp, new_data]
        }
        setSelectStatus(tmp)
    }

    const renderCategory = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => setSelectedCategory(item)}
                style={{ paddingHorizontal: 10, paddingVertical: 4, borderBottomColor: "#000", borderBottomWidth: (selectedCategory?.id == item.id ? 2 : 0), borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
                <Text subhead>{item.all_check == 1 ? '*' : ''} {item.title}</Text>
            </TouchableOpacity>
        )
    }
    const getSelectedItem = (qestId) => {
        var matchIndex = selectStatus?.findIndex(item => item.questionid == qestId);
        if (matchIndex < 0) return { index: -1, data: null }
        return { index: matchIndex, data: selectStatus[matchIndex] }
    }
    const uploadImages = async () => {
        const _uploadImages = props.uploadImages
        var tmp = await (Promise.all(
            selectStatus.map(async item => {
                var images = []
                if (item.match > 0 && item.images.length > 0) {
                    images = await _uploadImages(item.images, 'rating', console.log)
                }
                return { ...item, images }
            })
        ))
        return tmp
    }
    const save = async () => {
        for (let i = 0; i < questions.length; i++) {
            const item = questions[i];
            if (!item.questions) continue
            if (item.all_check == 0) continue
            for (let j = 0; j < item.questions.length; j++) {
                const element = item.questions[j];
                const findItem = selectStatus.find(tmp => tmp.questionid == element.id);
                if (!findItem || findItem.match == -1) {
                    alert(`${t('Please complete all questions')}\n ${item.title} -> ${element.question}`)
                    return
                }
                // if (!findItem.match && (!findItem.images || findItem.images.length <= 0)) {
                //     alert(`${t('You must choose at least one image for Non match question')}\n ${item.title} -> ${element.question}`)
                //     return
                // }
            }
        }

        setLoading(true)
        var updated = await uploadImages()
        props.addRating(props.auth.user.id, data.id, location, updated,
            (res) => {
                setLoading(false)
                props.navigation.navigate('Home')
            })
    }
    return (
        <View style={{ flex: 1 }}>
            <Header
                title={'Ratings'}
                renderLeft={<Icon name={'angle-left'} color={BaseColor.whiteColor} size={30} type={'font-awesome'} />}
                onPressLeft={() => props.navigation.goBack()}
                loading={loading}
            />
            <View style={styles.container}>
                <View>
                    <Text headline bold>Categories</Text>
                    <FlatList
                        horizontal
                        data={questions}
                        keyExtractor={(_, index) => index}
                        renderItem={renderCategory}
                    />
                </View>
                <ScrollView>
                    {selectedCategory?.questions?.map((item, dataIndex) => {
                        var { index: curQuestIndex, data: curQuestion } = getSelectedItem(item.id)
                        return (
                            <View key={dataIndex} style={{ marginVertical: 15 }}>
                                <Text headline bold>{item.question}</Text>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ width: "100%", padding: 10, flexDirection: "row", alignItems: "center", }}>
                                        <ButtonGroup
                                            containerStyle={{ flex: 1 }}
                                            buttons={[t('Match'), t('Average'), t('Non Match')]}
                                            selectedIndex={curQuestion?.match}
                                            selectedButtonStyle={{ backgroundColor: curQuestion?.match == 0 ? BaseColor.primaryColor : curQuestion?.match == 1 ? BaseColor.primary2Color : BaseColor.dangerColor }}
                                            selectedTextStyle={{ color: "white" }}
                                            onPress={(i) => setMatch(curQuestIndex, item.id, i)}
                                        />
                                        <TouchableOpacity onPress={() => setMatch(curQuestIndex, item.id, -1)}>
                                            <Icon name="close" size={30} color={BaseColor.redColor} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {(curQuestIndex >= 0 && curQuestion?.match > 0) &&
                                    <>
                                        <View style={{ flexDirection: "row", marginTop: 10, paddingHorizontal: 20 }}>
                                            <TouchableOpacity style={[styles.imageAction, { backgroundColor: curQuestion?.match == 1 ? BaseColor.primary2Color : BaseColor.dangerColor }]}
                                                onPress={() => selectImage(curQuestIndex, false)}
                                            >
                                                <Text whiteColor>Choose from Gallery</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.imageAction, { backgroundColor: curQuestion?.match == 1 ? BaseColor.primary2Color : BaseColor.dangerColor }]}
                                                onPress={() => selectImage(curQuestIndex, true)}
                                            >
                                                <Text whiteColor>Take with Camera</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {curQuestion.images?.length > 0 &&
                                            <View style={{ height: 120, marginTop: 10 }}>
                                                <FlatList
                                                    horizontal
                                                    data={curQuestion.images}
                                                    keyExtractor={(_, index) => index}
                                                    renderItem={({ item, index }) => renderImage(item, index, curQuestIndex)} />
                                            </View>
                                        }
                                    </>
                                }
                            </View>
                        )
                    })}
                </ScrollView>

                <View style={{ flex: 1 }} />
                <TouchableOpacity style={[styles.button, loading && { backgroundColor: BaseColor.grayColor }]} onPress={save} disabled={loading}>
                    <Text whiteColor headline>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const mapStateToProps = (state) => (state)
const mapDispatchToProps = { ...reduxActions }

export default connect(mapStateToProps, mapDispatchToProps)(GiveRating);

const styles = StyleSheet.create({
    header: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BaseColor.primaryColor
    },
    container: {
        backgroundColor: "#fff",
        flex: 1,
        padding: 15,
    },
    button: {
        backgroundColor: BaseColor.primaryColor,
        padding: 12,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
    },
    imageAction: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        marginHorizontal: 5,
        padding: 10,
        borderRadius: 8,
        backgroundColor: BaseColor.dangerColor
    }
})