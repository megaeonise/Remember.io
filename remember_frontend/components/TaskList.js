import React, { useState, useContext } from "react";
import TaskItem from "./TaskItem";
import Checklist from "./Checklist";
import { Button, Image, View, StyleSheet, TextInput, ScrollView, Text, TouchableOpacity } from "react-native"
import Checkbox from "expo-checkbox";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from 'expo-status-bar'
import { PreferencesContext } from '../context/preferencesContext';

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")
  const [importance, setImportance] = useState(false)
  const { preferences } = useContext(PreferencesContext);

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
    setImportance(!importance);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: preferences.backgroundColor }]} edges={['top']}>
        <ScrollView style={[styles.scrollView, { backgroundColor: preferences.backgroundColor }]}>
          <TextInput
            style={[
              styles.input,
              { 
                fontSize: preferences.fontSize,
                fontFamily: preferences.fontFamily,
                backgroundColor: '#fff'
              }
            ]}
            value={newTask}
            onChangeText={setNewTask}
            placeholder="Add a new task"
            placeholderTextColor="#666"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: preferences.windowColor || '#1BBAC8' }]}
              onPress={addTask}
            >
              <Text style={[
                styles.buttonText,
                { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }
              ]}>
                Add Task
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[
            styles.importanceText,
            { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }
          ]}>
            Check box to toggle task importance
          </Text>
          
          <Checkbox
            style={styles.checkbox}
            value={importance}
            onValueChange={toggleImportance}
            color={importance ? (preferences.windowColor || '#1BBAC8') : undefined}
          />

          <View style={styles.taskList}>
            {tasks.map((task, index) => (
              <View key={index} style={[styles.taskItem, { backgroundColor: preferences.windowColor || 'white' }]}>
                <Checkbox
                  style={styles.checkbox}
                  value={task.completed}
                  onValueChange={() => toggleTaskCompletion(index)}
                  color={task.completed ? (preferences.windowColor || '#1BBAC8') : undefined}
                />
                <Text style={[
                  styles.taskText,
                  { 
                    fontSize: preferences.fontSize,
                    fontFamily: preferences.fontFamily,
                    textDecorationLine: task.completed ? 'line-through' : 'none',
                    color: task.priority ? '#ff4444' : '#000'
                  }
                ]}>
                  {task.name}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  addButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  importanceText: {
    marginBottom: 10,
  },
  checkbox: {
    marginBottom: 20,
  },
  taskList: {
    marginTop: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  taskText: {
    marginLeft: 10,
    flex: 1,
  },
});