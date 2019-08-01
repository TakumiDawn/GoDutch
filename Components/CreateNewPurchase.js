import React from 'react';
import { Alert, Keyboard, Image, View, StyleSheet, Text, ScrollView, AsyncStorage } from 'react-native';
import { Input, Button } from 'react-native-elements';
import axios from 'axios';
import PurchaseSubmit from '../Components/PurchaseSubmit.js';

export default class CreateNewPurchase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image_url: "",
      data_to_parse: [],
      submitted: false,
      currentUser: "",
    };

    this.handleImage = this.handleImage.bind(this);
  }

  componentDidMount() {
    AsyncStorage.getItem('userName')
      .then(response => {
        this.setState({
          currentUser: response
        })
      })
  }

  handleImage() {
    console.log("handle image")
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": "e23898c9c61648cfbb30ec7091e335f6",
      },
    };
    var postData = {
      "url": this.state.image_url
    };
    axios.post("https://westus.api.cognitive.microsoft.com/vision/v2.0/ocr?language=unk&detectOrientation=true&isTable=true&scale=true", postData, axiosConfig)
    .then(response => {
      return response.data;
    })
    .then(response => {
      var postData = response;
      axios.post("https://5c810f67.ngrok.io/godutch/api/v1.0/results", postData)
        .then(response => {
          // console.log(response.data);
          this.setState({
            data_to_parse: response.data["products"],
            submitted: true,
          })
        })
    })
  }

  render() {
    if(this.state.submitted === true) {
      return(
        <PurchaseSubmit products={this.state.data_to_parse} user={this.state.currentUser}/>
      )
    }

    return(
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Input
          onChangeText={(text) => {this.setState({ image_url: text })}}
          value={this.state.image_url}
          containerStyle={{ width: '80%' }}
          inputContainerStyle={{ borderBottomColor: 'white' }}
          placeholder='Image url'
          />
          <View style={{ height: 30 }} />
          <Button
            title="SUBMIT"
            containerStyle={{ width: '75%' }}
            buttonStyle={{ backgroundColor: '#456990' }}
            onPress={ () => this.handleImage() }
            />
      </View>
    )
  }
}
