import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { cond, or, eq, add, call, set, sub, Value, event } = Animated;

export default function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  const absoluteX = useRef(new Value(100));
  const absoluteY = useRef(new Value(100));
  const gestureState = useRef(new Value(-1));
  const addX = sub(absoluteX.current);
  const addY = sub(absoluteY.current);
  const myX = cond(
    eq(gestureState.current, State.ACTIVE),
    addX,
    set(absoluteX.current, addX)
  );
  const myY = cond(
    eq(gestureState.current, State.ACTIVE),
    addY,
    set(absoluteY.current, addY)
  );

  const squareX = add(absoluteX.current, 100);
  const squareY = add(absoluteY.current, 100);

  function handleDragActive([x, y]) {
    setPosX(x);
    setPosY(y);
  }

  function handleDragBegin() {
    setIsDragging(true);
  }

  function handleDragEnd() {
    setIsDragging(false);
  }

  const handleGestureEvents = event([
    {
      nativeEvent: {
        absoluteX: absoluteX.current,
        absoluteY: absoluteY.current,
        state: gestureState.current,
      },
    },
  ]);

  return (
    <View style={styles.container}>
      <Animated.Code>
        {() =>
          cond(eq(gestureState.current, State.BEGAN), call([addX, addY], handleDragBegin))
        }
      </Animated.Code>
      <Animated.Code>
        {() =>
          cond(
            eq(gestureState.current, State.ACTIVE),
            call([addX, addY], handleDragActive)
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

      {isDragging && (
        <Animated.View
          style={{
            position: 'absolute',
            left: squareX,
            top: squareY,
            width: 50,
            height: 30,
            backgroundColor: 'peachpuff',
            justifyContent: 'center',
          }}
        />
      )}

      <PanGestureHandler
        maxPointers={1}
        minDist={5}
        onGestureEvent={handleGestureEvents}
        onHandlerStateChange={handleGestureEvents}
      >
        <Animated.View
          style={{
            left: myX,
            top: myY,
            backgroundColor: 'green',
          }}
        >
          <Text style={{ textAlign: 'center' }}>Hello</Text>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
