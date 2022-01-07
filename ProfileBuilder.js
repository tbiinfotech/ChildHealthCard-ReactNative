import React from 'react'
import { StyleSheet, View, ScrollView, ActivityIndicator, TouchableHighlight, TouchableOpacity, StatusBar, TextInput, Image, Alert, Platform } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Item, Input } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
const em_card_white = require("../../assets/whiteLogo.png");
const back_arrow = require("../../assets/BackIcon.png");
const profile_pic = require("../../assets/ContactIcon.png");
const allergies = require("../../assets/AllergiesIcon.png");
const alertss = require("../../assets/alertIcon.png");
const favourites = require("../../assets/EmCardIcon.png");
const ColorBox = require("../../assets/cardBoxIcon.png");


export default class ProfileBuilder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      email_warning: '',
      password: '',
      password_warning: '',
      secureEntry: true,
      termsConditions: false,
      emailfield: false,
      focusPassword: false,
      focusEmail: false,
      loader: false,
      ageData: false,
      loggedStatus: false,
    };

  }

  async componentDidMount() {
    await AsyncStorage.setItem('card_status', 'create_card');
  }

  render() {
    const { navigation } = this.props;
    return (
      <Container>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
		<Header style={{ backgroundColor: '#E94369', width: '100%'}}>
                <Left style={{flex:1, backgroundColor: 'transparent'}}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Home', {path: 'ProfileBuilder'})} style={{ backgroundColor: 'transparent' ,flex: 0.10, justifyContent: 'center' }}>
                  <View>
                    <Image source={back_arrow} style={{ marginTop: 10, marginLeft: 10, height: 22, width: 28 }}></Image>
                  </View>
                </TouchableOpacity>
                </Left>
                <Body style={{flex:1}}>
                <Image source={em_card_white} style={{marginBottom: 0}}></Image>
                </Body>
                <Right style={{flex:1, backgroundColor: 'transparent'}}>
				<TouchableOpacity onPress={() => this.props.navigation.navigate('Home', {path: 'ProfileBuilder'})}>
					<Image source={ColorBox} style={{ height: 30, width: 30, marginTop: 6, marginRight: 4 }}></Image>
				</TouchableOpacity>
                </Right>
        </Header>
		
          <View style={{ flex: 0.13, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{
              elevation: 3,
              marginTop: 25,
              paddingBottom: 0,
              paddingHorizontal: 25,
              alignSelf: 'stretch',
              justifyContent: 'flex-start',
              alignItems: 'center',
              backgroundColor: '#fff',
              shadowColor: "#F5F6F8",
              shadowOpacity: 0.3,
              shadowRadius: 2,
              shadowOffset: {
                height: 1,
                width: 1
              }
            }}>
              <Text style={{ color: '#33A6FF', fontSize: 28, fontWeight: '600' }}>Profile Builder</Text>
              <Text style={{ marginTop: 4, color: '#BABFC9', fontSize: 16, textAlign: 'center' }}>Add your child's details to create a new Emcard+</Text>
            </View>

          </View>

          <View style={{ flex: 0.07, backgroundColor: 'transparent' }}>
          </View>

          <View style={{ flex: 0.80, alignSelf: 'stretch', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#fff', paddingHorizontal: 20 }}>
            <TouchableOpacity style={{ width: '100%' }} onPress={() => this.props.navigation.navigate('AddChild', { route: 'ProfileBuilder' })}>

              <View style={{
                flexDirection: 'row',
                backgroundColor: 'red',
                paddingHorizontal: 15, paddingVertical: 18,
                borderRadius: 2,
                backgroundColor: '#fff',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 7 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}>
                <View style={{ flex: 0.8, justifyContent: 'center' }}>
                  <Text style={{ fontWeight: 'bold' }}>Add Child and Emergency Contacts</Text>
                  <Text style={{ fontSize: 10, marginTop: 10, color: '#CBCBCB' }}>NOT COMPLETED</Text>
                </View>
                <View style={{ flex: 0.03 }}></View>
                <View style={{ flex: 0.17 }}>
                  <View style={{
                    height: 50, width: 50,
                    shadowColor: '#F2C181',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 1,
                    shadowRadius: 2, borderRadius: 10, backgroundColor: '#FCD375', justifyContent: 'center', alignItems: 'center'
                  }}>
                    <Image source={profile_pic}></Image>
                  </View>
                </View>

              </View>

            </TouchableOpacity>

            <View style={{
              flexDirection: 'row',
              backgroundColor: 'red',
              paddingHorizontal: 15, paddingVertical: 18,
              borderRadius: 2,
              marginTop: 25,
              backgroundColor: '#fff',
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            }}>
              <View style={{ flex: 0.8, justifyContent: 'center' }}>
                <Text style={{ fontWeight: 'bold', color: '#969696' }}>Add Food Alergires</Text>
                <Text style={{ fontSize: 10, marginTop: 10, color: '#969696' }}></Text>
              </View>
              <View style={{ flex: 0.03 }}></View>
              <View style={{ flex: 0.17 }}>
                <View style={{
                  height: 50, width: 50,
                  shadowColor: '#FFCBDE',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2, borderRadius: 10, backgroundColor: '#FFCBDE', justifyContent: 'center', alignItems: 'center'
                }}>
                  <Image source={allergies}></Image>
                </View>
              </View>

            </View>

            <View style={{
              flexDirection: 'row',
              backgroundColor: 'red',
              paddingHorizontal: 15, paddingVertical: 18,
              borderRadius: 2,
              marginTop: 25,
              backgroundColor: '#fff',
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            }}>
              <View style={{ flex: 0.8, justifyContent: 'center' }}>
                <Text style={{ fontWeight: 'bold', color: '#969696' }}>Add Alerts</Text>
                <Text style={{ fontSize: 10, marginTop: 10, color: '#969696' }}></Text>
              </View>
              <View style={{ flex: 0.03 }}></View>
              <View style={{ flex: 0.17 }}>
                <View style={{
                  height: 50, width: 50,
                  shadowColor: '#C2F6F7',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2, borderRadius: 10, backgroundColor: '#C2F6F7', justifyContent: 'center', alignItems: 'center'
                }}>
                  <Image source={alertss}></Image>
                </View>
              </View>

            </View>

            <View style={{
              flexDirection: 'row',
              backgroundColor: 'red',
              marginTop: 25,
              paddingHorizontal: 15, paddingVertical: 18,
              borderRadius: 2,
              backgroundColor: '#fff',
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            }}>
              <View style={{ flex: 0.8, justifyContent: 'center' }}>
                <Text style={{ fontWeight: 'bold', color: '#969696' }}>Add The +, aka "5 Favorites"</Text>
                <Text style={{ fontSize: 10, marginTop: 10, color: '#969696' }}></Text>
              </View>
              <View style={{ flex: 0.03 }}></View>
              <View style={{ flex: 0.17 }}>
                <View style={{
                  height: 50, width: 50,
                  shadowColor: '#CBDEF9',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2, borderRadius: 10, backgroundColor: '#CBDEF9', justifyContent: 'center', alignItems: 'center'
                }}>
                  <Image source={favourites}></Image>
                </View>
              </View>

            </View>
          </View>

        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  }
})
