import { StyleSheet, Text, TextInput, View,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import LinearGradient from 'react-native-linear-gradient'

const CreateroomScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Create Your Party</Text>
      <Text style={[styles.headerTitle,{marginTop:35,fontWeight:'400'}]}>Room Name</Text>
      <TextInput style={styles.linkinput}
      placeholderTextColor={"white"}
      placeholder='Friday Night Reels'></TextInput>
     <Text style={[styles.headerTitle,{marginTop:35,fontWeight:'400'}]}>Visiblity</Text>
     
           <View style={{flexDirection:'row',width:wp(92),
             justifyContent:'space-between',alignSelf:'center'}}>
             
               <View style={[styles.insightboxshort,{flexDirection:'column',gap:10}]}>
     
              <View style={{flexDirection:'row',gap:10,alignItems:'center'}}>
     
                <View style={styles.iconbox}>
                 <Image source={require("../Assests/lock.png")}
                 style={styles.actionEmoji}/>
                 </View>
                 <Text style={styles.headerTitle}>Private </Text>
     
              </View>
     
              <Text style={[styles.content,{fontWeight:'400'}]}>Invite Only</Text>
              </View>
     
       <View style={[styles.insightboxshort,{flexDirection:'column',gap:10}]}>
     
              <View style={{flexDirection:'row',gap:10,alignItems:'center'}}>
     
                <View style={styles.iconbox}>
                 <Image source={require("../Assests/global.png")}
                 style={styles.actionEmoji}/>
                 </View>
                 <Text style={styles.headerTitle}>Public</Text>
     
              </View>
     
              <Text style={[styles.content,{fontWeight:'400'}]}>Anyone Can Join</Text>
              </View>
     
           </View>

           <View style={styles.notebox}>
            <Text style={[styles.content,{fontWeight:'300'}]}>After creating, share the room link so friends can join and watch in sync.</Text>
            </View>        

             <TouchableOpacity>

                         <LinearGradient 
                        colors={['#a90657', '#2b09a6']}
                        style={styles.joinbtn}>
                            <Text style={styles.content}>Create And Get Link</Text>
                        </LinearGradient>

             </TouchableOpacity>            
    </View>
  )
}

export default CreateroomScreen

const styles = StyleSheet.create({
     joinbtn:
        {
            backgroundColor:'white',
            height:hp(6),
            alignItems:'center',
            justifyContent:'center',
            width:wp(92),
            borderRadius:15,
            marginTop:30
        },
    notebox:
    {
        height:hp(13),
        width:wp(92),
        borderRadius:15,
        backgroundColor:'#38383b',
        padding:10,
        alignItems:'center',
        justifyContent:'center',
        marginTop:30
    },
     content:
    {
        fontSize:hp(2.1),
        color:'white'
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
    linkinput:
    {
        height:hp(5),
        backgroundColor:'#76767d',
        padding:10,
        borderRadius:15,
        marginTop:10,
        width:wp(92),
        color:'white'
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