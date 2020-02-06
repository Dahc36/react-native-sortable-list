import React, { useMemo, useRef, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { TapGestureHandler, State as GestureStates } from 'react-native-gesture-handler';

function findIndex(rangeArray, value) {
  let leftPointer = 0;
  let rightPointer = rangeArray.length - 1;
  while (leftPointer <= rightPointer) {
    let middlePoint = Math.floor((leftPointer + rightPointer) / 2);
    if (rangeArray[middlePoint] < value) {
      if (middlePoint === rangeArray.length || rangeArray[middlePoint + 1] > value) {
        return middlePoint + 1;
      }
      leftPointer = middlePoint + 1;
    } else if (rangeArray[middlePoint] > value) {
      if (middlePoint === 0 || rangeArray[middlePoint - 1] < value) {
        return middlePoint;
      }
      rightPointer = middlePoint - 1;
    } else {
      return middlePoint;
    }
  }
}

function MySectionList({
  headerHeight,
  itemHeight,
  sections,
  keyExtractorItem,
  keyExtractorSection,
  renderItem,
  renderSectionHeader,
}) {
  console.log('render');
  const [highligthedSectionId, setHighlightedSectionId] = useState(null);
  const scrollOffset = useRef(0);

  const sectionBreakpoints = useMemo(() => {
    const test = sections.reduce((result, section, index) => {
      const sectionHeight = headerHeight + section.data.length * itemHeight;
      result.push(index > 0 ? result[index - 1] + sectionHeight : sectionHeight);
      return result;
    }, []);
    console.log(test);
    return test;
  }, [sections]);

  function handleScroll(event) {
    const { nativeEvent } = event;
    scrollOffset.current = nativeEvent.contentOffset.y;
  }

  function handleTapStateChange(event) {
    const { nativeEvent } = event;
    if (nativeEvent.state === GestureStates.BEGAN) {
      setHighlightedSectionId(
        keyExtractorSection(
          sections[findIndex(sectionBreakpoints, nativeEvent.y + scrollOffset.current)]
        )
      );
    }
  }

  return (
    <TapGestureHandler maxPointers={1} onHandlerStateChange={handleTapStateChange}>
      <View style={styles.screen}>
        <SectionList
          onScroll={handleScroll}
          keyExtractor={keyExtractorItem}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader.bind(null, highligthedSectionId)}
          sections={sections}
        />
      </View>
    </TapGestureHandler>
  );
}

const styles = StyleSheet.create({
  screen: {},
});

export default MySectionList;
