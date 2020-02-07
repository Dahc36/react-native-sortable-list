import React, { useState } from 'react';
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
  {
    noteId: 'n3',
    noteTitle: 'ASAP',
    data: [],
  },
];

const HEADER_HEIGHT = 20 + 35 + 15;
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
  const [sections, setSections] = useState(data);

  function handleDrop({ section, item }, selectedSectionId) {
    setSections(sections =>
      sections.map(sectionValue => {
        if (sectionValue.noteId === section.noteId) {
          const index = sectionValue.data.findIndex(v => v.id === item.id);
          return {
            ...sectionValue,
            data: [
              ...sectionValue.data.slice(0, index),
              ...sectionValue.data.slice(index + 1),
            ],
          };
        } else if (sectionValue.noteId === selectedSectionId) {
          return {
            ...sectionValue,
            data: [item, ...sectionValue.data],
          };
        } else {
          return sectionValue;
        }
      })
    );
  }

  return (
    <MySectionList
      headerHeight={HEADER_HEIGHT}
      itemHeight={ITEM_HEIGHT}
      sections={sections}
      keyExtractorItem={item => item.id}
      keyExtractorSection={section => section.noteId}
      draggableItem={<DraggableItem />}
      draggableOffset={{ x: 46, y: HEADER_HEIGHT / 2 - 6 }}
      renderItem={(draggableItem, item) => (
        <Item title={item.title} draggableItem={draggableItem} />
      )}
      renderSectionHeader={(
        highlightedSectionId,
        selectedItemsectionId,
        { section: { noteTitle, noteId, data } }
      ) => (
        <View style={styles.headerContainer}>
          <Text
            style={[
              styles.headerText,
              highlightedSectionId === noteId &&
                selectedItemsectionId !== noteId &&
                styles.headerHighlighted,
            ]}
          >
            {noteTitle.toUpperCase()} ({data.length})
          </Text>
          {highlightedSectionId === noteId && selectedItemsectionId !== noteId && (
            <Image
              style={styles.addIcon}
              source={require('../../assets/Global/Plus-Circle.png')}
            />
          )}
        </View>
      )}
      onDrop={handleDrop}
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
  headerHighlighted: {
    fontSize: 16,
    color: 'skyblue',
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
  addIcon: { tintColor: 'skyblue' },
  draggableItemContainer: {
    marginRight: 6,
  },
});

export default SectionListContainer;
