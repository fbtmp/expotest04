import React, { Component } from "react";
import { Text } from "react-native";
import * as Linking from "expo-linking";

class Anchor extends Component<any, any> {
  _handleOnPress = () => {
    Linking.openURL(this.props.href);
    this.props.onPress && this.props.onPress();
  };

  render() {
    return (
      <Text {...this.props} onPress={this._handleOnPress}>
        {this.props.children}
      </Text>
    );
  }
}

export default Anchor;
