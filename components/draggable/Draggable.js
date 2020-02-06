import React, { useRef, useState } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { cond, or, eq, add, call, set, sub, Value, event } = Animated;

export default function Draggable({ height, width }) {
  const [isDragging, setIsDragging] = useState(false);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const containerRef = useRef(null);

  const containerX = new Value(0);
  const containerY = new Value(0);

  const absoluteX = new Value(0);
  const absoluteY = new Value(0);
  const gestureState = new Value(-1);

  const middleX = sub(absoluteX, new Value(width / 2), containerX);
  const middleY = sub(absoluteY, new Value(height / 2), containerY);

  const handleGestureEvent = event([
    {
      nativeEvent: {
        absoluteX: absoluteX,
        absoluteY: absoluteY,
        state: gestureState,
      },
    },
  ]);

  function handleDragActive([x, y]) {
    console.log('dragging');
    // console.log(x);
    // console.log(y);
    setPosX(x);
    setPosY(y);
  }

  function handleDragBegin() {
    console.log('begin');
  }

  function handleDragEnd() {
    console.log('end');
  }

  return (
    <View
      ref={containerRef}
      style={{ backgroundColor: 'darksalmon', flex: 1, width: 200 }}
      // onLayout={e => {
      //   containerRef.current.measure((x, y, width, height, pageX, pageY) => {
      //     console.log('onlayout');
      //     containerX.setValue(pageX);
      //     containerY.setValue(pageY);
      //   });
      // }}
    >
      <Animated.Code>
        {() => cond(eq(gestureState.current, State.BEGAN), call([], handleDragBegin))}
      </Animated.Code>
      <Animated.Code>
        {() =>
          cond(
            eq(gestureState.current, State.ACTIVE),
            call([middleX, middleY], handleDragActive)
          )
        }
      </Animated.Code>
      <Animated.Code>
        {() =>
          cond(
            or(
              eq(gestureState.current, State.END),
              eq(gestureState.current, State.CANCELLED),
              eq(gestureState.current, State.FAILED)
            ),
            call([], handleDragEnd)
          )
        }
      </Animated.Code>

      <Text>Dragging: {isDragging}</Text>
      <Text>
        X: {posX}; Y: {posY}
      </Text>
      <PanGestureHandler
        maxPointers={1}
        minDist={5}
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleGestureEvent}
      >
        <Animated.View
          style={[
            styles.draggable,
            {
              left: middleX,
              top: middleY,
              height,
              width,
            },
          ]}
        >
          <View style={styles.textContainer}>
            <Text style={styles.text}>@</Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
      <Button
        onPress={() => {
          console.log('test');
          setPosX(80);
          setPosX(70);
        }}
        title="TEST"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  draggable: {
    backgroundColor: 'green',
    position: 'absolute',
    // elevation: 99,
    // zIndex: 99,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    backgroundColor: 'red',
    fontSize: 25,
    textAlign: 'center',
  },
});
