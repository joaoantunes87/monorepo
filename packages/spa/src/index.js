import "./index.css";

// import React from "react";
import { AppRegistry /* , StyleSheet, Text, View */ } from "react-native";
// import { BookCard } from "@mr/ui-shared";
import App from "./App";

/*
class App extends React.Component {
  render() {
    return (
      <View style={styles.box}>
        <Text style={styles.text}>Hello, world!</Text>
        <BookCard
          book={{
            id: "1",
            title: "clean code",
            author: "bob",
            tag: "software",
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: { padding: 10 },
  text: { fontWeight: "bold" },
});
*/

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  rootTag: document.getElementById("root"),
});
