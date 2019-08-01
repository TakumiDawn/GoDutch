import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, AsyncStorage } from 'react-native';
import axios from 'axios';

export default class ShareScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      participants: [],
      price: [],
    }

    this.showShareList = this.showShareList.bind(this);
  }

  componentDidMount() {
    axios.get("https://5c810f67.ngrok.io/godutch/api/v1.0/share/" + this.props.id)
      .then(response => {
        console.log(response.data);
        var data = response.data;
        var temp_participants = []
        var temp_price = []
        for(let i = 0; i < Object.keys(data).length; i++) {
          temp_participants.push(data[i].name)
          temp_price.push(data[i].amount)
        }
        this.setState({
          participants: temp_participants,
          price: temp_price,
        })
      })
  }

  showShareList() {
    var table = [];
    for(let i = 0; i < Object.keys(this.state.participants).length; i++) {
      var temp_string = this.state.participants[i] + " " + this.state.price[i];
      table.push(
        <View key={i}>
          <Text>{temp_string}</Text>
        </View>
      )
    }
    return table;
  }

  render() {
    return(
      <View>
        {this.showShareList()}
      </View>
    )
  }
}
