import React from 'react';
import { StyleSheet, Text, View, ScrollView, AsyncStorage } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';

export default class loginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      loggedIn: false,
    }

    this.attemptLogin = this.attemptLogin.bind(this);
    this.attemptLogout = this.attemptLogout.bind(this);
  }

  componentDidMount() {
    AsyncStorage.getItem('loggedIn')
      .then(response => {
        if(response === "True") {
          this.setState({
            loggedIn: true,
          })
        } else {
          this.setState({
            loggedIn: false,
          })
        }
      })
  }

  attemptLogout() {
    const {goBack} = this.props.navigation;

    AsyncStorage.setItem("loggedIn", "False")
      .then(response => {
        goBack();
      })
      .catch(error => {
        console.log(error);
      })
  }

  attemptLogin() {
    const {goBack} = this.props.navigation;

    axios.get("https://5c810f67.ngrok.io/godutch/api/v1.0/login?username=" + this.state.username + "&password=" + this.state.password)
      .then(response => {
        AsyncStorage.setItem("loggedIn", "True")
          .catch(error => { console.log(error) })
        AsyncStorage.setItem("userName", this.state.username)
          .catch(error => { console.log(error) })
        goBack();
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    if(this.state.loggedIn === true) {
      return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#9aaec3' }}>
          <Text style={{ color: 'white' }}>You are already logged in</Text>
          <View style={{ height: 30 }}></View>
          <Button
            title="LOG OUT"
            containerStyle={{ width: '40%' }}
            buttonStyle={{ backgroundColor: '#456990' }}
            onPress={() => this.attemptLogout()}
          />
        </View>
      )
    }

    return(
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#9aaec3' }}>
        <View style={{ height: 100 }}/>
        <Text style={{ fontSize: 35, color: 'white', fontWeight: 'bold' }}>GoDutch</Text>
        <View style={{ height: 30 }}/>
        <Input
          onChangeText={(text) => {this.setState({ username: text })}}
          value={this.state.username}
          containerStyle={{ width: '80%' }}
          inputStyle={{ color: 'white' }}
          inputContainerStyle={{ borderBottomColor: 'white' }}
          placeholder='Username'
          leftIcon={<Icon name="user" size={25} color={'white'} />}
          leftIconContainerStyle={{ paddingRight: 5 }}
        />
        <View style={{ height: 20 }}/>
        <Input
          onChangeText={(text) => {this.setState({ password: text })}}
          value={this.state.password}
          inputContainerStyle={{ borderBottomColor: 'white' }}
          inputStyle={{ color: 'white' }}
          containerStyle={{ width: '80%' }}
          secureTextEntry={true}
          placeholder='Password'
          leftIcon={<Icon name="lock" size={25} color={'white'} />}
          leftIconContainerStyle={{ paddingRight: 5 }}
        />
        <View style={{ height: 40 }}/>
        <Button
          title="LOGIN"
          containerStyle={{ width: '75%' }}
          buttonStyle={{ backgroundColor: '#456990' }}
          onPress={() => this.attemptLogin()}
        />
      </View>
    )
  }
}
