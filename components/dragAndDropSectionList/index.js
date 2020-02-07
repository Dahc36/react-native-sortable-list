import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Dimensions, SectionList, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { PanGestureHandler, State as GestureStates } from 'react-native-gesture-handler';

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
  onDrop,
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemSectionId, setSelectedItemSectionId] = useState(null);
  const [highligthedSectionId, setHighlightedSectionId] = useState(null);
  const scrollOffset = useRef(0);
  const sectionListRef = useRef();
  const isSectionListScrolling = useRef(false);

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
  const screenHeight = useRef(0);

  // Draggable item's absolute position
  const draggablePosX = useRef(
    Animated.sub(panPositionX.current, screenPositionX.current, draggableOffset.x)
  );
  const draggablePosY = useRef(
    Animated.sub(panPositionY.current, screenPositionY.current, draggableOffset.y)
  );

  // Opacity to smoothly appear instead of jumping (needed for android)
  const draggableOpacity = useRef(new Animated.Value(0));

  // Sections' relative breakpoints
  const sectionBreakpoints = useMemo(
    () =>
      sections.reduce((result, section, index) => {
        const sectionHeight = headerHeight + section.data.length * itemHeight;
        result.push(index > 0 ? result[index - 1] + sectionHeight : sectionHeight);
        return result;
      }, []),
    [sections]
  );

  // Sets the component position
  useEffect(() => {
    didScreenLayout &&
      screenRef.current.measure((x, y, width, height, pageX, pageY) => {
        screenPositionX.current.setValue(pageX);
        screenPositionY.current.setValue(pageY);
        screenOffsetY.current = pageY;
        screenHeight.current = height;
      });
  }, [screenRef.current, didScreenLayout]);

  function handleScroll(event) {
    const { nativeEvent } = event;
    scrollOffset.current = nativeEvent.contentOffset.y;
  }

  function moveSectionList(absoluteY) {
    if (absoluteY - screenOffsetY.current + 130 > screenHeight.current) {
      if (!isSectionListScrolling.current) {
        isSectionListScrolling.current = true;
        scrollSectionList(-10);
      }
    } else if (absoluteY - screenOffsetY.current < 130) {
      if (!isSectionListScrolling.current) {
        isSectionListScrolling.current = true;
        scrollSectionList(10);
      }
    } else {
      isSectionListScrolling.current = false;
    }
  }

  function scrollSectionList(offset) {
    if (offset > 0 && scrollOffset.current === 0) {
      isSectionListScrolling.current = false;
    }
    if (!isSectionListScrolling.current) {
      return;
    }
    sectionListRef.current.scrollToLocation({
      sectionIndex: 0,
      itemIndex: 0,
      viewOffset: -scrollOffset.current + offset,
      animated: false,
    });
    requestAnimationFrame(() => scrollSectionList(offset));
  }

  function handlePanGesture(event) {
    const { nativeEvent } = event;
    panPositionX.current.setValue(nativeEvent.absoluteX);
    panPositionY.current.setValue(nativeEvent.absoluteY);
    requestAnimationFrame(() => {
      moveSectionList(nativeEvent.absoluteY);
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
    }); // TODO: Google
  }

  function handlePanStateChange({ section, item }, event) {
    const { nativeEvent } = event;
    switch (nativeEvent.state) {
      case GestureStates.BEGAN:
        item !== selectedItem && setSelectedItem(item);
        setSelectedItemSectionId(keyExtractorSection(section));
        break;
      case GestureStates.ACTIVE:
        setPanIsActive(true);
        // Needed to avoid jumps in android
        setTimeout(() => draggableOpacity.current.setValue(1), 100);
        break;
      default:
        setSelectedItem(null);
        setPanIsActive(false);
        draggableOpacity.current.setValue(0);
        setHighlightedSectionId(null);
        isSectionListScrolling.current = false;
        highligthedSectionId != null && onDrop({ section, item }, highligthedSectionId);
    }
  }

  return (
    <View ref={screenRef} style={styles.screen} onLayout={() => setDidScreenLayout(true)}>
      {/* <Button
        title="sdf"
        onPress={() => {
          console.log(scrollOffset.current);
          console.log(screenHeight.current);
        }}
      /> */}
      <SectionList
        ref={sectionListRef}
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
                onHandlerStateChange={handlePanStateChange.bind(null, itemData)}
              >
                <Animated.View style={{ opacity: 1 }}>{draggableItem}</Animated.View>
              </PanGestureHandler>,
              itemData.item
            )}
          </View>
        )}
        renderSectionHeader={renderSectionHeader.bind(
          null,
          highligthedSectionId,
          selectedItemSectionId
        )}
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
