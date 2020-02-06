import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import MySectionList from './index';

const data = [
  {
    noteId: 'n0',
    noteTitle: 'My tasks',
    data: [
      { id: 't0', title: "Book doctor's appoinment" },
      { id: 't1', title: 'Buy ice' },
    ],
  },
  {
    noteId: 'n1',
    noteTitle: 'Groceries',
    data: [
      { id: 't2', title: 'Buy Tequila' },
      { id: 't3', title: 'Buy Cointreau' },
      { id: 't4', title: 'Buy limes' },
    ],
  },
  {
    noteId: 'n2',
    noteTitle: 'Everyday activities',
    data: [
      { id: 't5', title: 'Walk the dog' },
      { id: 't6', title: 'Go to the Gym' },
    ],
  },
];

const HEADER_MARGIN = 15;
const HEADER_HEIGHT = 20;
const ITEM_MARGIN_BOTTOM = 0;
const ITEM_HEIGHT = 24 + 17 * 2;

function Item({ title, draggableItem }) {
  return (
    <View style={styles.itemContainer}>
      {draggableItem}
      <Text style={styles.itemText}>{title}</Text>
    </View>
  );
}

function DraggableItem() {
  return (
    <View style={styles.draggableItemContainer}>
      <Image
        style={styles.draggableItem}
        source={require('../../assets/DragDrop/Handle.png')}
      />
    </View>
  );
}

function SectionListContainer() {
  return (
    <MySectionList
      headerHeight={HEADER_HEIGHT}
      headerMarginTop={HEADER_MARGIN}
      itemHeight={ITEM_HEIGHT}
      itemMarginBottom={ITEM_MARGIN_BOTTOM}
      sections={data}
      keyExtractorItem={item => item.id}
      keyExtractorSection={section => section.noteId}
      draggableItem={<DraggableItem />}
      draggableOffset={{ x: 46, y: HEADER_HEIGHT / 2 - 6 }}
      renderItem={(draggableItem, item) => (
        <Item title={item.title} draggableItem={draggableItem} />
      )}
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
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 24,
    marginTop: HEADER_MARGIN,
    paddingVertical: 15,
    borderWidth: 1,
    // borderBottomWidth: 1,
    // borderBottomColor: '#E6E6E6',
  },
  headerText: {
    fontSize: 14,
    color: '#737373',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ITEM_HEIGHT,
    marginHorizontal: 16,
    paddingHorizontal: 24,
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
    backgroundColor: 'white',
  },
  itemText: {
    fontSize: 18,
    color: 'black',
  },
  draggableItem: {
    tintColor: '#A73CBD',
  },
  draggableItemContainer: {
    marginRight: 6,
  },
});

export default SectionListContainer;
