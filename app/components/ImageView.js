import React, { useState, useEffect } from 'react'
import { Image } from 'react-native-elements'
import { ActivityIndicator } from "react-native";

export default function ImageView(props) {
    const [source, setSource] = useState("")
    useEffect(async () => {
        if (!props.source?.uri) return;
        setSource(props.source);
    }, [props])
    return (
        <Image
            {...props}
            source={source}
            PlaceholderContent={<ActivityIndicator color={"#000"} />}
        />
    )
}
