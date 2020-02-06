import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  SectionList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Image,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { PanGestureHandler, State as GestureStates } from 'react-native-gesture-handler';
// import { TapGestureHandler, State as GestureStates } from 'react-native-gesture-handler';

import SectionItem from './SectionItem';

import { findIndex } from './helpers';

function MySectionList({
  headerHeight,
  itemHeight,
  keyExtractorItem,
  keyExtractorSection,
  draggableItem,
  draggableOffset,
  renderItem,
  renderSectionHeader,
  sections,
}) {
  console.log('render');
  const [selectedItem, setSelectedItem] = useState(null);
  const [highligthedSectionId, setHighlightedSectionId] = useState(null);
  const scrollOffset = useRef(0);

  // Pan gesture information
  const [panIsActive, setPanIsActive] = useState(false);
  const panPositionX = useRef(new Animated.Value(-100));
  const panPositionY = useRef(new Animated.Value(-100));

  // Component's position in the screen
  const screenRef = useRef(null);
  const [didScreenLayout, setDidScreenLayout] = useState(false);
  const screenPositionX = useRef(new Animated.Value(0));
  const screenPositionY = useRef(new Animated.Value(0));
  const screenOffsetY = useRef(0);

  // Draggable's absolute position
  const draggablePosX = useRef(
    Animated.sub(panPositionX.current, screenPositionX.current, draggableOffset.x)
  );
  const draggablePosY = useRef(
    Animated.sub(panPositionY.current, screenPositionY.current, draggableOffset.y)
  );

  // Opacity to smoothly appear instead of jumping
  const draggableOpacity = useRef(new Animated.Value(0));

  // Sections' relative breakpoints
  const sectionBreakpoints = useMemo(() => {
    const test = sections.reduce((result, section, index) => {
      const sectionHeight = headerHeight + section.data.length * itemHeight;
      result.push(index > 0 ? result[index - 1] + sectionHeight : sectionHeight);
      return result;
    }, []);
    console.log(test);
    return test;
  }, [sections]);

  // Sets the component position
  useEffect(() => {
    didScreenLayout &&
      screenRef.current.measure((x, y, width, height, pageX, pageY) => {
        screenPositionX.current.setValue(pageX);
        screenPositionY.current.setValue(pageY);
        screenOffsetY.current = pageY;
      });
  }, [screenRef.current, didScreenLayout]);

  function handlePressItem(item) {
    console.log('handlePressItem');
    console.log(item);
  }

  function handleScroll(event) {
    const { nativeEvent } = event;
    scrollOffset.current = nativeEvent.contentOffset.y;
  }

  function handleTapStateChange(event) {
    const { nativeEvent } = event;
    if (nativeEvent.state === GestureStates.BEGAN) {
      setHighlightedSectionId(
        keyExtractorSection(
          sections[
            findIndex(
              sectionBreakpoints,
              nativeEvent.y + scrollOffset.current - screenOffsetY.current
            )
          ]
        )
      );
    }
  }

  function handlePanGesture(event) {
    const { nativeEvent } = event;
    panPositionX.current.setValue(nativeEvent.absoluteX);
    panPositionY.current.setValue(nativeEvent.absoluteY);
    // console.log(nativeEvent);
    setHighlightedSectionId(
      keyExtractorSection(
        sections[
          findIndex(
            sectionBreakpoints,
            nativeEvent.absoluteY - screenOffsetY.current + scrollOffset.current
          )
        ]
      )
    );
  }

  function handlePanStateChange(item, event) {
    const { nativeEvent } = event;
    switch (nativeEvent.state) {
      case GestureStates.BEGAN:
        item !== selectedItem && setSelectedItem(item);
        break;
      case GestureStates.ACTIVE:
        setPanIsActive(true);
        setTimeout(() => draggableOpacity.current.setValue(1), 100);
        break;
      default:
        setPanIsActive(false);
        draggableOpacity.current.setValue(0);
        setHighlightedSectionId(null);
    }
  }

  return (
    <View ref={screenRef} style={styles.screen} onLayout={() => setDidScreenLayout(true)}>
      <SectionList
        onScroll={handleScroll}
        keyExtractor={keyExtractorItem}
        renderItem={itemData => (
          <View
            style={[panIsActive && selectedItem === itemData.item && styles.draggedItem]}
          >
            {renderItem(
              <PanGestureHandler
                maxPointers={1}
                onGestureEvent={handlePanGesture}
                onHandlerStateChange={handlePanStateChange.bind(null, itemData.item)}
              >
                <Animated.View style={{ opacity: 1 }}>{draggableItem}</Animated.View>
              </PanGestureHandler>,
              itemData.item
            )}
          </View>
        )}
        renderSectionHeader={renderSectionHeader.bind(null, highligthedSectionId)}
        sections={sections}
      />
      {selectedItem && panIsActive && (
        <Animated.View
          style={[
            styles.draggableItem,
            {
              left: draggablePosX.current,
              top: draggablePosY.current,
              opacity: draggableOpacity.current,
            },
          ]}
        >
          {renderItem(draggableItem, selectedItem)}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {},
  draggableItem: {
    position: 'absolute',
    zIndex: 99,
    elevation: 99,
  },
  draggedItem: {
    opacity: 0.3,
  },
});

export default MySectionList;
