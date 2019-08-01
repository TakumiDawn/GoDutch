import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, AsyncStorage } from 'react-native';
import axios from 'axios';
import { ListItem, Header, Button, Overlay } from 'react-native-elements';
import { ProductScreen } from '../Components/Product.js';
import loginScreen from '../Components/login.js';
import CreateNewPurchaseScreen from '../Components/CreateNewPurchase.js';
import {createAppContainer, createStackNavigator} from "react-navigation";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/Feather';
import ActionButton from 'react-native-action-button';

export class PurchaseScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: "",
      isVisible: false,
      overlayIndex: "",
      currentUser: undefined,
    }

    this.showPurchaseList = this.showPurchaseList.bind(this);
    this.goToProductPage = this.goToProductPage.bind(this);
    this.deletePurchase = this.deletePurchase.bind(this);
    this.getPurchases = this.getPurchases.bind(this);
    this.showOverlay = this.showOverlay.bind(this);
    this.checkLogInStatus = this.checkLogInStatus.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  updateData = data => {
    console.log(data);
    alert("come back status: " + data);
    // some other stuff
  };

  componentDidMount() {
    AsyncStorage.getItem('loggedIn')
      .then(response => {
        if (response === 'True') {
          console.log('hello')
          AsyncStorage.getItem('userName')
            .then(response => {
              console.log(response)
              this.setState({
                currentUser: response
              })
              return response
            })
            .then(response => {
              this.getPurchases(response);
            })
        } else {
          this.setState({
            currentUser: undefined
          })
        }
      })
  }

  checkLogInStatus() {
    console.log(AsyncStorage.getItem('loggedIn'))
  }

  showOverlay(i) {
    this.setState({
      isVisible: true,
      overlayIndex: i,
    })
  }

  getPurchases(name) {
    axios.get("https://5c810f67.ngrok.io/godutch/api/v1.0/purchases/" + name)
      .then(response => {
        this.setState({
          data: response.data
        });
      })
      .catch(error => {
        console.log(error);
      })
  }

  goToProductPage = (id) => {
    console.log(id)
    this.props.navigation.navigate('Product', {
            purchaseId: id
        })
  }

  deletePurchase = (id) => {
    console.log(id);
    axios.delete("https://5c810f67.ngrok.io/godutch/api/v1.0/purchases/" + String(id))
      .then(response => {
        this.setState({
          isVisible: false
        });
      })
      .catch(error => {
        this.setState({
          isVisible: false
        });
      })
  }

  showPurchaseList() {
    var table = [];
    for(let i = 0; i < Object.keys(this.state.data).length; i++) {
      table.push(
        <ListItem key={i}
                  bottomDivider
                  title={String(this.state.data[i].purchaseId)}
                  subtitle={"Date: " + this.state.data[i].date}
                  rightSubtitle={"Address: " + this.state.data[i].storeAddress}
                  rightElement={<Icon name="delete" size={25} color={'black'} onPress={() => this.showOverlay(this.state.data[i].purchaseId)}/>}
                  onPress={() => this.goToProductPage(this.state.data[i].purchaseId)}/>
      );
    }
    return table;
  }

  render() {
    if(this.state.currentUser === undefined || this.state.currentUser === null) {
      return(
        <View style={{ backgroundColor: '#e9e9ef', minHeight: Dimensions.get('window').height }}>
          <Header
            backgroundColor={'#456990'}
            leftComponent={<Icon1 name="user" size={25} color={'white'} onPress={() => this.props.navigation.navigate('Login')} />}
            centerComponent={{ text: 'Purchases', style: { color: '#fff', fontSize: 21 } }}
            rightComponent={<Icon name="refresh" size={25} color={'white'} onPress={() => this.componentDidMount()} />}
          />
        </View>
      )
    }

    return (
      <View style={{ backgroundColor: '#e9e9ef', minHeight: Dimensions.get('window').height }}>
        {console.log(this.state.currentUser)}
        <Overlay isVisible={this.state.isVisible}
                       onBackdropPress={() => this.setState({ isVisible: false })}
                       borderRadius={5}
                       width={ Dimensions.get('window').width - 40 }
                       height={ 180 }
                       overlayStyle={{ alignItems: 'center'}}>
          <View style={styles.overlayContainer}>
            <View style={styles.unfollowTextContainer}>
              <Text>Delete Purchase </Text>
              <Text style={{fontWeight: "bold"}}>{String(this.state.overlayIndex)}</Text>
              <Text>?</Text>
            </View>
            <View style={{ width: '100%', flex: 3.5, flexDirection: 'row' }}>
              <Button type={'clear'}
                      titleStyle={{ fontSize: 15, color: 'black' }}
                      containerStyle={styles.cancelButtonContainer}
                      buttonStyle={styles.cancelButton}
                      title={'Cancel'}
                      onPress={() => this.setState({ isVisible: false })}>
              </Button>
              <Button
                      type={'clear'}
                      titleStyle={{ fontSize: 15, color: 'black' }}
                      containerStyle={{ flex: 1, height: '100%' }}
                      buttonStyle={styles.cancelButton}
                      title={'delete'}
                      onPress={() => this.deletePurchase(this.state.overlayIndex)}></Button>
            </View>
          </View>
        </Overlay>
        <Header
          backgroundColor={'#456990'}
          leftComponent={<Icon1 name="user" size={25} color={'white'} onPress={() => this.props.navigation.navigate('Login', {
            name: "from parent",
            updateData: this.updateData
          })} />}
          centerComponent={{ text: 'Purchases', style: { color: '#fff', fontSize: 21 } }}
          rightComponent={<Icon name="refresh" size={25} color={'white'} onPress={() => this.componentDidMount()} />}
        />
        <ScrollView>
          {this.showPurchaseList()}
          <View style={{ height: 200 }} />
        </ScrollView>
        <ActionButton buttonColor="rgba(231,76,60,1)" style={{ height: Dimensions.get('window').height }}
                      onPress={() => this.props.navigation.navigate('CreateNewPurchase')}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    overlayContainer: {
        position: 'absolute',
        flex: 1,
        borderRadius: 5,
        right: 0,
        top: 0,
        bottom: 0,
        width: Dimensions.get('window').width - 40,
        flexDirection: 'column',
        alignItems: 'center',
      },
      unfollowTextContainer: {
        width: '100%',
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 0.3,
        borderBottomColor: '#d6d7da',
        flexDirection: 'row',
      },
      cancelButtonContainer: {
        flex: 1,
        height: '100%',
        borderRightWidth: 0.3,
        borderRightColor: '#d6d7da',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
      cancelButton: {
        height: '100%',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
});

const MainNavigator = createStackNavigator({
        Purchases: { screen: PurchaseScreen, navigationOptions: {
          header: null,
        } },

        Product: { screen: ProductScreen},
        CreateNewPurchase: { screen: CreateNewPurchaseScreen},
        Login: { screen: loginScreen }
    }
);

const App = createAppContainer(MainNavigator);

export default App;
