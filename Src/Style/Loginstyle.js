import { StyleSheet } from "react-native"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
 
const styles = StyleSheet.create({
  otpbox:
  {
    height:hp(7),
    width:wp(12),
    borderColor:'#f91a89',
    borderRadius:15,
    marginTop:20,
    borderWidth:1,
    marginBottom:20,
    fontSize:hp(4),
    paddingLeft:15
  },
  forgetbox:
  {
    backgroundColor:'#38383b',
     height:hp(65),
    width:wp(95),
    alignSelf:'center',
    borderRadius:40,
    padding:20,
    elavation:10,
    justifyContent:'center',
    paddingTop:-20,
    alignItems:'center',
    elevation:10
  },
  forgetpic:
  {
    height:hp(20),
    width:wp(50),
    alignSelf:'center'
  },
  forgetpass:
  {
    color:"white",
    fontWeight:'bold',
    alignSelf:'flex-end',
    marginTop:-10,
    marginRight:12
  },
  loginlogo:
  {
    height:hp(9),
    width:wp(9)
  },
  loginbox:
  {
    backgroundColor:'#38383b',
     height:hp(65),
    width:wp(95),
    alignSelf:'center',
    borderRadius:40,
    padding:20,
    elavation:10,
    justifyContent:'center',
    paddingTop:-20,
    elevation:10
  },
    subheading:
    {
        color:'#bbb',
        fontSize:hp(1.7),
        // alignSelf:'center',
        marginBottom:20
    },

    container:
    {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  heading: {
    fontSize:hp(3.2),
    fontWeight: 'bold',
    color: '#fff',
    // alignSelf:'center',
    marginTop:10,
  },

  input: {
    width:wp(85),
    height:hp(6.5),
    fontSize:hp(1.8),
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius:15,
    alignSelf:'center',
    backgroundColor:'#ddddeb',
    color:"black",
    placeholderTextColor:"red"
  },

  loginbtn: {
    backgroundColor: '#FF007F',
    padding: 15,
    borderRadius: 20,
    width:wp(85),
    height:hp(6.5),
    alignSelf:'center',
    alignItems:'center',
    marginTop:10
  },

  buttonText: {
    color: '#fff',
    fontSize:hp(2.2),
    fontWeight: 'bold',
  },

  registerText: {
    marginTop: 20,
    color: '#bbb',
    fontSize: hp(2),
    alignSelf:'center'
  },
})

export default styles;