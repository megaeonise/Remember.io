import React, { useState } from "react";
import TaskItem from "./TaskItem";
import Checklist from "./Checklist";
import { Button, Image, View, StyleSheet, TextInput, ScrollView, Text } from "react-native"
import Checkbox from "expo-checkbox";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from 'expo-status-bar'



const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [importance, setImportance] = useState(false)

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        name: newTask,
        completed: false,
        priority: importance,
        startTime: null,
        deadline: null,
      },
    ]);
    setNewTask("");
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };
  const toggleImportance = () => {
    setImportance(importance ? false : true)
  }
  console.log(tasks)

  return (
  <SafeAreaProvider>
  <SafeAreaView style={styles.container} edges={['top']}>
  <ScrollView style={styles.scrollView}>
      <TextInput
        type="text"
        value={newTask}
        onChangeText={setNewTask}
        placeholder="Add a new task"
      />
      <Button onPress={addTask} title="Add Task" />
      <Text>Check box to toggle task importance</Text>
      <Checkbox style={styles.checkbox} value={importance} onValueChange={toggleImportance} color={importance ? '#FF0000' : undefined}/>

      {tasks.map((task, index) => (
        <TaskItem
          key={index}
          task={task}
          onToggle={() => toggleTaskCompletion(index)}
        />
      ))}

      <Checklist tasks={tasks} />
  </ScrollView>
  </SafeAreaView>
  </SafeAreaProvider>
  );
};

export default TaskList;

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
  paragraph: {
    fontSize: 15,
    alignItems: 'center',
  },
  checkbox: {
    margin: 8,
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'cyan',
  },
  text: {
    fontSize: 30,
    padding: 12,
    paddingTop: StatusBar.currentHeight,
    paddingLeft: 100
  },
});