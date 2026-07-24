import { Image, StyleSheet, Text, View,ScrollView } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'

const InsightScreen = () => {
  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.headerTitle} >Insights</Text>

      <View style={styles.insightbox}>
        <Text style={styles.headerTitle}>Account Reached</Text>
        <Text style={styles.content}>741K</Text>
      </View>
      

      <View style={{flexDirection:'row',width:wp(92),
        justifyContent:'space-between',alignSelf:'center'}}>
        
          <View style={[styles.insightboxshort,{flexDirection:'column',gap:10}]}>

         <View style={{flexDirection:'row',gap:10,alignItems:'center'}}>

           <View style={styles.iconbox}>
            <Image source={require("../Assests/eye.png")}
            style={styles.actionEmoji}/>
            </View>
            <Text style={styles.content}>Impression</Text>

         </View>

         <Text style={styles.headerTitle}>786K+</Text>
         </View>

  <View style={[styles.insightboxshort,{flexDirection:'column',gap:10}]}>

         <View style={{flexDirection:'row',gap:10,alignItems:'center'}}>

           <View style={styles.iconbox}>
            <Image source={require("../Assests/user.png")}
            style={styles.actionEmoji}/>
            </View>
            <Text style={styles.content}>Profile Visit</Text>

         </View>

         <Text style={styles.headerTitle}>76K+</Text>
         </View>

      </View>


 <View style={{flexDirection:'row',width:wp(92),
    justifyContent:'space-between',alignSelf:'center'}}>
        
          <View style={[styles.insightboxshort,{flexDirection:'column',gap:10}]}>

         <View style={{flexDirection:'row',gap:10,alignItems:'center'}}>

           <View style={styles.iconbox}>
            <Image source={require("../Assests/reel.png")}
            style={styles.actionEmoji}/>
            </View>
            <Text style={styles.content}>Reel Plays</Text>

         </View>

         <Text style={styles.headerTitle}>6K+</Text>
         </View>

  <View style={[styles.insightboxshort,{flexDirection:'column',gap:10}]}>

         <View style={{flexDirection:'row',gap:10,alignItems:'center'}}>

           <View style={styles.iconbox}>
            <Image source={require("../Assests/follower.png")}
            style={styles.actionEmoji}/>
            </View>
            <Text style={styles.content}>Followers   </Text>

         </View>

         <Text style={styles.headerTitle}>86K+</Text>
         </View>

      </View>

<View style={{backgroundColor:'#99999c',width:wp(94),
    alignSelf:'center',justifyContent:'center',
    height:'auto',marginTop:30, borderRadius:20,paddingBottom:20,marginBottom:50}}>

        <Text style={[styles.headerTitle,{color:'black',marginTop:10}]}>Engagment</Text>

 <View style={{flexDirection:'row',width:wp(92),
        justifyContent:'space-between',alignSelf:'center',}}>
        
          <View style={[styles.insightboxshort,{flexDirection:'column',gap:10}]}>

         <View style={{flexDirection:'row',gap:10,alignItems:'center'}}>

           <View style={styles.iconbox}>
            <Image source={require("../Assests/fillheart.png")}
            style={styles.actionEmoji}/>
            </View>
            <Text style={styles.content}>Like </Text>

         </View>

         <Text style={styles.headerTitle}>786K+</Text>
         </View>

  <View style={[styles.insightboxshort,{flexDirection:'column',gap:10}]}>

         <View style={{flexDirection:'row',gap:10,alignItems:'center'}}>

           <View style={styles.iconbox}>
            <Image source={require("../Assests/chat.png")}
            style={styles.actionEmoji}/>
            </View>
            <Text style={styles.content}>Comment</Text>

         </View>

         <Text style={styles.headerTitle}>76K+</Text>
         </View>

      </View>


 <View style={{flexDirection:'row',width:wp(92),
    justifyContent:'space-between',alignSelf:'center'}}>
        
          <View style={[styles.insightboxshort,{flexDirection:'column',gap:10}]}>

         <View style={{flexDirection:'row',gap:10,alignItems:'center'}}>

           <View style={styles.iconbox}>
            <Image source={require("../Assests/save.png")}
            style={styles.actionEmoji}/>
            </View>
            <Text style={styles.content}>Saves</Text>

         </View>

         <Text style={styles.headerTitle}>6K+</Text>
         </View>

  <View style={[styles.insightboxshort,{flexDirection:'column',gap:10}]}>

         <View style={{flexDirection:'row',gap:10,alignItems:'center'}}>

           <View style={styles.iconbox}>
            <Image source={require("../Assests/share.png")}
            style={styles.actionEmoji}/>
            </View>
            <Text style={styles.content}>Share</Text>

         </View>

         <Text style={styles.headerTitle}>86K+</Text>
         </View>

      </View>
</View>


    </View>
    </ScrollView>
  )
}

export default InsightScreen

const styles = StyleSheet.create({
    content:
    {
        fontSize:hp(2.1)
    },
    iconbox:
    {
        backgroundColor:"#76767d",
        height:hp(4),
        width:wp(9),
        alignItems:'center',
        justifyContent:'center',
        borderRadius:50
    },
     actionEmoji:
       {
         height:hp(2),
         width:wp(4.5),
         tintColor:'black'
         },
    container:{
     flex: 1,
    backgroundColor: 'black',
    padding:10
  },

  headerTitle: {
    color: '#fff',
    fontSize:hp(2.3),
    fontWeight: '800',
    letterSpacing: 0.5,
    marginLeft:15
  },
    insightbox:
    {
      backgroundColor:'#38383b',
      height:"auto",
      width:wp(92),
      alignSelf:'center',
      borderRadius:20,
      padding:20,
      elavation:10,
      marginTop:20
    },
    insightboxshort:
    {
        backgroundColor:'#38383b',
      height:"auto",
      width:wp(44),
      alignSelf:'center',
      borderRadius:20,
      padding:20,
      elavation:10,
      marginTop:20
    },
    subheaderTitle:{
    color: '#fff',
    fontSize:hp(2),
    fontWeight: '800',
    letterSpacing: 0.5,
    }
})