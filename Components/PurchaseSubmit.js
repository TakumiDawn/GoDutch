import React, { useState } from 'react'
import axios from 'axios'
import { StyleSheet, Text, View, ScrollView, AsyncStorage } from 'react-native'
import { ListItem, Button, Icon, Input, Card, CheckBox, Divider } from 'react-native-elements'

export default class PurchaseSubmit extends React.Component {
  constructor(props) {
    super(props)
    this.taxes = [0.45]
    this.state = {
      loading: true,
      choosingParticipants: true,
      participants: [],

      purchaseId: 0,
      productId: '',

      address: '2610 N PROSPECT AVE CHAMPAIGN IL 61822', //parsedData.address,
      products: props.products,
      tax: 0,
      total: 0,

      currentPartIdx: 0,
    }
  }

  componentDidMount() {
    console.log(this.props.user)
    var { address, tax, total, products } = this.state
    this.taxes.forEach( tax2 => tax += tax2 )
    products.forEach( (product, index) => {
      total += parseFloat(product.price)
      product.index = index
    })
    this.setState({ tax, total })
    const newPurchase = {
      storeAddress: address,
      date: String(new Date()),
      userName: this.props.user,
      tax: tax
    }

    // axios.post("https://de52896e.ngrok.io/godutch/api/v1.0/stores", {name: "Walmart", address: address})
    //   .then( ({data}) => {
        // console.log('store', data)
        axios.post("https://82432630.ngrok.io/godutch/api/v1.0/purchases", newPurchase)
        .then( ({data}) => {
          console.log('purchase', data)
          this.setState({ purchaseId: data.purchase.id })
        })
      // })
  }

  componentDidUpdate(prevProps) {
    if(prevProps.products !== this.props.products) {
      console.log(this.props.products);
    }
  }

  addParticipant = name => {
    var { participants, purchaseId } = this.state
    console.log(this.state.purchaseId);
    participants.push({ name: name, selectedProducts: [], index: participants.length })
    var data_var = {
      "name": name,
      "amount": 0,
      "purchaseId": purchaseId,
    };
    axios.post("https://82432630.ngrok.io/godutch/api/v1.0/participants", data_var)
    .then (({data: {participant}}) => {
      const part = participants.filter( part => part.name === participant.name )[0]
      participants[part.index].participantId = participant.participantId
      this.setState({ participants })
    })
    this.setState({ participants })
  }

  addProductToParticipant = (productIndex) => {
    const { participants, currentPartIdx } = this.state
    participants[currentPartIdx].selectedProducts.push(productIndex)
    this.setState({ participants })
  }

  editPartName = (index, name) => {
    var { participants } = this.state
    participants[index].name = name
    this.setState({ participants })
  }

  removeProductFromParticipant = (productIndex) => {
    const { participants, currentPartIdx } = this.state
    participants[currentPartIdx].selectedProducts = participants[currentPartIdx].selectedProducts.filter( pidx => pidx !== productIndex)
    this.setState({ participants })
  }

  setCurrPartIdx = currentPartIdx => this.setState({ currentPartIdx })

  finishParticipant = () => this.setState({ choosingParticipants: false })

  setProducts = (index, name, price) => {
    var { products, total } = this.state
    products[index].name = name
    total += parseFloat(price) - parseFloat(products[index].price)
    products[index].price = price
    this.setState({ products, total })
  }

  deleteProducts = index => {
    var { products } = this.state
    products = products.filter( product => product.index !== index )
    this.setState({ products })
  }


  onPurchaseSubmit = () => {
    const { products, participants } = this.state
    products.forEach( product => {
        axios.post("https://5c810f67.ngrok.io/godutch/api/v1.0/products", {
        purchaseId: this.state.purchaseId,
        name: product.name,
        pricePerUnit: parseFloat(product.price),
        image: '',
        quantity: 1,
      })
      .then( ({data}) => {
        var parts = participants.filter(part => part.selectedProducts.includes(product.index))
        var amount = parseFloat(product.price) / parts.length
        parts.forEach( part => {
          axios.post("https://5c810f67.ngrok.io/godutch/api/v1.0/share", {
            productId: data.product.productId,
            participantId: part.participantId,
            amount: amount
          })
          .then( ({data}) => console.log(data) )
        })
      })
    })
  }

  render() {
    var { products, total, tax, choosingParticipants, participants, currentPartIdx } = this.state
    total = total.toPrecision(4)
    tax =  tax.toPrecision(4)
    return choosingParticipants ? (
      <PickParticipants participants={participants} addParticipant={this.addParticipant} finish={this.finishParticipant} editPartName={this.editPartName} />
    ) : (
      <ScrollView style={styles.container}>
        <Button title="Edit Participants" onPress={() => this.setState({choosingParticipants: true})} />
        <Divider style={{ backgroundColor: 'blue' }} />
        <Card title="Choose a friend here">
          <View>
            {participants.map( (part, index) => (
              <Button key={part.name} title={part.name} style={{marginBottom: 5}} onPress={() => this.setCurrPartIdx(index)}/>
            ))}
          </View>
          <Text style={{textAlign: "center"}}>Current Person to Share: {participants[currentPartIdx].name}</Text>
        </Card>
        {products.map( (product, index) =>
          <Product
            key={product.name + index}
            product={product}
            {...this}
          />
        )}

        <Card title={`TOTAL  $ ${total}`}>
          <Text style={{marginBottom: 30, textAlign: "center", color: "grey"}}>
            Tax &ensp;$ {tax}
          </Text>
          <Button title="Submit" onPress={this.onPurchaseSubmit} />
        </Card>
        <View style={{height: 120}} />
      </ScrollView>
    )
  }
}

function PickParticipants({ participants, addParticipant, finish, editPartName }) {
  const [inputName, setInputName] = useState('')
  const onNameChange = value => setInputName(() => value)
  const onPick = () => {
    addParticipant(inputName)
    setInputName('')
  }
  return (
    <View style={{marginTop: 100}}>
      <Card title="Choose your friends to share">
        <Input
          placeholder="Enter a participant's name"
          value={inputName}
          onChangeText={onNameChange}
          inputStyle={{fontSize: 14, color: "#17cfad"}}
          //containerStyle={{width: 150}}
        />
        <Button containerStyle={{marginTop: 20}} title="Pick" onPress={onPick} disabled={!inputName} />
        <Button style={{marginTop: 20}} title="Done" onPress={finish} disabled={participants.length === 0} />
      </Card>
      <ScrollView>
        {participants.map( participant =>
          <Participant key={participant.name} participant={participant} editPartName={editPartName} />
        )}
      </ScrollView>
    </View>
  )
}

function Participant({ participant, editPartName }) {
  const [editing, setEditing] = useState(false)
  const [inputName, setInputName] = useState(participant.name)
  const onNameChange = value => setInputName(() => value)
  const onSave = () => {
    axios.put(`https://82432630.ngrok.io/godutch/api/v1.0/participants/${participant.participantId}`, {
      name: inputName
    })
    .then (() => {
      setEditing(false)
      editPartName(participant.index, inputName)
    })
  }
  return editing ? (
    <ListItem
      bottomDivider
      leftElement={
        <Input
          placeholder='Participant Name'
          value={inputName}
          onChangeText={onNameChange}
          inputStyle={{fontSize: 16, color: "#1a565c"}}
          containerStyle={{width: 260}}
          errorMessage={inputName ? "" : "Product name is required"}
        />
      }
      rightElement={<Button title="Save" onPress={onSave}/>}
    />
  ) : (
    <ListItem
      containerStyle={{paddingLeft: 30}}
      key={participant.name}
      title={participant.name}
      bottomDivider
      rightElement={
        <Button
          icon={<Icon name="edit" size={25} color="grey" />}
          type="clear"
          onPress={() => setEditing(true)}
        />
      }
    />
  )
}

function Product({ product, setProducts, deleteProducts, addProductToParticipant, removeProductFromParticipant, state }) {
  const { name, price, index } = product
  const { participants, currentPartIdx } = state
  const [editing, setEditing] = useState(false)
  const [inputName, setInputName] = useState(name)
  const [inputPrice, setInputPrice] = useState(price)

  var isChecked = false
  participants[currentPartIdx].selectedProducts.forEach( productIndex => {
    if (productIndex === index) isChecked = true
  })

  const onNameChange = value => setInputName(() => value)
  const onPriceChange = value => setInputPrice(() => value)
  const onDelete = () => deleteProducts(index)
  const onCheck = () => {
    if (!isChecked) addProductToParticipant(index)
    else removeProductFromParticipant(index)
  }
  const onSave = () => {
    setProducts(index, inputName, inputPrice)
    setEditing(false)
  }


  const EditingItem = () => (
    <View style={styles.inputGroup}>
      <Input
        placeholder='Product Name'
        value={inputName}
        onChangeText={onNameChange}
        inputStyle={{fontSize: 16, color: "#1a565c"}}
        containerStyle={{width: 300}}
        errorMessage={inputName ? "" : "Product name is required"}
      />
      <Input
        placeholder='Price'
        value={inputPrice}
        onChangeText={onPriceChange}
        inputStyle={{fontSize: 14, color: "#17cfad"}}
        containerStyle={{width: 150}}
        errorMessage={inputPrice ? "" : "Price is required"}
      />
      <View style={{flex: 2, flexDirection: "row", marginLeft: 200}}>
        <Button style={{marginRight: 10}} titleStyle={{color: "#446990"}} type="outline" title="Save" onPress={onSave} />
        <Button titleStyle={{color: "#6b7885"}} type="outline" title="Cancel" onPress={() => setEditing(false)} />
      </View>
    </View>
  )


  return editing ?
      <ListItem Component={EditingItem}/>
      :
      <ListItem
        titleStyle={{marginLeft: -15}}
        title={name}
        subtitle={`$ ${price}`} subtitleStyle={{color: "#17cfad", marginLeft: -15}}
        leftElement={
          <CheckBox
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            checked={isChecked}
            onPress={onCheck}
          />
        }
        rightElement={
          <>
            <Button
              icon={<Icon name="edit" size={25} color="grey" />}
              type="clear"
              onPress={() => setEditing(true)}
            />
            <Button
              icon={<Icon name="delete" size={25} color="red" />}
              type="clear"
              onPress={onDelete}
            />
          </>
        }
      />
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 100,
    flex: 2
  },
  product: {
    flex: 2,
    height: 60,
    marginLeft: 20,
    marginRight: 20,
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
  },
  inputGroup: {
    flex: 2,
    flexDirection: "column"
  },
  input: {
    fontSize: 11,
  },
  inputCon: {
    width: 200
  }
})
