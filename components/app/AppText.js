import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// The component used across the project for regular paragraph Text.
class AppText extends Component {
  render() {
    return (
        <Text style={
            [{
                fontSize: 17.5,
            }, this.props.style]}>
            
            {this.props.children}
        </Text>
    );
  }
}

export default AppText;