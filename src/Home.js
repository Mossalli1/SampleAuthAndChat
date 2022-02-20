import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {StyleSheet, Text, View, Dimensions, Alert} from 'react-native';
// import messaging from '@react-native-firebase/messaging';
import {GiftedChat} from 'react-native-gifted-chat';
// import {addDoc, collection} from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
const {height, width} = Dimensions.get('window');

const Home = props => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [messages, setMessages] = useState([]);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    // requestUserPermission();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useLayoutEffect(() => {
    const subscriber = firestore()
      .collection('chats')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot =>
        setMessages(
          snapshot !== null
            ? snapshot.docs.map(doc => ({
                _id: doc.data()._id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user,
              }))
            : '',
        ),
      );
    // Stop listening for updates when no longer required
    return () => subscriber();
  });

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    const {_id, createdAt, text, user} = messages[0];
    firestore().collection('chats').add({
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  // console.log('User  :   ', user);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <Text>Login</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        onSend={messages => onSend(messages)}
        user={{
          _id: user.email !== '' ? user.email : user.uid,
          name: user.displayName,
          avatar: user.photoURL,
        }}
      />
    </KeyboardAvoidingView>
  );
};

export default Home;
const styles = StyleSheet.create({});
