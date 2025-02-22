import React, {useState,useEffect} from 'react'
import { useEvent } from "expo"
import { useVideoPlayer, VideoView } from "expo-video"
import { StyleSheet, View, Button, TextInput, Text } from "react-native"

const videoSource =
  ""


const Video = () => {
  const [videoSrc, onChangeVideoSrc] = useState('')

  const player = useVideoPlayer(videoSrc, player => {
    player.loop = true
    player.play()
  })

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing
  })
  console.log(videoSrc)

  return (
    <View style={styles.contentContainer}>
      <Text>Input your video url below</Text>
      <TextInput 
        style={styles.input}
        onChangeText={onChangeVideoSrc}
        value={videoSrc}
      />
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
      <View style={styles.controlsContainer}>
        <Button
          title={isPlaying ? "Pause" : "Play"}
          onPress={() => {
            if (isPlaying) {
              player.pause()
            } else {
              player.play()
            }
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50
  },
  video: {
    width: 350,
    height: 275
  },
  controlsContainer: {
    padding: 10
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
},
})

export default Video