import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// The component used across the project for Text that is used as a header.
class AppHeaderText extends Component {
  render() {
    return (
        <Text style={
            [{
                fontSize: 24.5,
            }, this.props.style]}>
            {this.props.children}
        </Text>
    );
  }
}

export default AppHeaderText;