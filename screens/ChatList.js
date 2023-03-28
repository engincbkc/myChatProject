import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import {
  List,
  Avatar,
  Divider,
  FAB,
  Portal,
  Dialog,
  Button,
  TextInput,
  Surface,
} from "react-native-paper";
import firebase from "firebase/app";
import { useNavigation } from "@react-navigation/core";
import { ScrollView } from "react-native-web";

const ChatList = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setEmail(user?.email ?? "");
    });
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const createChat = async () => {
    if (!email || !userEmail) return;
    setIsLoading(true);
    const response = await firebase
      .firestore()
      .collection("chats")
      .add({
        users: [email, userEmail],
      });
    setIsLoading(false);
    setIsDialogVisible(false);
    navigation.navigate("Chat", { chatId: response.id });
  };

  const [chats, setChats] = useState([]);
  useEffect(() => {
    return firebase
      .firestore()
      .collection("chats")
      .where("users", "array-contains", email)
      .onSnapshot((querySnapshot) => {
        setChats(querySnapshot.docs);
      });
  }, [email]);

  const deleteChat = () => {
    var user = firebase.firestore().collection("chats").
              where("messages","array-contains",email)
              .onSnapshot((querySnapshot) => {
                setChats()
              })
    
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
      {chats.map((chat) => (
        <React.Fragment>
         
          <Surface style={{borderBottomStartRadius:10, marginBottom:2, marginTop:2}}>
          <List.Item
            title={chat.data().users.find((x) => x !== email)}
            description={(chat.data().messages ?? [])[0]?.text ?? undefined}
            left={() => (
              <Avatar.Text
                label={"UN"
                  }
                size={56}
              />
            )}
            onPress={() => navigation.navigate("Chat", { chatId: chat.id })}
          />
          <Divider/>
          </Surface>
          
        </React.Fragment>
      ))}
      </ScrollView>
      <Portal>
        <Dialog
          visible={isDialogVisible}
          onDismiss={() => setIsDialogVisible(false)}
        >
          <Dialog.Title>New Chat</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Enter user email"
              value={userEmail}
              onChangeText={(text) => setUserEmail(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => createChat()} loading={isLoading}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={{ position: "absolute", bottom: 16, right: 16 }}
        onPress={() => setIsDialogVisible(true)}
      />
    </View>
  );
};

export default ChatList;
