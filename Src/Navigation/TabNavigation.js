import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import HomeScreen from '../Screen/HomeScreen';
import ReelsScreen from '../Screen/ReelsScreen';
import ExploreScreen from '../Screen/ExploreScreen';
import ProfileScreen from '../Screen/ProfileScreen';
import UploadModal from '../Components/UploadModal';
import UploadTabButton from '../Components/UploadTabButton';

const Tab = createBottomTabNavigator();

const EmptyScreen = () => null;

export default function TabNavigation() {
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation(); // ✅ Stack navigation — UploadScreen & UploadReel navigate honge

  return (
    <>
      {/* ✅ Modal — Post ya Reel choose karo */}
      <UploadModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        navigation={navigation}
      />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ focused }) => {
            const icons = {
              Home: require('../Assests/home.png'),
              Explore: require('../Assests/search.png'),
              Reels: require('../Assests/reel.png'),
              Profile: require('../Assests/user.png'),
            };
            const icon = icons[route.name];
            if (!icon) return null;
            return (
              <View style={styles.iconWrapper}>
                <Image
                  source={icon}
                  style={{ height: 24, width: 24, tintColor: focused ? '#FF007F' : '#888' }}
                />
                {focused && <View style={styles.dot} />}
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        {/* <Tab.Screen name="Home"    component={PostHomeScreen} /> */}
        <Tab.Screen name="Explore" component={ExploreScreen} />

        {/* ✅ Center button — modal open karo */}
        <Tab.Screen
          name="Upload"
          component={EmptyScreen}
          options={{
            tabBarButton: () => (
              <UploadTabButton onPress={() => setShowModal(true)} />
            ),
          }}
        />

        <Tab.Screen name="Reels" component={ReelsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: { position: 'absolute', backgroundColor: '#0F0F0F', height: 65, borderTopWidth: 0, elevation: 10 },
  iconWrapper: { alignItems: 'center', justifyContent: 'center' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FF007F', marginTop: 3 },
});