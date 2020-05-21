import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';

import auth from '@react-native-firebase/auth';

const AppStack = createStackNavigator({
  Home: HomeScreen
});

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "Loading"
    }
  )
);
// import React, {useState} from 'react';
// import {View, StyleSheet, FlatList, Alert} from 'react-native';
// import {v4 as uuidv4} from 'uuid';

// import Header from './components/Header';
// import ListItem from './components/ListItem';
// import AddItem from './components/AddItem';

// const App = () => {
//   const [items, setItems] = useState([
//     {
//       id: uuidv4(),
//       text: 'Milk',
//     },
//     {
//       id: uuidv4(),
//       text: 'Eggs',
//     },
//     {
//       id: uuidv4(),
//       text: 'Bread',
//     },
//     {
//       id: uuidv4(),
//       text: 'Juice',
//     },
//   ]);

//   // Flag true if user is currently editing an item
//   const [editStatus, editStatusChange] = useState(false);

//   // State to capture information about the item being edited
//   const [editItemDetail, editItemDetailChange] = useState({
//     id: null,
//     text: null,
//   });

//   const [checkedItems, checkedItemChange] = useState([]);

//   const deleteItem = id => {
//     setItems(prevItems => {
//       return prevItems.filter(item => item.id !== id);
//     });
//   };

//   // Submit the users edits to the overall items state
//   const saveEditItem = (id, text) => {
//     setItems(prevItems => {
//       return prevItems.map(item =>
//         item.id === editItemDetail.id ? {id, text: editItemDetail.text} : item,
//       );
//     });
//     // Flip edit status back to false
//     editStatusChange(!editStatus);
//   };

//   // Event handler to capture users text input as they edit an item
//   const handleEditChange = text => {
//     editItemDetailChange({id: editItemDetail.id, text});
//   };

//   const addItem = text => {
//     if (!text) {
//       Alert.alert(
//         'No item entered',
//         'Please enter an item when adding to your shopping list',
//         [
//           {
//             text: 'Understood',
//             style: 'cancel',
//           },
//         ],
//         {cancelable: true},
//       );
//     } else {
//       setItems(prevItems => {
//         return [{id: uuidv4(), text}, ...prevItems];
//       });
//     }
//   };

//   // capture old items ID and text when user clicks edit
//   const editItem = (id, text) => {
//     editItemDetailChange({
//       id,
//       text,
//     });
//     return editStatusChange(!editStatus);
//   };

//   const itemChecked = (id, text) => {
//     const isChecked = checkedItems.filter(checkedItem => checkedItem.id === id);
//     isChecked.length
//       ? // remove item from checked items state (uncheck)
//         checkedItemChange(prevItems => {
//           return [...prevItems.filter(item => item.id !== id)];
//         })
//       : // Add item to checked items state
//         checkedItemChange(prevItems => {
//           return [...prevItems.filter(item => item.id !== id), {id, text}];
//         });
//   };

//   return (
//     <View style={styles.container}>
//       <Header title="Shopping List" />
//       <AddItem addItem={addItem} />
//       <FlatList
//         data={items}
//         renderItem={({item}) => (
//           <ListItem
//             item={item}
//             deleteItem={deleteItem}
//             editItem={editItem}
//             isEditing={editStatus}
//             editItemDetail={editItemDetail}
//             saveEditItem={saveEditItem}
//             handleEditChange={handleEditChange}
//             itemChecked={itemChecked}
//             checkedItems={checkedItems}
//           />
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default App;