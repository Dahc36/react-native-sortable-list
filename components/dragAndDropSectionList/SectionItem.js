import React from 'react';
import { Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

function SectionItem({ children, onPress }) {
  function handlePress() {
    console.log('handlePress');
    onPress();
  }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>{children}</TouchableWithoutFeedback>
  );
}

export default SectionItem;
