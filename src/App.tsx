import {StatusBar} from 'expo-status-bar';
import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

import * as pkg from '../package.json';

export default function App() {
  const [modalText, setModalText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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

      <StatusBar style="auto" />
    </View>
  );
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
