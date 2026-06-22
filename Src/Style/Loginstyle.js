import { StyleSheet } from "react-native"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
 
const styles = StyleSheet.create({
    subheading:
    {
        color:'white',
    },
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },

  logo: {
    fontSize:hp(5.5),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },

  input: {
    width: '100%',
    height:hp(7),
    // borderBottomWidth: 1.5,
    // borderBottomColor: '#444',
    // color: "red",
    fontSize:hp(1.8),
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius:15,
    backgroundColor:'#B8B8C5',
    color:"#000"
  },

  buttonContainer: {
    backgroundColor: '#FF007F',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  registerText: {
    marginTop: 20,
    color: '#bbb',
    fontSize: 14,
  },
})

export default styles;