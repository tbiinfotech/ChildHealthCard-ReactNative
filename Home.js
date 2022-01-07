import React from 'react'
import { StyleSheet, View, Dimensions, ScrollView, ActivityIndicator, TouchableHighlight, TouchableOpacity, StatusBar, TextInput, Image, Alert, Platform } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Item, Input } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ToggleSwitch from 'toggle-switch-react-native';
import CheckBox from 'react-native-check-box'
import * as Permissions from 'expo-permissions';
import { AntDesign } from '@expo/vector-icons';
import constants from '../../constants/constants';
import Loader from './../Loader/loader';
import * as firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Created from './components/Created';
import Received from './components/Received';
import Shared from './components/Shared';
import * as Contacts from 'expo-contacts';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { TabViewAnimated, TabBar, TabViewPage, TabBarTop, TabView, SceneMap } from 'react-native-tab-view';
const em_card_white = require("../../../assets/whiteLogo.png");
const email = require("../../../assets/EmailIcon.png");
const password = require("../../../assets/PasswordIcon.png");
const facebook_icon = require("../../../assets/FBLoginIcon.png");
const apple_icon = require("../../../assets/AppleIcon.png");
const menu_icon = require("../../../assets/menuIcon.png");
const request_icon = require("../../../assets/cardRequestIcon.png");
const ColorBox = require("../../../assets/cardBoxIcon.png");
const right_arrow = require("../../../assets/RightArrowIcon.png");
const info_icon = require("../../../assets/InfoIcon.png");
const hide_icon = require("../../../assets/HidePasswordIcon.png");
const show_icon = require("../../../assets/ShowPasswordIcon.png");
const PlusIcon = require("../../../assets/addIcon.png");
const initialLayout = { width: Dimensions.get('window').width };

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: 'Created' },
        { key: 'second', title: 'Received' },
        { key: 'third', title: 'Shared' }
      ],
      email: "",
      email_warning: '',
      password: '',
      password_warning: '',
      secureEntry: true,
      token: '',
      termsConditions: false,
      emailfield: false,
      sync_contact: 10,
      focusPassword: false,
      focusEmail: false,
      loader: false,
      ageData: false,
      loggedStatus: false,
      popUpText: '',
      isLoading: false,
      successIcon: false,
      errorIcon: false,
      latitude:'',
      longitude:'',
    };
    this.CreatedTabView = React.createRef();
    this.ReceivedTabView = React.createRef();
    this.SharedTabView = React.createRef();

  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.navigation.state.params !== null)
    {
      var path  = nextProps.navigation.state.params.path;
      if(path == "LogOut") {
        this.firebaseLogout();
      }

      if(path == "ShareCardList") {
        this.SharedTabView.current.loadShare();
      }
     
      if(path !== "ShareCardList") {
       this.CreatedTabView.current.loadCreate();
     }      
     
      
    }
  }

  

  firebaseLogout = () => {

    var that = this;
    firebase.auth().signOut()
    .then(async function () {
      that.setState({ popUpText:  'Logging Off...'});
      that.setState({ isLoading: true });
      setTimeout(async function () { 
        that.setState({ isLoading: false }) 
        await AsyncStorage.setItem('loggedIn',JSON.stringify(false));
        await AsyncStorage.removeItem('userData');
        await AsyncStorage.removeItem('ProfileBuilder');
        await AsyncStorage.removeItem('colorCodes');
      that.props.navigation.navigate('Login');
      }, 3000)
      
    })
    .catch(function(error) {
      console.log('error', error);
    });

    
  }

  loaderMethod = () => {
    this.setState({errorIcon: false});
    this.setState({successIcon: false});
    this.setState({isLoading: !this.state.isLoading})
  }

  createdLoader = (val) => {
    if(val == 'add_cards') {
      this.setState({popUpText: 'Fetching your created cards.\n Please wait ...'});
    }
    else{
      this.setState({popUpText: 'Deleting Card ...'});
    }
    
    //
  }

  receivedLoader = (val) => {
    if(val == 'received_card') {
      this.setState({popUpText: 'Fetching your received cards.\n Please wait ...'});
    }
    else{
      this.setState({popUpText: 'Unsharing Card...'});
    }
    
  }

  sharedLoader = () => {
    this.setState({popUpText: 'Fetching your shared cards.\n Please wait ...'});
  }

  successLoader(loadertype) {
    if(loadertype == 'delete') {
      this.setState({successIcon: true});
      this.setState({popUpText: 'Card deleted successfully!'});
      this.setState({isLoading: !this.state.isLoading}) 
    }
    else if(loadertype == 'unshare') {
      this.setState({successIcon: true});
      this.setState({popUpText: 'Card unshared successfully!'});
      this.setState({isLoading: !this.state.isLoading}) 
    }
  }

  errLoader(loadText) {
    this.setState({errorIcon: true});
    this.setState({popUpText: loadText});
    this.setState({isLoading: !this.state.isLoading})    
  }

  FirstRoute = () => (
    <View style={{ marginTop: 30 }}>
      <Created successLoader={this.successLoader.bind(this)} errorLoader={this.errLoader.bind(this)} ref={this.CreatedTabView} createdLoader={this.createdLoader.bind(this)} loadMethod={this.loaderMethod} nav={this.props.navigation} />
    </View>

  );
  SecondRoute = () => (
    <View style={{ marginTop: 30 }}>
      <Received successLoader={this.successLoader.bind(this)} errorLoader={this.errLoader.bind(this)} ref={this.ReceivedTabView} createdLoader={this.receivedLoader} loadMethod={this.loaderMethod} nav={this.props.navigation} />
    </View>

  );
  ThirdRoute = () => (
    <View style={{ marginTop: 30 }}>
      <Shared errorLoader={this.errLoader.bind(this)} ref={this.SharedTabView} createdLoader={this.sharedLoader} loadMethod={this.loaderMethod} nav={this.props.navigation} />
    </View>

  );

  async componentDidMount() {
    this.getToken();
    this.fetchAllContacts();
  }

  async getToken(){
    var userData = await AsyncStorage.getItem('userData');
    var userParseData = JSON.parse(userData);
    var token = 'Bearer '+userParseData.stsTokenManager.accessToken;
    this.setState({token:token})
  }

  fetchAllContacts = async() => {
    
     const { status } = await Contacts.requestPermissionsAsync();
    var combined_array = [];
     if (status === "granted") {
      //  alert('Here');
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.PHONE_NUMBERS,
          Contacts.EMAILS,
        ],
      }
     
      );
      if (data.length > 0) {
        this.setState({
                       contacts: data,
                       }, () => {
                       this.arrayholder = data;
                     });
       }
       var contact_array = this.state.contacts;
       //console.log('All Cpontacts', contact_array);
       var ContactDetail = [];
       
       contact_array.map((data, index) => {

        var ContactMobArray = [];
        var ContactEmailArray = [];

        var mobile_array = data.phoneNumbers;
        var email_array = data.emails;

        if(mobile_array !== undefined && mobile_array.length > 0) {
          mobile_array.map((datamob, indexmob) => {
            var number = datamob.number;
            if(number !== '' && number !== 'NULL') {
              var number_string = number.replace(/[^\d]/g, '');
              ContactMobArray.push(number_string);
            }
          });
        }

        if(email_array !== undefined && email_array.length > 0) {
          email_array.map((dataemail, indexemail) => {
            var email_data = dataemail.email;
            if(email_data !== '' && email_data !== 'NULL') {
              ContactEmailArray.push(email_data);
            }
          });
        }

        var allData = {
          'contactId': data.id,
          'name': data.name,
          'appUserId': "",
          'mobile': ContactMobArray,
          'email': ContactEmailArray,
          'appUser': false
        };

        combined_array.push(allData);
      
       });
       var data_added = {'contacts': combined_array}
       await AsyncStorage.setItem('contacts_data',JSON.stringify(data_added));
       this.renderApiArray(data_added);
     }

  }

  renderApiArray = (allData) => {

    var that = this;        
    var Token = this.state.token;
    var axios = require('axios');

    var data = JSON.stringify(allData);

    var config = {
      method: 'post',
      url: constants.URL.activeURL+'/share/contact_sync',      
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': Token,
      },
      data : data
    };
    

    axios(config)
    .then(async function (response) {  
      if(response.data.success) {
        if(response.data.data !== null) {
        var saved_contacts = await AsyncStorage.getItem('contacts_data');
        var parse_data = JSON.parse(saved_contacts);
        var response_data = response.data.data.contacts;
        //console.log('NumbersFirst', response.data.data);
        response_data.map(async(data, index) => {
          var already_user = data.contactId;
          parse_data.contacts.map(async(dd, ind) => {
            var allContactId = dd.contactId;
            if(already_user == allContactId) {
               parse_data.contacts[ind].appUser = true;
             // console.log('NumbersName', dd.name);
               parse_data.contacts[ind].appUserId = data.user_id;
               
               await AsyncStorage.setItem('contacts_data',JSON.stringify(parse_data));
            }
          });
        });
        
        // var check_data = await AsyncStorage.getItem('contacts_data');
        //  console.log('successLatest ======>>>>404', JSON.parse(check_data));

        }
                           
      }      
    })
    .catch(function (error) {
      if(error.toJSON().message === 'Network Error'){        
        Alert.alert(
          'EmCard+',
          'An SSL error has occured and a secure connection to the server cannot be made.',
          [
            {
              text: 'Ok', onPress: async () => {
                console.log('ok Pressed');
              }
            }
          ],
          { cancelable: false }
        );      
      }
      else{
        var errorMessage = error.response.data.message;     
        Alert.alert(
          'EmCard+',
          errorMessage,
          [
            {
              text: 'Ok', onPress: async () => {
                console.log('ok Pressed');
              }
            }
          ],
          { cancelable: false }
        );  
          
      }                 
    });

  }



  validations() {
    this.setState({ email_warning: '', password_warning: '' })

    const { email, password } = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (email == '') {
      this.setState({ email_warning: 'Please enter email address.', fullname_waring: '' })
    }
    else if (reg.test(email) == false) {
      this.setState({ email_warning: 'Email invalid. Please check for typos or extra spaces and try again.' })
    }
    else if (password == '') {
      this.setState({ password_warning: 'Please enter password.', email_warning: '' })
    }
    else {
      this.loginUser(email, password)
    }
  }

  loginUser(email, password) {

    var parameters = {
      "email": email,
      "password": password,
    };
    var url_login = constants.URL.json_api + 'generate_auth_cookie?username=' + email + '&insecure=cool&password=' + password;
    this.setState({ loader: true });
    fetch(url_login,
      {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
      .then(async (response) => response.text())
      .then(async (responseText) => {
        var dataobject = JSON.parse(responseText);
        console.log('dataobjectdataobjectdataobject', dataobject);
        if (dataobject.status == 'ok') {
          this.setState({ email_warning: '', password_warning: '' })
          this.setState({ email: '', password: '' })
          this.setState({ loader: false });
          await SecureStore.setItemAsync('loggedin', JSON.stringify(true));
          await SecureStore.setItemAsync('user_data', JSON.stringify(dataobject));
          this.props.navigation.navigate("Home");
        }
        else if (dataobject.status == 'error') {
          this.setState({ loader: false });
          alert(dataobject.error);
        }
        else {

        }

      }
      )
      .catch((error) => {
        alert(error);
        this.setState({ loader: false });
        console.log('check_error', error);
      })
  }

  provide_info() {
    Alert.alert(
      "Password must contain the following:",
      "\u2027 At least one capital letter \n \u2027 At least one number \n  \u2027 At least one special character\n  \u2027 Minimum 8 characters",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  }


  checkCallUser = () => {
    Alert.alert(
      'EmCard+',
      'Would you like to Create or Request an EmCard+?',
      [
        {
          text: 'Create',
          onPress: () => this.props.navigation.navigate('ProfileBuilder'),
          style: 'Cancel'
        },
        {
          text: 'Request', onPress: async () => {
            this.props.navigation.navigate('Request')             
          }, style: 'Ok'
        },
        {
          text: 'Cancel', onPress: async () => {
            console.log('Cancel Pressed');            
          }, style: 'Later'
        }
      ],
      { cancelable: false }
    );
    
  }

  render() {
    const { navigation } = this.props;
    var IndexNo = this.state.index;
    var Routess = this.state.routes;
    var that = this;
    return (
      <Container>

            <Header style={{ backgroundColor: '#E94369', width: '100%'}}>
                <Left style={{flex:1, backgroundColor: 'transparent'}}>
                <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()} style={{ backgroundColor: 'transparent' ,flex: 0.10, justifyContent: 'center' }}>
                  <View>
                    <Image source={menu_icon} style={{ marginTop: 10, marginLeft: 10, height: 22, width: 28 }}></Image>
                  </View>
                </TouchableOpacity>
                </Left>
                <Body style={{flex:1}}>
                <Image source={em_card_white} style={{marginBottom: 0}}></Image>
                </Body>
                <Right style={{flex:1, backgroundColor: 'transparent'}}>
                <TouchableOpacity onPress={() => this.checkCallUser()} style={{ backgroundColor: 'transparent'  }}>
                     <Image source={PlusIcon} style={{ height: 28, width: 28, marginTop: 6, marginRight: 4 }}></Image>
                </TouchableOpacity>
                </Right>
            </Header>

        {/* <Header  style={{ backgroundColor: '#E94369', width: '100%'}}>
          <View style={{ flexDirection: 'row', flex: 1, backgroundColor: 'green', width: '100%'}}>
            <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()} style={{ backgroundColor: 'transparent' ,flex: 0.10, justifyContent: 'center' }}>
              <View>
                <Image source={menu_icon} style={{ marginTop: 10, marginLeft: 0, height: 22, width: 28 }}></Image>
              </View>
            </TouchableOpacity>

            <View style={{ flex: 0.80, backgroundColor: 'transparent', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Image source={em_card_white} style={{marginBottom: 8}}></Image>
            </View>
            <View style={{ flex: 0.10, backgroundColor: 'transparent', alignItems: 'flex-end', justifyContent: 'center' }}>
              <TouchableOpacity>
              <Image source={ColorBox} style={{ height: 30, width: 30, marginTop: 6, marginRight: 0 }}></Image>
              </TouchableOpacity>

            </View>

          </View>
        </Header> */}
        
        <View style={{ flex: 1 }}>

        {this.state.isLoading &&
            <Loader
              LoaderText={this.state.popUpText}
              errorIcon={this.state.errorIcon}
              successIcon={this.state.successIcon}
            />
          }

          <View style={{
            elevation: 3,
            paddingTop: 15,
            paddingBottom: 35,
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
            <Text style={{ color: '#33A6FF', fontSize: 24, fontWeight: '600' }}>CardBox</Text>
          </View>
          <TabView
            lazy
            swipeEnabled={false}
            renderTabBar={props =>
              <TabBar              
                {...props}
                indicatorStyle={{ backgroundColor: 'white' }}
                style={{
                  backgroundColor: 'transparent', borderWidth: 0, shadowRadius: 0,
                  shadowOffset: {
                    height: 0,
                  },
                }}
                tabStyle={{ backgroundColor: 'transparent', borderWidth: 0, padding: 0, marginBottom: 10 }} // here
                renderLabel={({ route, focused, color }) => (
                  <View style={
                    route.key === props.navigationState.routes[this.state.index].key
                      ? styles.selectedTabStyle
                      : styles.unselectedTabStyle
                  }>
                    <Text style={
                      route.key === props.navigationState.routes[this.state.index].key
                        ? styles.selectedTextStyle
                        : styles.unselectedTextStyle
                    }>
                      {route.title}
                    </Text>
                  </View>
                )}
              />}
            navigationState={this.state}
            renderScene={SceneMap({
              first: this.FirstRoute,
              second: this.SecondRoute,      
              third: this.ThirdRoute,
            })}
            style={{ marginHorizontal: 20, }}
            onIndexChange={index => {
              console.log('indexxxx', index);
              this.setState({ index });
              if(index == 0) {  
                if(that.CreatedTabView.current !== null) {
                  that.CreatedTabView.current.loadCreate();
                }                             
              }
              else if(index == 1) {
                if(that.ReceivedTabView.current !== null) {
                  that.ReceivedTabView.current.loadReceive();
                }                
              }
              else if(index == 2) {
                if(that.SharedTabView.current !== null) {
                  that.SharedTabView.current.loadShare();
                }
              }
            }              
            }
            initialLayout={{ width: Dimensions.get('window').width }}
          />
          
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scene: {
    flex: 1,
  },
  selectedTabStyle: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#fff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  selectedTextStyle: {
    margin: 0,
    fontSize: 15,
    color: '#00ABFF'
  },
  unselectedTextStyle: {
    color: '#8E8E93',
    fontSize: 14,
  }
})
