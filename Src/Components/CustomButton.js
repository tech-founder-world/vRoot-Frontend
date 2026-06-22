import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const CustomButton = ({ title, onPress, backgroundColor, textColor, style }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.button, { backgroundColor: backgroundColor || '#007BFF' }, style]}>
        <Text style={[styles.text, { color: textColor || '#fff' }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: height * 0.07, // 7% of screen height
    width: width * 0.9, // 90% of screen width
    backgroundColor: '#FF5733',
    borderRadius: width * 0.1, // Responsive border radius
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  text: {
    color: 'azure',
    fontSize: width * 0.05, // Responsive font size
    fontWeight: 'bold',
  },
});

export default CustomButton;
