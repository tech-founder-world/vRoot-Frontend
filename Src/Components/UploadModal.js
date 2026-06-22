// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Modal,
//   StyleSheet,
//   Image,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// export default function UploadModal({ visible, onClose, navigation }) {
//   const navigate = (screen) => {
//     onClose();
//     setTimeout(() => navigation.navigate(screen), );
//   };

//   return (
//     <Modal
//       transparent
//       animationType="fade"
//       visible={visible}
//       onRequestClose={onClose}
//     >
//       <View style={styles.overlay}>
//         <View style={styles.sheet}>

//           {/* Drag Indicator */}
//           <View style={styles.dragIndicator} />

//           <Text style={styles.title}>Create</Text>

//           {/* Upload Reel */}
//           <TouchableOpacity
//             style={styles.option}
//             onPress={() => navigate('UploadReel')}
//             activeOpacity={0.85}
//           >
//             <View style={[styles.iconBox, { backgroundColor: '#FF2E63' }]}>
//               <Image source={require("../Assests/reel.png")} style={{ height: 22, width: 22 }} />
//             </View>
//             <View>
//               <Text style={styles.optionTitle}>Upload Reel</Text>
//               <Text style={styles.optionSub}>Short vertical video</Text>
//             </View>
//           </TouchableOpacity>

//           {/* Upload Long Video */}
//           <TouchableOpacity
//             style={styles.option}
//             onPress={() => navigate('UploadLongVideo')}
//             activeOpacity={0.85}
//           >
//             <View style={[styles.iconBox, { backgroundColor: '#3B82F6' }]}>
//               <Image source={require("../Assests/video.png")} style={{ height: 22, width: 22 }} />

//             </View>
//             <View>
//               <Text style={styles.optionTitle}>Upload Long Video</Text>
//               <Text style={styles.optionSub}>YouTube style content</Text>
//             </View>
//           </TouchableOpacity>

//           {/* Cancel */}
//           <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
//             <Text style={styles.cancelText}>Cancel</Text>
//           </TouchableOpacity>

//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.6)',
//   },

//   sheet: {
//     backgroundColor: '#0F0F0F',
//     padding: 20,
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//   },

//   dragIndicator: {
//     width: 45,
//     height: 5,
//     backgroundColor: '#444',
//     borderRadius: 3,
//     alignSelf: 'center',
//     marginBottom: 12,
//   },

//   title: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: '700',
//     marginBottom: 20,
//     textAlign: 'center',
//   },

//   option: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 14,
//     borderRadius: 14,
//     backgroundColor: '#1A1A1A',
//     marginBottom: 14,
//   },

//   iconBox: {
//     width: 46,
//     height: 46,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },

//   optionTitle: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   optionSub: {
//     color: '#9CA3AF',
//     fontSize: 13,
//     marginTop: 2,
//   },

//   cancelBtn: {
//     marginTop: 10,
//     paddingVertical: 14,
//   },

//   cancelText: {
//     color: '#FF2E63',
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
// });



import React from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet, Image,
} from 'react-native';

export default function UploadModal({ visible, onClose, navigation }) {

  const navigate = (screen) => {
    onClose();
    setTimeout(() => navigation.navigate(screen), 300);
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          <View style={styles.dragIndicator} />
          <Text style={styles.title}>Create</Text>

          {/* ✅ Upload Post */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigate('UploadScreen')}
            activeOpacity={0.85}
          >
            <View style={[styles.iconBox, { backgroundColor: '#FF007F' }]}>
              <Text style={styles.emoji}>🖼️</Text>
            </View>
            <View>
              <Text style={styles.optionTitle}>Upload Post</Text>
              <Text style={styles.optionSub}>Photo with caption</Text>
            </View>
          </TouchableOpacity>

          {/* ✅ Upload Reel */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigate('UploadReel')}
            activeOpacity={0.85}
          >
            <View style={[styles.iconBox, { backgroundColor: '#7C3AED' }]}>
              <Image source={require("../Assests/reel.png")} style={{ height: 22, width: 22, tintColor: '#fff' }} />
            </View>
            <View>
              <Text style={styles.optionTitle}>Upload Reel</Text>
              <Text style={styles.optionSub}>Short vertical video</Text>
            </View>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { backgroundColor: '#0F0F0F', padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  dragIndicator: { width: 45, height: 5, backgroundColor: '#444', borderRadius: 3, alignSelf: 'center', marginBottom: 12 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 20, textAlign: 'center' },

  option: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, backgroundColor: '#1A1A1A', marginBottom: 14 },
  iconBox: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  emoji: { fontSize: 22 },

  optionTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  optionSub: { color: '#9CA3AF', fontSize: 13, marginTop: 2 },

  cancelBtn: { marginTop: 10, paddingVertical: 14 },
  cancelText: { color: '#FF2E63', fontSize: 16, fontWeight: '600', textAlign: 'center' },
});