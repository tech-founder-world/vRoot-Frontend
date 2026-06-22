import React from 'react';
import { TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function UploadTabButton({ onPress }) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.button}>
                <Image source={require("../Assests/up.png")} style={{ height: 30, 
                    width: 30,tintColor:"orange" }} />
                {/* <Ionicons name="add" size={30} color="#fff" /> */}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: '#FF2E63',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#FF2E63',
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
});
