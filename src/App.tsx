import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect, useRef} from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import * as Updates from 'expo-updates';

import * as pkg from '../package.json';
import Anchor from './components/Anchor';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [modalText, setModalText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  const _handleRedirect = (event) => {
    console.log('Linking event received', event);
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    Linking.addEventListener('url', _handleRedirect);

    notificationListener.current =
      Notifications.addNotificationReceivedListener(event => {
        setNotification(event);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });

    Linking.getInitialURL().then(url => {
      console.log('getInitialURL', url);
    });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current,
      );
      Notifications.removeNotificationSubscription(responseListener.current);

      Linking.removeEventListener('url', _handleRedirect);
    };
  }, []);

  const showModal = (text: string) => {
    setModalText(text);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        {modalVisible && (
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ScrollView>
                <Text style={styles.modalText}>{modalText}</Text>
              </ScrollView>
              <Pressable
                style={[styles.button]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>
      <View>
        <Text style={styles.boldText}>
          {pkg.name}@{pkg.version}
        </Text>
      </View>
      <View>
        <Text>{Constants.nativeAppVersion}</Text>
        <Text>{Constants.nativeBuildVersion}</Text>
      </View>
      <View>
        <Pressable
          style={[styles.button]}
          onPress={() => showModal(JSON.stringify(process.env, null, 2))}>
          <Text style={styles.textStyle}>Show process.env</Text>
        </Pressable>
        <Pressable
          style={[styles.button]}
          onPress={() => showModal(JSON.stringify(Constants, null, 2))}>
          <Text style={styles.textStyle}>Show Constants</Text>
        </Pressable>
        <Pressable
          style={[styles.button]}
          onPress={() => showModal(JSON.stringify(Updates, null, 2))}>
          <Text style={styles.textStyle}>Show Updates</Text>
        </Pressable>
      </View>
      <Text>Push token:{expoPushToken || '-'}</Text>
      <View>
        <Text>Title:{notification?.request.content.title || '-'}</Text>
        <Text>Body:{notification?.request.content.body || '-'}</Text>
        <Text>
          Data:{JSON.stringify(notification?.request.content.data || '')}
        </Text>
      </View>
      <Pressable
        style={[styles.button]}
        onPress={() => schedulePushNotification()}>
        <Text style={styles.textStyle}>Schedule Notification</Text>
      </Pressable>
      <Pressable
        style={[styles.button]}
        onPress={() => Linking.openURL('https://expo.dev')}>
        <Text style={styles.textStyle}>Open Link</Text>
      </Pressable>
      <Anchor href="https://google.com">Go to google.com</Anchor>
      <Text>
        {Linking.createURL('path/test', {queryParams: {key: 'value'}})}
      </Text>

      <StatusBar style="auto" />
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Notification body',
      data: {data: 'goes here'},
    },
    trigger: {seconds: 2},
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.error('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boldText: {
    color: 'black',
    fontWeight: 'bold',
    margin: 8,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 16,
    backgroundColor: 'white',
    padding: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 4,
    padding: 10,
    minWidth: 180,
    margin: 4,
    elevation: 2,
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontFamily: 'monospace',
    marginBottom: 8,
  },
});
