import React from "react";
import { Button, Image, View, StyleSheet, TextInput, Text } from "react-native"
import { ProgressBar } from "@react-native-community/progress-bar-android";

const Checklist = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completionPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <View>
      <Text style={styles.heading}>Checklist Completion</Text>
      {/* <ProgressBar value={completedTasks} max={totalTasks} /> */}
      <Text style={styles.heading}>{completionPercentage}%</Text>
    </View>
  );
};

export default Checklist;

const styles = StyleSheet.create({
  heading: {
    fontSize: 42,
    padding: 12,
    boldWeight: 'bold',
  },
})
