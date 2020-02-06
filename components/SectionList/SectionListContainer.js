import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import MySectionList from './index';

const data = [
  { noteId: '0', noteTitle: 'My tasks', data: ["Book doctor's appoinment", 'Buy ice'] },
  {
    noteId: '1',
    noteTitle: 'Groceries',
    data: ['Buy Tequila', 'Buy Cointreau', 'Buy limes'],
  },
  {
    noteId: '2',
    noteTitle: 'Everyday activities',
    data: ['Walk the dog', 'Go to the Gym'],
  },
];

const HEADER_HEIGHT = 20 + 35 + 15;
const ITEM_HEIGHT = 24 + 17 * 2;

function Item({ title }) {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{title}</Text>
    </View>
  );
}

function SectionListContainer() {
  return (
    <MySectionList
      headerHeight={HEADER_HEIGHT}
      itemHeight={ITEM_HEIGHT}
      sections={data}
      keyExtractorItem={(item, index) => item + index}
      keyExtractorSection={section => section.noteId}
      renderItem={({ item }) => <Item title={item} />}
      renderSectionHeader={(
        highlightedSectionId,
        { section: { noteTitle, noteId, data } }
      ) => (
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {noteTitle.toUpperCase()} ({data.length}){' '}
            {highlightedSectionId === noteId && 'Highlighted'}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: {},
  headerContainer: {
    flexDirection: 'row',
    height: HEADER_HEIGHT,
    marginHorizontal: 16,
    paddingHorizontal: 24,
    paddingTop: 35,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
  },
  headerText: {
    fontSize: 14,
    color: '#737373',
  },
  itemContainer: {
    flexDirection: 'row',
    height: ITEM_HEIGHT,
    marginHorizontal: 16,
    paddingHorizontal: 24,
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
  },
  itemText: {
    fontSize: 18,
    color: 'black',
  },
});

export default SectionListContainer;
