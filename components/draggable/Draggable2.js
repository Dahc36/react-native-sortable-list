import React, { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { PanGestureHandler, State as GestureStates } from 'react-native-gesture-handler';

function Draggable2() {
  const fingerPosX = useRef(0);
  const fingerPosY = useRef(0);

  const [panIsActive, setPanIsActive] = useState(false);
  const panPositionX = useRef(new Animated.Value(-100));
  const panPositionY = useRef(new Animated.Value(-100));

  const screenRef = useRef(null);
  const [didScreenLayout, setDidScreenLayout] = useState(false);
  const screenPositionX = useRef(new Animated.Value(0));
  const screenPositionY = useRef(new Animated.Value(0));

  const draggablePosX = useRef(
    Animated.sub(panPositionX.current, screenPositionX.current)
  );
  const draggablePosY = useRef(
    Animated.sub(panPositionY.current, screenPositionY.current)
  );
  const draggableOpacity = useRef(new Animated.Value(0));

  const draggedOpacity = useRef(new Animated.Value(1));

  const [testState, setTestState] = useState(0);

  useEffect(() => {
    didScreenLayout &&
      screenRef.current.measure((x, y, width, height, pageX, pageY) => {
        screenPositionX.current.setValue(pageX);
        screenPositionY.current.setValue(pageY);
      });
  }, [screenRef.current, didScreenLayout]);

  Animated.useCode(
    () =>
      Animated.call([panPositionX.current, panPositionY.current], ([x, y]) => {
        fingerPosX.current = x;
        fingerPosY.current = y;
      }),
    [panPositionX.current, panPositionY.current]
  );

  function handlePanGesture(event) {
    const { nativeEvent } = event;
    panPositionX.current.setValue(nativeEvent.absoluteX);
    panPositionY.current.setValue(nativeEvent.absoluteY);
  }

  function handlePanStateChange(event) {
    const { nativeEvent } = event;
    const isActive = nativeEvent.state === GestureStates.ACTIVE;
    setPanIsActive(isActive);
    draggableOpacity.current.setValue(isActive ? 1 : 0);
    draggedOpacity.current.setValue(isActive ? 0.5 : 1);
  }

  return (
    <View ref={screenRef} style={styles.screen} onLayout={() => setDidScreenLayout(true)}>
      {/* <Text>X: {posX}</Text>
      <Text>Y: {posY}</Text> */}
      <PanGestureHandler
        maxPointers={1}
        onGestureEvent={handlePanGesture}
        onHandlerStateChange={handlePanStateChange}
      >
        <Animated.View style={{ opacity: draggedOpacity.current }}>
          <Text>Hello my baby</Text>
        </Animated.View>
      </PanGestureHandler>
      {/* <Button
        title="Show me the money"
        onPress={() => {
          console.log('onPress');
          console.log(screenPositionX);
          console.log(screenPositionY);
        }}
      /> */}
      {/* <Button title="TEST" onPress={() => setPanIsActive(v => !v)} /> */}
      <Text>{testState}</Text>
      {panIsActive && (
        <Animated.View
          style={[
            styles.draggable,
            {
              left: draggablePosX.current,
              top: draggablePosY.current,
            },
          ]}
        >
          <View>
            <Text>Hello my baby</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {},
  draggable: {
    // backgroundColor: 'black',
    // opacity: 0,
    position: 'absolute',
  },
  text: {
    // color: 'white',
  },
});

export default Draggable2;
