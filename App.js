import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';

import Draggable from './components/draggable/Draggable2';
import DragAndDropSectionList from './components/dragAndDropSectionList/test';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ backgroundColor: 'peachpuff', height: '10%' }}></View>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ backgroundColor: 'yellowgreen', width: '10%' }}></View>
        <View style={{ backgroundColor: 'white' }}>
          <DragAndDropSectionList />
        </View>
      </View>
      <View style={{ backgroundColor: 'peachpuff', height: '5%' }}></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderColor: 'red',
    // borderBottomWidth: 1,
  },
});
