import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styles from '../Style/Loginstyle'
import { terms } from './data'
import PriPolicy from '../Components/PriPolicy'

const TermsScreen = () => {
  return (
    
    <LinearGradient             
    colors={['#a90657', '#2b09a6']}
    style={styles.container}>
    
    <View>
      <Text style={styles.header}>Terms & Condition</Text>
       <PriPolicy
           data={terms}/>
    </View>

    </LinearGradient>
  )
}

export default TermsScreen

