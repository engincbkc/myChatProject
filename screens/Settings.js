import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Avatar, Title, Subheading, Button, Divider } from "react-native-paper";
import firebase from "firebase/app";
import { Surface } from 'react-native-paper';

const Settings = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setName(user?.displayName ?? "");
      setEmail(user?.email ?? "");
    });
  }, []);

  return (
    <View style={{ alignItems: "left", marginTop: 16 }}>
      <Surface style={{flexDirection:"row",paddingHorizontal:32, justifyContent:"flex-start"}}>
       
        <Avatar.Text
          label={name.split(" ").reduce((prev, current) => prev + current[0], "")}
        />
         
         <View style = {{flexDirection:"column",paddingHorizontal:16}}>
            <Title style = {{alignItems:"bottom"}}>{name}</Title>
            <Subheading>{email}</Subheading>
        </View>
      </Surface>

      <Divider/>

     <Surface style={{backgroundColor:"white",alignItems:"left", marginTop:1,alignItems:"left"}}>
      <Button compact  style={{alignItems:"left"}} mode="contained" alignItems="left" color ="#e74c3c" icon="logout" onPress={() => firebase.auth().signOut()}><Text style={{fontSize:16, fontWeight:700, alignItems:"left"}}>Sign Out</Text></Button>
      </Surface>
      <Divider/>

    </View>
  );
};

export default Settings;
