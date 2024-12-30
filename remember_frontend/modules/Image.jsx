import { Image } from "expo-image"
import { StyleSheet, View, Text } from "react-native"

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["

export default function ImageView() {
    console.log('i am being run')
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source="https://fastly.picsum.photos/id/931/3000/2000.jpg"
        contentFit="cover"
        alt="test"
        transition={1000}
      />
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
  }
})
