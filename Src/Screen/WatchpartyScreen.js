import { StyleSheet, Text, TouchableOpacity, View,Image, TextInput } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import LinearGradient from 'react-native-linear-gradient'

const WatchpartyScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Watch Party</Text>
      <Text  style={styles.content}>Share Your Vibe With Your Friends</Text>

       <LinearGradient 
            colors={['#a90657', '#2b09a6']}
            style={styles.insightbox}>

        <Text  style={styles.headerTitle}>Vibe with friends in real-time</Text>
        <Text style={styles.content}>Create a room, drop the link — everyone watches the same reel, together.</Text>
        <TouchableOpacity style={styles.createroombtn}
        onPress={()=>navigation.navigate("createroom")}>
            <Text style={{color:'black'}}>Create Room</Text>
        </TouchableOpacity>
            </LinearGradient>

           <View style={[styles.insightboxshort,{flexDirection:'column',gap:10}]}>
          
                   <View style={{flexDirection:'row',gap:10,alignItems:'center'}}>
          
                     <View style={styles.iconbox}>
                      <Image source={require("../Assests/join.png")}
                      style={styles.actionEmoji}/>
                      </View>
                      <Text style={styles.headerTitle}>Join With Link</Text>
          
                   </View> 
                   <View style={{flexDirection:'row',gap:10}}>
             <TextInput placeholder='Join and Enjoy it' style={styles.linkinput}
             placeholderTextColor={"white"}/>

             <TouchableOpacity>
             <LinearGradient 
            colors={['#a90657', '#2b09a6']}
            style={styles.joinbtn}>
                <Text style={styles.content}>Join</Text>
            </LinearGradient>
            </TouchableOpacity>
            
             </View>
             </View>
    </View>
  )
}

export default WatchpartyScreen

const styles = StyleSheet.create({
    joinbtn:
    {
        backgroundColor:'white',
        height:hp(5),
        alignItems:'center',
        justifyContent:'center',
        width:wp(20),
        borderRadius:15,
        marginTop:10
    },
    linkinput:
    {
        height:hp(5),
        backgroundColor:'#76767d',
        padding:10,
        borderRadius:15,
        marginTop:10,
        width:wp(60),
        color:'white'
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
    createroombtn:
    {
        backgroundColor:'white',
        height:hp(5),
        alignItems:'center',
        justifyContent:'center',
        width:wp(40),
        borderRadius:15,
        marginTop:17
    },
     insightbox:
    {
      height:"auto",
      width:wp(92),
      alignSelf:'center',
      borderRadius:20,
      padding:20,
      elavation:10,
      marginTop:30
    },
     insightboxshort:
    {
      backgroundColor:'#38383b',
      height:"auto",
      width:wp(92),
      alignSelf:'center',
      borderRadius:20,
      padding:20,
      elavation:10,
      marginTop:30
    },
     content:
    {
        fontSize:hp(2),
        color:'#ffffff',
        fontWeight:'300'
    },
      container:{
     flex: 1,
    backgroundColor: 'black',
    padding:20
  },
  headerTitle: {
      color: '#fff',
      fontSize:hp(2.3),
      fontWeight: '800',
      letterSpacing: 0.5,
    },
})