
import auth from '@react-native-firebase/auth';
import * as firebase from './firebase';
export const login = (email, password, callback) => dispatch => {
    auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            callback({ message: "Successfully signed.", success: true });
        })
        .catch(error => {
            console.log(error.code, ",", error.message)
            let message = "";
            if (error.code === 'auth/user-not-found') {
                message = "User not registered,";
            } else if (error.code === 'auth/wrong-password') {
                message = "The password is invalid or the user does not have a password.";
            } else if (error.code === 'auth/too-many-requests') {
                message = "We have blocked all requests from this device due to unusual activity. Try again later.";
            }
            callback({ message, success: false });
        });
}
export const register = (email, password, username, admin, callback) => dispatch => {
    auth()
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
            callback({ message: "Successfully registered", success: true });
            if (admin) {
                firebase.addAdmin(auth().currentUser.uid, username);
            } else {
                firebase.addUser(auth().currentUser.uid, username);
            }
        })
        .catch(error => {
            let message = "";
            if (error.code == 'auth/email-already-in-use') {
                message = 'That email address is already in use!';
            } else if (error.code == 'auth/weak-password') {
                message = 'The given password is invalid.';
            } else if (error.code == 'auth/invalid-email') {
                message = 'That email address is invalid!';
            } else {
                message = error.message;
            }
            callback({ message, success: false });
        });
}