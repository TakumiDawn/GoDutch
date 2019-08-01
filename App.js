import React from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import PurchaseScreen from './Components/Purchase.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class App extends React.Component {
  render() {
    return(
      <PurchaseScreen />
    )
  }
}

// This function is responsible for assigning icons to the
// Tar bar based on the page it represents
// const getTabBarIcon = (navigation, focused, tintColor) => {
//   const { routeName } = navigation.state;
//   if (routeName === 'Purchase') {
//       console.log(focused)
//       if(focused === true) {
//           return <Icon name="home" size={24} color={'black'}/>;
//       }else {
//           return <Icon name="home-outline" size={24} color={'black'}/>;
//       }
//   } else if(routeName === 'Stupid') {
//       if(focused === true) {
//           return <Icon name="folder" size={24} color={'black'}/>;
//       } else {
//           return <Icon name="folder-outline" size={24} color={'black'}/>;
//       }
//   } else if(routeName === 'Following') {
//       if(focused === true) {
//           return <Icon name="heart" size={24} color={'black'}/>;
//       } else {
//           return <Icon name="heart-outline" size={24} color={'black'}/>;
//       }
//   } else if(routeName === 'Followers'){
//       if(focused === true) {
//           return <Icon name="account" size={24} color={'black'}/>;
//       } else {
//           return <Icon name="account-outline" size={24} color={'black'}/>;
//       }
//   }
// }
//
// // This is used to navigate between the different pages
// // This function is written with the help of the official
// // documents of the react-navigation package
// export default createAppContainer(
//   createBottomTabNavigator(
//     {
//         Purchase: { screen: PurchaseScreen},
//         Stupid: { screen: PurchaseScreen},
//         Following: { screen: PurchaseScreen},
//         Followers: { screen: PurchaseScreen},
//     },
//     {
//       defaultNavigationOptions: ({ navigation }) => ({
//         tabBarIcon: ({ focused, tintColor }) =>
//           getTabBarIcon(navigation, focused, tintColor),
//       }),
//       tabBarOptions: {
//         activeTintColor: 'black',
//           activeBackgroundColor: 'rgb(255, 255, 255)',
//           inactiveBackgroundColor: 'rgb(255, 255, 255)',
//         inactiveTintColor: 'black',
//           style: {
//             height: 55,
//             borderBottomWidth: 1,
//             borderTopWidth: 1,
//             borderTopColor: 'rgb(229, 229, 229)',
//             borderBottomColor: 'rgb(229, 229, 229)'
//           }
//       },
//     }
//   )
// );
