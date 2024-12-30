import { StyleSheet, View, Text, Image } from "react-native"

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["

export default function ImageView() {
    console.log('i am being run')
  return (
    <View style={styles.container}>
      <Image 
      style={styles.tinylogo}
      source={{
          uri: 'https://reactnative.dev/img/tiny_logo.png',
        }}
        alt="it doesnt load"/>
      <Text></Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0553"
  },
  tinylogo: {
    width: 50,
    height: 50
  }
})
