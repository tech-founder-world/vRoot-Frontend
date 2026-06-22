import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import React from 'react';

const { width, height } = Dimensions.get('window');

const CustomInput = ({ value, setValue, placeholder, secureTextEntry, maxLength, keyboardType, disabled }) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={value}
                maxLength={maxLength}
                onChangeText={setValue}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                placeholderTextColor={'#969696'}
                editable={!disabled} // 'editable' replaces 'disabled' (React Native doesn't use 'disabled')
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width * 0.9, // 90% of screen width
        alignSelf: 'center',
    },
    input: {
        color: '#9a9a9a',
        borderWidth: 1,
        borderRadius: 8,
        height: height * 0.07, // 7% of screen height
        borderColor: '#666666',
        paddingLeft: width * 0.1, // 10% of screen width for padding
        marginVertical: height * 0.02, // 2% of screen height
        backgroundColor: '#fff',
    }
});

export default CustomInput;
