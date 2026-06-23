import { StyleSheet } from "react-native"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
 
const styles = StyleSheet.create({
  loginlogo:
  {
    height:hp(9),
    width:wp(9)
  },
  loginbox:
  {
    backgroundColor:'#38383b',
     height:hp(75),
    width:wp(95),
    alignSelf:'center',
    borderRadius:40,
    padding:20,
    elavation:10,
    justifyContent:'center',
    paddingTop:-20
  },
    subheading:
    {
        color:'#bbb',
        fontSize:hp(2),
        // alignSelf:'center',
        marginBottom:30
    },

    container:
    {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    // backgroundColor: '#121212',
  },

  heading: {
    fontSize:hp(4),
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
    fontSize:hp(2),
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