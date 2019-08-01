import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import { ListItem, Header, Overlay, Button, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {createAppContainer, createStackNavigator} from "react-navigation";
import ShareScreen from '../Components/Share.js';

export class ProductScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: "",
      productNames: [],
      productIds: [],
      productImages: [],
      isVisible: false,
      overlayIndex: 0,
      overlayName: "",
      overlayImage: "",
      isShareVisible: false,
      shareOverlayId: 0,
    }

    this.showProductList = this.showProductList.bind(this);
    this.showOverlay = this.showOverlay.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  componentDidMount() {
    axios.get("https://5c810f67.ngrok.io/godutch/api/v1.0/products/" + this.props.navigation.getParam('purchaseId'))
      .then(response => {
        var data = response.data;
        var name_list = [];
        var id_list = [];
        var image_list = [];
        for(let i = 0; i < Object.keys(response.data).length; i++) {
          name_list.push(data[i].name);
          id_list.push(data[i].productId);
          image_list.push(data[i].image);
        }
        this.setState({
          products: data,
          productNames: name_list,
          productIds: id_list,
          productImages: image_list,
        })
      })
      .catch(error => {
        console.log(error);
      })
  }

  showOverlay(i, name, image) {
    console.log(name);
    var temp_name = name;
    var temp_image = image;

    if(name.length >= 20) {
      temp_name = name.substring(0, 20) + "..."
    }

    if(image === "") {
      temp_image = "https://www.novelupdates.com/img/noimagefound.jpg";
    }

    this.setState({
      isVisible: true,
      overlayIndex: i,
      overlayName: temp_name,
      overlayImage: temp_image,
    })
  }

  deleteProduct = (id) => {
    console.log(id);
    axios.delete("https://5c810f67.ngrok.io/godutch/api/v1.0/products/" + String(id))
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

  showProductList() {
    var table = [];
    for(let i = 0; i < Object.keys(this.state.productNames).length; i++) {
      if(this.state.productImages[i] === "") {
        table.push(
          <ListItem key={i}
                    bottomDivider
                    leftAvatar={{
                      source: { uri: "https://www.novelupdates.com/img/noimagefound.jpg" }
                    }}
                    rightSubtitle={"Price: " + String(this.state.products[i].pricePerUnit * this.state.products[i].quantity)}
                    title={String(this.state.productNames[i])}
                    onPress={() => this.setState({ isShareVisible: true, shareOverlayId: this.state.productIds[i] })}
                    rightElement={<Icon name="delete" size={22} color={'black'}
                                        onPress={() => this.showOverlay(this.state.productIds[i], this.state.productNames[i],
                                        this.state.productImages[i])}/>}
                    />
        )
      } else {
        table.push(
          <ListItem key={i}
                    bottomDivider
                    leftAvatar={{
                      source: { uri: this.state.productImages[i] }
                    }}
                    rightSubtitle={"Price: " + String(this.state.products[i].pricePerUnit * this.state.products[i].quantity)}
                    title={String(this.state.productNames[i])}
                    onPress={() => this.setState({ isShareVisible: true, shareOverlayId: this.state.productIds[i] })}
                    rightElement={<Icon name="delete" size={22} color={'black'}
                                        onPress={() => this.showOverlay(this.state.productIds[i], this.state.productNames[i],
                                                        this.state.productImages[i])}/>}
                    />
        )
      }
    }
    return table;
  }

  render() {
    return(
      <View style={{ backgroundColor: '#e9e9ef', minHeight: Dimensions.get('window').height }}>
      {console.log(this.state.shareOverlayId)}
      <Overlay isVisible={this.state.isShareVisible}
                     onBackdropPress={() => this.setState({ isShareVisible: false })}
                     borderRadius={5}
                     width={ Dimensions.get('window').width - 40 }
                     height={ 250 }
                     overlayStyle={{ alignItems: 'center'}}>
              <ShareScreen id={this.state.shareOverlayId}/>
      </Overlay>
      {console.log(this.state.productNames)}
      <Overlay isVisible={this.state.isVisible}
                     onBackdropPress={() => this.setState({ isVisible: false })}
                     borderRadius={5}
                     width={ Dimensions.get('window').width - 40 }
                     height={ 250 }
                     overlayStyle={{ alignItems: 'center'}}>
          <View style={styles.overlayContainer}>
            <View style={styles.avatarContainer}>
              <Avatar size='large' rounded source={{uri: this.state.overlayImage,}}/>
            </View>
            <View style={styles.unfollowTextContainer}>
              <Text>Delete </Text>
              <Text style={{fontWeight: "bold"}}>{String(this.state.overlayName)}</Text>
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
                    onPress={() => this.deleteProduct(this.state.overlayIndex)}></Button>
            </View>
          </View>
        </Overlay>
        <ScrollView>
          {this.showProductList()}
        </ScrollView>
      </View>
    )
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
      avatarContainer: {
        width: '100%',
        flex: 6,
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
});
