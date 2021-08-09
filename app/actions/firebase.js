import { BaseConfig } from "@config";
import * as logger from "./logger";
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
const reference = database();
import pathParse from 'path-parse';
import moment from 'moment';

const DB = {
    ADMINS: "Admins-v2",
    USERS: "Users-v2",
    BRANCHES: "Branches",
    RATINGOPTIONS: "RatingOptions",
    USERRATINGS: "UserRatings",
    VIOLATIONS: "Violations"
}
const addAdmin = (uid, username) => {
    reference.ref(`${DB.ADMINS}/${uid}`).set({ Name: username });
}
const addUser = (uid, username) => {
    reference.ref(`${DB.USERS}/${uid}`).set({ Name: username });
}
const getRole = () => {
    return new Promise(async (resolve, reject) => {
        const uid = auth().currentUser.uid;
        try {
            let snapshot = await reference.ref(`${DB.ADMINS}/${uid}`)
                .once('value');
            if (snapshot.val() != null) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
}
const onBranch = (callback) => {
    reference.ref(`${DB.BRANCHES}`)
        .on('value', snapshot => {
            callback(snapshot.val());
        });
}
const addBranch = (Name, callback) => {
    reference.ref(`${DB.BRANCHES}`).push({ Name }, callback);
}
const deleteBranch = (key) => {
    return reference.ref(`${DB.BRANCHES}/${key}`).remove();
}
const onOptions = (callback) => {
    reference.ref(`${DB.RATINGOPTIONS}`)
        .on('value', snapshot => {
            callback(snapshot.val());
        });
}
const addOptions = (Name, callback) => {
    reference.ref(`${DB.RATINGOPTIONS}`).push({ Name }, callback);
}
const deleteOptions = (key) => {
    return reference.ref(`${DB.RATINGOPTIONS}/${key}`).remove();
}
const onUsers = (callback) => {
    reference.ref(`${DB.USERS}`)
        .on('value', snapshot => {
            callback(snapshot.val());
        });
}
const onRatings = (callback) => {
    reference.ref(`${DB.USERRATINGS}`)
        .on('value', snapshot => {
            callback(snapshot.val());
        });
}
const updateState = (key, value, callback) => {
    reference.ref(`${DB.USERRATINGS}/${key}/state`)
        .set(value, callback);
}
const onViolation = (callback) => {
    reference.ref(`${DB.VIOLATIONS}`)
        .on('value', snapshot => {
            callback(snapshot.val());
        });
}
const rateOption = (data) => {
    data.forEach(item => {
        const ref_key = item.ref_key
        delete item.ref_key;
        item.date = moment().toISOString();
        if (ref_key) {
            reference.ref(`${DB.USERRATINGS}/${ref_key}`).set(item);
        } else {
            reference.ref(`${DB.USERRATINGS}`).push(item);
        }
    });
}
const putViolation = (data, callback) => {
    reference.ref(`${DB.VIOLATIONS}`).push(data, callback);
}
const uploadImages = async (images) => {
    let urls = await Promise.all(images.map(async item => {
        const path = pathParse(item.path);
        const filename = `${moment().format('YYYYMMDD_hhmmss')}${path.ext}`;
        const reference = storage().ref(`Violations/${filename}`);
        await reference.putFile(item.path);
        return { image: filename };
    }));
    return urls;
}

export {
    addAdmin, addUser, getRole,
    onBranch, addBranch, deleteBranch,
    onOptions, addOptions, deleteOptions,
    onUsers,
    onRatings, updateState, rateOption,
    onViolation, putViolation,
    uploadImages,
};
