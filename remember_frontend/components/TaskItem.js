import React from "react";
import { Button, Image, View, StyleSheet, TextInput, Text } from "react-native"
import Checkbox from "expo-checkbox";


const TaskItem = ({ task, onToggle }) => {
  const importanceStyle =
    task.priority === true ? styles.priority : styles.paragraph;
  console.log(importanceStyle)
  return (
    <View style={importanceStyle}>
      <Text style={importanceStyle}>{task.name}</Text>
      <Checkbox style={styles.checkbox} value={task.completed} onValueChange={onToggle} color={task.completed ? '#00FF00' : undefined}/>
    </View>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 32,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priority: {
    fontSize: 15,
    fontWeight: "bold", 
    color: "red" 
  },
  checkbox: {
    margin: 8,
  },
  paragraph: {
    fontSize: 15,
  },
});