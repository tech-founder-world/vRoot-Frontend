import { StyleSheet } from "react-native"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
 
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  gradient: {
    flex: 1,
  },

  header: {
    marginTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  headerBtn: {
    minWidth: 70,
  },

  cancelText: {
    color: '#999',
    fontSize: 15,
    fontWeight: '500',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  doneBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },

  doneText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },

  profileBorder: {
    width: 118,
    height: 118,
    borderRadius: 59,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  profilePic: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#222',
  },

  changePicBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },

  changePicText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  formContainer: {
    paddingHorizontal: 18,
  },

  inputCard: {
    backgroundColor: '#181818',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#252525',
  },

  label: {
    color: '#FF007F',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.5,
  },

  input: {
    color: '#fff',
    fontSize: 15,
    padding: 0,
  },

  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  switchCard: {
    backgroundColor: '#181818',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#252525',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  privateTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  privateSub: {
    color: '#777',
    fontSize: 12,
    marginTop: 4,
  },

  settingbox:
  {
    backgroundColor:'#38383b',
    height:"auto",
    width:wp(92),
    alignSelf:'center',
    borderRadius:20,
    padding:20,
    elavation:10,
    paddingTop:-20,
    elevation:10,
    alignItems:'center',
    justifyContent:'center'


  },
    header: { fontSize:hp(2.5),
       fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10, 
        marginTop:20,
        marginLeft:15
        // textAlign: 'center',
       },
    
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingText: 
  { fontSize:hp(1.8), color: '#fff', marginLeft: 15, flex: 1 },

  logoutButton:
   { marginTop: 50, backgroundColor: '#FF007F', padding: 12, borderRadius: 10, alignItems: 'center' },

  logoutText: 
  { fontSize: 18, fontWeight: 'bold', color: '#fff' },

  deleteButton: 
  { marginTop: 15, backgroundColor: '#ff4444', padding: 12, borderRadius: 10, alignItems: 'center' },

  deleteText:
   { fontSize: 18, fontWeight: 'bold', color: '#fff' },

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