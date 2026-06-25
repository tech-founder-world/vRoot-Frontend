import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import styles from '../Style/Loginstyle'
import { pripolicy } from '../Screen/data'
import LinearGradient from 'react-native-linear-gradient'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'

const PriPolicy = ({data}) => {
    const renderitem=({item})=>
    (
    
        <View style={styles.privacybox}>
         <Text style={styles.priheader}>{item.heading}</Text>
         <Text style={styles.subheading}>{item.subhead}</Text>
        </View>
    )
  return (

    <View style={{flex:1}}>
        <FlatList
        data={data}
        renderItem={renderitem}
        keyExtractor={(item)=>item.id}
        showsVerticalScrollIndicator={false}></FlatList>
    </View>
  )
}

export default PriPolicy

