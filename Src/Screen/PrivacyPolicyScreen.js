import { StyleSheet, Text, View,} from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styles from '../Style/Loginstyle'
import PriPolicy from '../Components/PriPolicy'
import { pripolicy, terms } from './data'

const PrivacyPolicyScreen = () => {
  return (
    <LinearGradient 
            colors={['#a90657', '#2b09a6']}
            style={styles.container}>
    <View>
      <Text style={styles.header}>Privacy Policy</Text>

     <PriPolicy
     data={pripolicy}/>
      

    </View>
    </LinearGradient>
  )
}

export default PrivacyPolicyScreen

