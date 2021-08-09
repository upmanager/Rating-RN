import React, { useState, useEffect } from 'react'
import storage from '@react-native-firebase/storage';
import { Image } from 'react-native-elements'

export default function ImageView(props) {
    const [source, setSource] = useState("")
    useEffect(async () => {
        if (!props.source?.uri) return;

        if (props.firebaseStorage) {
            const uri = await storage().ref(`Violations/${props.source.uri}`).getDownloadURL();
            setSource({ uri });
        } else {
            setSource(props.source);
        }
    }, [props])
    return (
        <Image
            {...props}
            source={source}
        />
    )
}
