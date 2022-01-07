import React from 'react'
import { StyleSheet, ScrollView, Dimensions, Alert, View,FlatList, TouchableOpacity, TextInput, Image, Platform, Keyboard, NativeModules, Modal,SearchBar,Linking} from 'react-native';
import { Container, Header, Text} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import * as Contacts from 'expo-contacts';
import * as MailComposer from 'expo-mail-composer';
import * as SMS from 'expo-sms';
import RNFS from 'react-native-fs';
import * as firebase from 'firebase';
import email from 'react-native-email';
import Loader from './Loader/loader';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import constants from '../constants/constants';
import firebase_config from '../constants/config';
import ActionSheet from 'react-native-actionsheet';
var Reactt = require("react-native");
var ShareManager = Reactt.NativeModules.ShareManager;

const emcard_logo = require("../../assets/EmcardLogo.png");
const em_card_white = require("../../assets/whiteLogo.png");
const back_arrow = require("../../assets/BackIcon.png");
const ColorBox = require("../../assets/cardBoxIcon.png");
const arrow_blue = require("../../assets/rightArrowBlueIcon.png");
const arrow_green = require("../../assets/rightArrowGreenIcon.png");
const search_icon = require("../../assets/SearchIcon.png");

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class ShareCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text:'',
      isLoading: false,
      popUpText: '',
      successIcon: false,
      errorIcon: false,
      contacts: [],
      allerg_array: [],
      message:"",
      token:'',
      modal_visible: false,
      

      name:'',
      dob:'',
      food:'',
      movie:'',
      game: '',
      name:'',
      book:'',
      song:'',
      phone_selected: '',
      show:'',
      adult1:'',
      adult2:'',
      phone1:'',
      phone2:'',
      phone3:'',
      adult3:'',
      allergy:'',
      medicine:'',
      relation1:'',
      relation2:'',
      relation3:'',
      benadryl: '',
      cardName: '',
      epinephrine: '',
      allergies_string: '',
      card_image_url: '',
      allergy_length: 0,

      emergency_plan:'',
      health:'',
      medications:'',
      otherDetails:'',
      other: '',
      rowIndex: null,
      refreshing: false,
      responseAdded: false,
      contacts_status:true,


      card_name: '',
      card_image: '',
      card_date: '',
      card_color: '',
      colors_rray: [],
      allergy_array: [],
      phoneNumber:'',
      email:'',
      contactsFetched:false,
      sendSMS:'',
      DATA_LIST: [],
      sendMail:'',
      card_colors: {},
      adults_array: [],
      screenshot_url: '',
      backgroundColor_gradient: [],
      fav_array: [],
      backgroundColor_array: [],
      cardId:this.props.navigation.getParam('cardId'),
      cardName:this.props.navigation.getParam('cardName'),
    };
    this.gradient=['#fff', '#fff'];
     this.arrayholder = [];
    }




  async componentDidMount() {
    this.colorCodes();
    this.allergyCodes();
    this.getToken();
    this.fetch_contacts();
    this.getDetails();
    if(this.props.navigation.state.params.shareUri !== undefined) {
      this.setState({screenshot_url: this.props.navigation.state.params.shareUri})
     }
    
  }

  componentWillReceiveProps(nextprops) {
    if(nextprops.navigation.state.params.shareUri !== undefined) {
      this.setState({
        screenshot_url: nextprops.navigation.state.params.shareUri
    }, () => {
      this.sendShareEmail();
    });
    }
  }

  colorCodes = async() => {
    var colors = await AsyncStorage.getItem('colorCodes');
    var parseColors = JSON.parse(colors);
   
    this.setState({backgroundColor_array: parseColors.data.cardColorSchemes});
   }

   allergyCodes = async() => {
    var allergies = await AsyncStorage.getItem('allergies');
    var parseAllergies = JSON.parse(allergies);
    this.setState({allerg_array: parseAllergies.data});
   }


 
    async getDetails() {
      const cardId =this.state.cardId;
      this.setState({fav_array: []});
      this.setState({ popUpText: 'Loading contacts...' });
      this.setState({ isLoading: true });
      this.setState({ errorIcon: false });
      this.setState({ successIcon: false });
  
      var userData = await AsyncStorage.getItem('userData');
      var userParseData = JSON.parse(userData);
      var token = 'Bearer '+userParseData.stsTokenManager.accessToken;
      
      var that = this;        
      var axios = require('axios');
  
      var config = {
        method: 'get',
        url: constants.URL.activeURL+'/cards/get_card/'+cardId,      
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      };
      axios(config)
      .then(async function (response) {
        if(response.data.success) {
          var data_new = response.data;
        
          that.setState({adults_array: data_new.data.cardData.contactDetails.adults});
          var myArray = data_new.data.cardData.contactDetails.adults;
          var ColorId = data_new.data.cardData.details.color_id;
          that.setState({DATA_LIST:myArray});
          
  
          var epinephrine_val = data_new.data.cardData.allergyDetails.epinephrine;
          var backgroundColors = that.state.backgroundColor_array;
          var selectedColor = data_new.data.cardData.details.color_id;
          backgroundColors.map((data, index) => {
  
            var colorId = data.optionId;
            if(colorId == selectedColor) {
            
              that.gradient = data.background.colors;
              that.setState({backgroundColor_gradient: data.background.colors});
              that.setState({card_colors: data});
            }
          });       
  
          if(epinephrine_val !== '') {
            if(epinephrine_val == 1) {
              epinephrine_val = 'Epi-Pen ('+0.15+' mg)';
            }
            else if(epinephrine_val == 2){
              epinephrine_val = 'Epi-Pen ('+0.3+' mg)';
            }
            else if(epinephrine_val == 3){
              epinephrine_val = 'Auvi-Q ('+0.1+' mg)';
            }
            else if(epinephrine_val == 4){
              epinephrine_val = 'Auvi-Q ('+0.15+' mg)';
            }
            else if(epinephrine_val == 5){
              epinephrine_val = 'Auvi-Q ('+0.3+' mg)';
            }
            else {
              epinephrine_val = '';
            }
          }
  
          var fav_array = that.state.fav_array;
          if(data_new.data.cardData.otherDetails.song !== ''){
            fav_array.push({'name': data_new.data.cardData.otherDetails.song, 'type': 'song'}); 
          }
          if(data_new.data.cardData.otherDetails.show !== ''){
            fav_array.push({'name': data_new.data.cardData.otherDetails.show, 'type': 'show'}); 
          }
          if(data_new.data.cardData.otherDetails.food !== ''){
            fav_array.push({'name': data_new.data.cardData.otherDetails.food, 'type': 'food'}); 
          }
          if(data_new.data.cardData.otherDetails.game !== ''){
            fav_array.push({'name': data_new.data.cardData.otherDetails.game, 'type': 'game'}); 
          }
          if(data_new.data.cardData.otherDetails.book !== '') {
            fav_array.push({'name': data_new.data.cardData.otherDetails.book, 'type': 'book'});          
          }        
          else{
  
          }
          that.setState({fav_array: fav_array})
  
  
          var allrgyIds = data_new.data.cardData.allergyDetails.allergies_ids;        
          var loc_array = [];
          if(allrgyIds !== null) {
            if(allrgyIds.length > 0) {
              for(var i=0; i<allrgyIds.length; i++) {
                var Ids = allrgyIds[i]
                that.state.allerg_array.map((data, index) => {
                  if(data.allergy_id == Ids) {
                    loc_array.push(data.allergy_name);
                  }
                });
              }
              var array_allergies = loc_array.join(', ');          
              that.setState({allergies_string: array_allergies});
            }
          }
          
          
  
         setTimeout(function () { 
            that.setState({ 
              card_date: data_new.data.cardData.details.created_date,
              name:data_new.data.cardData.contactDetails.childName,
              dob:data_new.data.cardData.contactDetails.childDOB,
              medications: data_new.data.cardData.allergyDetails.medications,
              allergy: data_new.data.cardData.allergyDetails.allergies, 
              allergy_array: data_new.data.cardData.allergyDetails.allergies_ids, 
              book: data_new.data.cardData.otherDetails.book,
              food:data_new.data.cardData.otherDetails.food,
              game:data_new.data.cardData.otherDetails.game,
              song:data_new.data.cardData.otherDetails.song,
              movie:data_new.data.cardData.otherDetails.show,            
              medicine: data_new.data.cardData.alertDetails.medicine,
              emergency_plan:data_new.data.cardData.allergyDetails.notes,
              benadryl:data_new.data.cardData.allergyDetails.benadryl,
              epinephrine:epinephrine_val,
              health:data_new.data.cardData.alertDetails.health,
              other:data_new.data.cardData.alertDetails.other,
              cardName: data_new.data.cardData.details.card_name,
              card_id: data_new.data.cardData.details.card_id,
              card_image_url: data_new.data.cardData.details.card_image,
            });
          that.setState({ isLoading: false }); 
          that.setState({responseAdded: true});
        }, 1000) 

          
                   
        }
        else{
          if(response.data.statusCode == 403) {             
           firebase.auth().onAuthStateChanged((user) => {
            if (user) {
            firebase.auth().currentUser.getIdToken(true)
            .then(async function(idToken) {
            var userData = await AsyncStorage.getItem('userData');
            var userParseData = JSON.parse(userData);
            userParseData.stsTokenManager.accessToken = idToken;
            await AsyncStorage.setItem('userData', JSON.stringify(userParseData));
            that.getDetails();
            }).catch(function(error) {
              that.setState({ isLoading: false });
             });
            } else {
            }
          }); 
  
         }
         else{
            that.setState({ isLoading: false });
            that.setState({ errorIcon: true });
            var errorMessage = response.data.message;   
            that.setState({ popUpText: errorMessage });   
            setTimeout(function () { that.setState({ isLoading: true })  }, 100)
            setTimeout(function () { that.setState({ isLoading: false })  }, 3000)     
         }    
        } 
      })
      .catch(function (error) {            
        that.setState({ isLoading: false });
        if (error.response) {
          that.setState({ errorIcon: true });
          var errorMessage = error.response.data.message;      
          that.setState({ popUpText: errorMessage });   
          setTimeout(function () { that.setState({ isLoading: true })  }, 100)
          setTimeout(function () { that.setState({ isLoading: false })  }, 3000) 
        } else if (error.request) {
          that.setState({DATA_LIST: [], network_error: true});
          Alert.alert(
            'EmCard+',
            'An SSL error has occured and a secure connection to the server cannot be made.',
            [
              {
                text: 'Ok', onPress: async () => {
                  
                }
              }
            ],
            { cancelable: false }
          ); 
        } else {
          // Something happened in setting up the request that triggered an Error
          var errorMessage = error.message; 
          that.setState({ errorIcon: true });
          that.setState({ popUpText: errorMessage });   
          setTimeout(function () { that.setState({ isLoading: true })  }, 100)
          setTimeout(function () { that.setState({ isLoading: false })  }, 3000)
        } 
       });
       
    }

  async getToken(){
    var userData = await AsyncStorage.getItem('userData');
    var userParseData = JSON.parse(userData);
    var token = 'Bearer '+userParseData.stsTokenManager.accessToken;
    this.setState({token:token})
  }

  updateAppUser = async(share_id) => {
    var shareId = share_id;
    var cardId = this.state.cardId;
    var params = {"card_id": cardId, "shared_with_id": shareId};
    

      this.setState({ popUpText: 'Please wait...' });
      this.setState({ isLoading: true });
      this.setState({ errorIcon: false });
      this.setState({ successIcon: false });
  
      var userData = await AsyncStorage.getItem('userData');
      var userParseData = JSON.parse(userData);
      var token = 'Bearer '+userParseData.stsTokenManager.accessToken;
      
      var that = this;        
      var axios = require('axios');
  
      var config = {
        method: 'post',
        url: constants.URL.activeURL+'/share/share_card/',      
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        data: params
      };
      axios(config)
      .then(async function (response) {
        if(response.data.success) {
          that.setState({ isLoading: false }); 

             
            that.setState({ popUpText: response.data.message });
            that.setState({ successIcon: true });
            that.setState({ isLoading: true });        
         
          setTimeout(function () { that.setState({ isLoading: false }); that.setState({ successIcon: false });  }, 3000)                      
        }
        else{
          if(response.data.statusCode == 403) {             
           firebase.auth().onAuthStateChanged((user) => {
            if (user) {
            firebase.auth().currentUser.getIdToken(true)
            .then(async function(idToken) {
            var userData = await AsyncStorage.getItem('userData');
            var userParseData = JSON.parse(userData);
            userParseData.stsTokenManager.accessToken = idToken;
            await AsyncStorage.setItem('userData', JSON.stringify(userParseData));
            that.updateAppUser(share_id);
            }).catch(function(error) {
              that.setState({ isLoading: false });
             
             });
            } else {
              
            }
          }); 
  
         }
         else{
            that.setState({ isLoading: false });
            that.setState({ errorIcon: true });
            var errorMessage = response.data.message;   
            that.setState({ popUpText: errorMessage });   
            setTimeout(function () { that.setState({ isLoading: true })  }, 100)
            setTimeout(function () { that.setState({ isLoading: false })  }, 3000)     
         }    
        } 
      })
      .catch(function (error) {            
        that.setState({ isLoading: false });
        if (error.response) {
          that.setState({ errorIcon: true });
          var errorMessage = error.response.data.message;      
          that.setState({ popUpText: errorMessage });   
          setTimeout(function () { that.setState({ isLoading: true })  }, 100)
          setTimeout(function () { that.setState({ isLoading: false })  }, 3000) 
        } else if (error.request) {
          that.setState({DATA_LIST: [], network_error: true});
          Alert.alert(
            'EmCard+',
            'An SSL error has occured and a secure connection to the server cannot be made.',
            [
              {
                text: 'Ok', onPress: async () => {
               
                }
              }
            ],
            { cancelable: false }
          ); 
        } else {
          // Something happened in setting up the request that triggered an Error
          var errorMessage = error.message; 
          that.setState({ errorIcon: true });
          that.setState({ popUpText: errorMessage });   
          setTimeout(function () { that.setState({ isLoading: true })  }, 100)
          setTimeout(function () { that.setState({ isLoading: false })  }, 3000)
        } 
       });
     
  }


  
  renderItem = ({item,index}) => {
    var name = item.name;

    if(item.email.length > 0){
      //this.setState({contacts_status:false})
      return(
        <View style={{flex:1,alignSelf: 'stretch', alignItems: 'flex-start', justifyContent: 'flex-start', paddingHorizontal: 20}}>
            <View style={{ width: '100%', alignSelf: 'stretch', paddingHorizontal: 15, paddingVertical: 15,
                        borderRadius: 7,
                        backgroundColor: '#fff',
                        marginTop: 15,
                        shadowColor: '#000000',
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.3,
                       shadowRadius: 2,
                       elevation:3}}>
           <View style={{flexDirection:'row',  backgroundColor: 'transparent',justifyContent:'space-between'}}>
           <View style={{flex: 0.7}}>
              <Text 
              style={{fontWeight: 'bold', fontSize: 14}}>{name}</Text>
              {item.appUser == true && 
                  <Text style={{ color: '#BABFC9', fontSize: 10, marginTop: 8 }}>is using the app</Text>  
              }

              {item.appUser == false && 
                  <Text style={{ color: '#BABFC9', fontSize: 10, marginTop: 8 }}>is not using the app</Text>  
              }
              
           </View>
           <View style={{flex: 0.3}}>
           {item.appUser == true && 
            <TouchableOpacity onPress={() => {this.updateAppUser(item.appUserId)}}>
            <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 10, paddingVertical: 9, backgroundColor: '#DCEDC8', justifyContent: 'center', alignItems: 'center', borderRadius: 6 }}>
               <Text style={{ fontSize: 11, color: '#4CAF50', fontWeight: '600', paddingRight: 10 }}>share</Text>
               <Image source={arrow_green}></Image>
            </View>
           </TouchableOpacity>
            }

          {item.appUser == false && 
            <TouchableOpacity onPress={() => {this.updateUserdetail(item.mobile[0], item.email[0], 'newUser', name)}}>
            <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 10, paddingVertical: 6, backgroundColor: '#99ccff', justifyContent: 'center', alignItems: 'center', borderRadius: 6 }}>
               <Text style={{ fontSize: 11, color: '#2590FE', fontWeight: '600', paddingRight: 10 }}>share</Text>
               <Image source={arrow_blue}></Image>
            </View>
           </TouchableOpacity>
            }
              
                   
          </View>
          </View>
          </View>
      </View>
      );
    }else{
    return(
        <View style={{flex:1,alignSelf: 'stretch', alignItems: 'flex-start', justifyContent: 'flex-start', paddingHorizontal: 20}}>
            <View style={{ width: '100%', alignSelf: 'stretch', paddingHorizontal: 15, paddingVertical: 15,
                        borderRadius: 7,
                        backgroundColor: '#fff',
                        marginTop: 15,
                        shadowColor: '#000000',
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.3,
                       shadowRadius: 2,
                       elevation:3}}>
           <View style={{flexDirection:'row',  backgroundColor: 'transparent',justifyContent:'space-between'}}>
           <View style={{flex: 0.7}}>
              <Text 
              style={{fontWeight: 'bold', fontSize: 14}}>{name}</Text>
              {item.appUser == true && 
                  <Text style={{ color: '#BABFC9', fontSize: 10, marginTop: 8 }}>is using the app</Text>  
              }

              {item.appUser == false && 
                  <Text style={{ color: '#BABFC9', fontSize: 10, marginTop: 8 }}>is not using the app</Text>  
              }
           </View>
           <View style={{flex: 0.3}}>
           {item.appUser == true && 
           <TouchableOpacity onPress={() => {this.updateAppUser(item.appUserId)}}>
             <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 10, paddingVertical: 9, backgroundColor: '#DCEDC8', justifyContent: 'center', alignItems: 'center', borderRadius: 6 }}>
                <Text style={{ fontSize: 11, color: '#4CAF50', fontWeight: '600', paddingRight: 10 }}>share</Text>
                <Image source={arrow_green}></Image>
             </View>
            </TouchableOpacity>
            }

          {item.appUser == false && 
           <TouchableOpacity onPress={() => {this.updateUserdetail(item.mobile[0], 'NULL', 'newUser', name)}}>
             <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 10, paddingVertical: 6, backgroundColor: '#99ccff', justifyContent: 'center', alignItems: 'center', borderRadius: 6 }}>
                <Text style={{ fontSize: 11, color: '#2590FE', fontWeight: '600', paddingRight: 10 }}>share</Text>
                <Image source={arrow_blue}></Image>
             </View>
            </TouchableOpacity>
            }

          </View>
          </View>
          </View>
      </View>
      );
      }
    }
   


  
  showActionSheet = (number,email) => {

     this.setState({phoneNumber:number})
     this.setState({email:email})
    // Keyboard.dismiss();
   
    var that = this;
    setTimeout(() => {
      this.ActionSheet.show();
    }, 500);

  };




updateUserdetail = (number, email, user_status, name) => {


  this.setState({ popUpText: 'Please wait...' });
  this.setState({ isLoading: true });
  var myId = this.state.cardId;
  var Token = this.state.token;

  var pass_number = number;

  if(pass_number == '' || pass_number == undefined) {
    pass_number = email;
  }
 
  var parameters = {
    "card_id": parseInt(myId),
    "search_for":pass_number,
  };
  
   var that = this;        
  var axios = require('axios');
  var data = JSON.stringify(parameters);
 

  var config = {
    method: 'post',
   url: constants.URL.activeURL+'/share/get_invite_code/v2',  
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': Token,
    },
    data : data
  };



  axios(config)
  .then(async function (response) {
    if(response.data.success) {

        that.setState({ isLoading: false });
        that.showActionSheet(number,email),
        that.createShortLink(response.data.data.invite_code, user_status, name);
        }
        else {
          if(response.data.statusCode == 403) {      
            firebase.auth().onAuthStateChanged((user) => {
              if (user) {	
              firebase.auth().currentUser.getIdToken(true)
              .then(async function(idToken) {
              var userData = await AsyncStorage.getItem('userData');
              var userParseData = JSON.parse(userData);
              userParseData.stsTokenManager.accessToken = idToken;
              await AsyncStorage.setItem('userData', JSON.stringify(userParseData));
              that.updateUserdetail(number, email, user_status, name);
              }).catch(function(error) {
               });
              } else {
              }
            });                   
          }
          else{
            var errorMessage = response.data.message;
            that.setState({ popUpText: errorMessage });
            setTimeout(function () { that.setState({ isLoading: true }) }, 100)
            setTimeout(function () { that.setState({ isLoading: false }); that.setState({ errorIcon: false }); }, 3000)
          }
        } 
        })
  .catch(function (error) {
    that.setState({ isLoading: false });
    that.setState({ errorIcon: true });
    var errorMessage = error.response.data.message;
    that.setState({ popUpText: errorMessage });
    setTimeout(function () { that.setState({ isLoading: true }) }, 100)
    setTimeout(function () { that.setState({ isLoading: false }); that.setState({ errorIcon: false }); }, 3000)
  });

}

createShortLink = (full_link, status_user, user_name) => {
var that = this;
var axios = require('axios');
var data = JSON.stringify({"dynamicLinkInfo":{"domainUriPrefix":constants.URL.dynamicLink_prod,
"link":"https://www.emcardplus.com/share?action=dlsc&inviteID="+full_link,
"iosInfo":{"iosBundleId":"com.emcardplus.app"}}});

    var config = {
      method: 'post',
      url: 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key='+firebase_config.apiKey,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios(config)
    .then(function (response) {       
      if(status_user == 'appUser') {
        //var myMail = "Hello,</br></br>Welcome to EmCard+.Join us in the App to receive your first shared card.</br></br>CLICK HERE: "+response.data.shortLink+"</br></br>We look forward to having you as part of the <b>EmCard+</b> community!</br></br>Sincerely,</br>Your <b>EmCard+</b> Team";    
        //var myLink = "Welcome! Click on the link below to register or retrieve your first shared EmCard+ ! "+response.data.shortLink;
        var myMail = "I just shared "+that.state.cardName+"'s EmCard+ with you. Check it out here: "+response.data.shortLink;    
        var myLink = "I just shared "+that.state.cardName+"'s EmCard+ with you. Check it out here: "+response.data.shortLink;
      }     
      else{
        var myMail = "Here is important info about "+that.state.cardName+". You can open it and keep it safe with this app: "+response.data.shortLink;    
        var myLink = "Here is important info about "+that.state.cardName+". You can open it and keep it safe with this app: "+response.data.shortLink;
      }
     
      that.setState({ message: myLink })
      that.setState({ sendMail: myMail })
    })
    .catch(function (error) {
    });
}


_sentSms = () => {
  this.sendShareMessage();
}

sendShareMessage = async () => {

  var uri = "file://"+this.state.screenshot_url;

  var message =  "I just shared "+this.state.cardName+"'s EmCard+ with you. You can download the app from link : <App Store Link>";   

  ShareManager.shareURL(message, uri);

	NativeModules.SendSMS.send({
		body: this.state.message,
		recipients: [this.state.phoneNumber],
	 	attachment: attachment
	}, (completed, cancelled, error) => {

	});
}

sendShareMessageDemo = async () => {
  var uri = "file://"+this.state.screenshot_url;

  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  var shrtId = firstPart + secondPart;

  const destPath = `${RNFS.TemporaryDirectoryPath}/${shrtId}`;
  await RNFS.copyFile(uri, destPath);
  var pathh = await RNFS.stat(destPath);
  var new_path = pathh;
}

fetch_contacts = async() => {


  var check_data = await AsyncStorage.getItem('contacts_data');
  var parse_check_data = JSON.parse(check_data);

         this.setState({
                     contacts: parse_check_data.contacts,
                     }, () => {
                     this.arrayholder = parse_check_data.contacts;
                   });
  }




  searchData(text) {

    if(isNaN(text) == false){

      const newData = this.arrayholder.filter(item => {
        try{
          if(item.mobile.length == 1) {
            const itemData = item.mobile[0];
            const textData = text;
            return itemData.indexOf(textData) > -1
          }
          else if(item.mobile.length == 2) {
            const itemData1 = item.email[0];
            const itemData2 = item.email[1];
            const textData = text;
            if(itemData1.indexOf(textData) > -1 == false) {
              return itemData2.indexOf(textData) > -1
            }
            else{
              return itemData1.indexOf(textData) > -1
            }
            
          }
         
        }catch(error){      
        }
      });
  
      this.setState({
        contacts: newData,
        text: text
      })
    }
    else {
      const newData = this.arrayholder.filter(item => {
        try{
          const itemData = item.name.toUpperCase();
          const textData = text.toUpperCase();

  
          if(itemData.indexOf(textData) > -1 == false) {
            if(item.email.length == 1) {
                    const itemData = item.email[0].toUpperCase();
                    const textData = text.toUpperCase();
                     
                    return itemData.indexOf(textData) > -1
            }
                    else if(item.email.length == 2) {
                      const itemData1 = item.email[0].toUpperCase();
                      const itemData2 = item.email[1].toUpperCase();
                      const textData = text.toUpperCase();
                      if(itemData1.indexOf(textData) > -1 == false) {
                        return itemData2.indexOf(textData) > -1
                      }
                      else{
                        return itemData1.indexOf(textData) > -1
                      }
                      
                    }
          }
          else {
            return itemData.indexOf(textData) > -1
          }
          
        }catch(error){      
        }
      });
   
      this.setState({
        contacts: newData,
        text: text
         })
        }   
      }

    sendShareEmail = async() => {
      var that = this;
      var uri = this.state.screenshot_url;

     var local_uri = "file://"+uri;
      await MailComposer.composeAsync({
        attachments: [local_uri],
        subject: "You've received an EmCard+",
        body: that.state.sendMail,
        recipients: [that.state.email]
      })
      .catch(function (error) {     
        alert(error.message);
      });
    }

    _sendShareImage = () => {
      var that = this;
      this.setState({modal_visible: true});

      setTimeout(function () { 
        
        captureRef(that._shareViewContainer, {
        }).then(
          uri => {
            that.setState({modal_visible: false});
            
            that.setState({screenshot_url: uri})
            var uri = "file://"+uri;
            var message = "Here is "+that.state.cardName+"'s EmCard+ and this is the app I created it with:";
           // var message =  "I just shared "+that.state.cardName+"'s EmCard+ with you. You can download the app from link : <App Store Link>";   
            ShareManager.shareURL(message, uri, 'https://emcardplus.com/');
          },
          error => console.error('Oops, snapshot failed', error)
        );
      
      }, 1000)
    }
  
    _sendMail = (type) => {
      var that = this;
      this.setState({modal_visible: true});

      setTimeout(function () { 
        
        captureRef(that._shareViewContainer, {
        }).then(
          uri => {
            that.setState({modal_visible: false});
            
            that.setState({screenshot_url: uri})
            if(type == 'mail') {
              setTimeout(function () { that.sendShareEmail();  }, 500)
            }
            else{
              setTimeout(function () { that.sendShareMessage();  }, 500)
            }
            
          },
          error => console.error('Oops, snapshot failed', error)
        );
      
      }, 1000)

     

      
  }


  renderFav(selectedColor) {
    var fav_array = this.state.fav_array;
    var logos = this.state.card_colors.logos;
    return fav_array.map((data,index) => {
      var iconFav = '';
      if(data.type == 'book') {
        if(logos.book == 'BookPinkLogo') {
          iconFav = require("../../assets/BookPinkLogo.png");
        }
        else if(logos.book == 'BookPurpleLogo') {
          iconFav = require("../../assets/BookPurpleLogo.png");
        } 
        else if(logos.book == 'BookWhiteLogo') {
          iconFav = require("../../assets/BookWhiteLogo.png");
        } 
        else if(logos.book == 'BookGrayLogo') {
          iconFav = require("../../assets/BookGrayLogo.png");
        }
        else{
          iconFav = require("../../assets/BookWhiteLogo.png");
        } 
      }
      if(data.type == 'food') {
        if(logos.fruit == 'FruitPinkLogo') {
          iconFav = require("../../assets/FruitPinkLogo.png");
        }
        else if(logos.fruit == 'FruitPurpleLogo') {
          iconFav = require("../../assets/FruitPurpleLogo.png");
        } 
        else if(logos.fruit == 'FruitWhiteLogo') {
          iconFav = require("../../assets/FruitWhiteLogo.png");
        } 
        else if(logos.fruit == 'FruitGrayLogo') {
          iconFav = require("../../assets/FruitGrayLogo.png");
        }
        else{
          iconFav = require("../../assets/FruitWhiteLogo.png");
        } 
      }  
      if(data.type == 'game') {
        if(logos.game == 'GamePinkLogo') {
          iconFav = require("../../assets/GamePinkLogo.png");
        }
        else if(logos.game == 'GamePurpleLogo') {
          iconFav = require("../../assets/GamePurpleLogo.png");
        } 
        else if(logos.game == 'GameWhiteLogo') {
          iconFav = require("../../assets/GameWhiteLogo.png");
        } 
        else if(logos.game == 'GameGrayLogo') {
          iconFav = require("../../assets/GameGrayLogo.png");
        }
        else{
          iconFav = require("../../assets/GameWhiteLogo.png");
        } 
      }  
      if(data.type == 'song') {
        if(logos.music == 'MusicPinkLogo') {
          iconFav = require("../../assets/MusicPinkLogo.png");
        }
        else if(logos.music == 'MusicGrayLogo') {
          iconFav = require("../../assets/MusicGrayLogo.png");
        } 
        else if(logos.music == 'MusicWhiteLogo') {
          iconFav = require("../../assets/MusicWhiteLogo.png");
        } 
        else if(logos.music == 'MusicPurpleLogo') {
          iconFav = require("../../assets/MusicPurpleLogo.png");
        }
        else{
          iconFav = require("../../assets/MusicWhiteLogo.png");
        } 
      }  
      if(data.type == 'show') {
        if(logos.movie == 'MoviePinkLogo') {
          iconFav = require("../../assets/MoviePinkLogo.png");
        }
        else if(logos.movie == 'MovieGrayLogo') {
          iconFav = require("../../assets/MovieGrayLogo.png");
        } 
        else if(logos.movie == 'MovieWhiteLogo') {
          iconFav = require("../../assets/MovieWhiteLogo.png");
        } 
        else if(logos.movie == 'MoviePurpleLogo') {
          iconFav = require("../../assets/MoviePurpleLogo.png");
        }
        else{
          iconFav = require("../../assets/MovieWhiteLogo.png");
        } 
      }   
      return (
        <View key={index} style={{flexWrap: 'wrap', flexDirection:'row',marginTop:3, width: '50%', backgroundColor:'transparent'}}>
        {data.name !== '' ? 
            <View style={{flexDirection: 'row', marginLeft: index%2 == 0 ? 0 : 12}}>  
              <Image style={{opacity: logos.opacity}}source={iconFav} />
              <View style={{marginLeft:10}}><Text style={{ color: selectedColor, fontSize: 12, fontWeight: '600'}}>{data.name}</Text></View>
            </View>
            :
            <Text></Text>
        }
        </View>
      )
    });
  }

  renderAdults(colorSelected) {
    var adults_array = this.state.adults_array;
    return adults_array.map((data,index) => {
      var relation = '';
      if(data.relation == 0) {
        relation = 'P';
      }
      else if(data.relation == 1) {
        relation = 'G';
      }
      else{
        relation = 'O';
      }
      return (
        <View key={index} style={{flexDirection:'row',justifyContent:'space-between',marginTop:3}}>
                    <Text style={{ color: colorSelected, fontSize: 12, fontWeight: '600'}}>{data.name} ({relation})</Text>
                    <TouchableOpacity onPress={() => this.showActionSheet(data.phone)} onLongPress={ () => this.copyText(data.phone) }>
                      <Text 
                      style={{textDecorationLine: "underline", color: colorSelected, fontSize: 12, fontWeight: '600'}}>{data.phone}
                      </Text>
  
                    </TouchableOpacity>
                    
        </View>
      )
    });
  
    }


  renderCard = () => {
    var lengthData = Object.keys(this.state.card_colors).length;


    const {book, food, game, song, movie, allergy_array, DATA_LIST,dob,allergy,emergency_plan,medications} = this.state;
    if(Object.keys(this.state.card_colors).length !== 0) {
      var all_data = this.state.card_colors;
      var length = Object.keys(all_data).length;
      var separator_data = {};
      Object.keys(all_data).forEach(key => {
        if(key == 'separator:') {
          separator_data = all_data[key];          
        }
        else if(key == 'separator') {
          separator_data = all_data[key];    
        }        
      });
      if(this.state.card_colors.optionId == 5) {
        var nobackground = 'yellow';
        var nolabeltextXolor = '#929292';
      }
      else{
        var nobackground = '#18D10B';
        var nolabeltextXolor = '#fff';
      }
      var primary_color = this.state.card_colors.text.primaryColor;
      var secondary_color = this.state.card_colors.text.secondaryColor;
      var yeslabel_textcolor = this.state.card_colors.yesLabel.text;
      var yeslabel_backcolor = this.state.card_colors.yesLabel.backgroundColor;
      var border_color = separator_data.color;
      var border_opacity = separator_data.opacity;


    
 
    return(
      <View>
      <LinearGradient
                ref={o => (this._shareViewContainer = o)}
                style={{width: '100%', paddingHorizontal: 15, paddingVertical: 10,
                  borderRadius: 8}}
                  start={[0.3, 1]} end={[1, 0]}
                  colors={this.state.backgroundColor_gradient}
                  >
                  <View>
                    <View style={{ flex: 0, paddingVertical: 3 }}>
                      <View style={{flexDirection: 'row'}}>
                        <View style={{flex: this.state.card_image_url !== '' ? 0.8: 1}}>
                         <Text numberOfLines={2} style={{fontSize: 20, color: primary_color, fontWeight: '600'}}>{this.state.name}</Text>
                            {this.state.dob !== '' &&
                                <Text style={{ color: secondary_color, fontSize: 12, fontWeight: '600',marginTop:10 }}>DOB {this.state.dob}</Text>
                            }
                        </View>
                        {this.state.card_image_url !== '' &&
                          <View style={{flex: this.state.card_image_url !== '' ? 0.2: 0,  alignItems: 'flex-end'}}>
                            <Image style={{height: 60, width: 60, borderRadius: 8, borderColor: '#fff', borderWidth: 1.5}} source={{uri: this.state.card_image_url}}></Image>
                          </View>
                        }
                        
                      </View>
                      
                      <View style={{marginTop:10}}>
                      {this.state.adults_array.length!== 0 &&                    
                            this.renderAdults(secondary_color)                    
                      }  
                    </View>                                                     
                      
                                                        
                      <View style={{ flexDirection:'row',marginTop:5, backgroundColor: 'transparent'}}>                       
                      <View style={{flex: 0.43, flexDirection: 'row', backgroundColor:'transparent', justifyContent: 'space-between'}}>
                      <Text style={{color: primary_color, fontSize: 11, fontWeight: 'bold'}}>FOOD ALLERGIES </Text>
                        {allergy_array && allergy_array.length > 0  ? <View style={{backgroundColor:'red',borderRadius:20,height:15,width:25,justifyContent:'center',alignItems:'center',marginBottom:3, marginLeft:5}}><Text style={{ color: yeslabel_textcolor,fontSize: 9,padding:2}}>YES</Text></View> : <View style={{backgroundColor:nobackground,borderRadius:20,height:15,width:25,justifyContent:'center',alignItems:'center',marginBottom:3, marginLeft: 15}}><Text style={{ color:  nolabeltextXolor,fontSize: 9,padding:2}}>NO</Text></View>}
                      </View>
                      
                      
                      {(this.state.medications !== '' || this.state.benadryl !== '' || this.state.epinephrine !== '') ?
                        <View style={{flexDirection:'row', flex: 0.57}}> 
                        <Text style={{ color: primary_color, fontSize: 11, fontWeight: 'bold', marginRight: 5, marginLeft: 5}}> / </Text>
                        <Text style={{ color: primary_color, fontSize: 11, fontWeight: 'bold'}}>CARRIES MEDICATION </Text>
                          <View style={{backgroundColor:'red',borderRadius:20,height:15,width:25,justifyContent:'center',alignItems:'center',marginLeft: 3}}><Text style={{ color: yeslabel_textcolor,fontSize: 9,padding:2}}>YES</Text></View>
                        </View>
                        :
                        <View></View>
                      }
                      </View>
                      <View style={{opacity: border_opacity, width: '100%', flexDirection:'row',borderBottomColor:border_color,borderBottomWidth:1}}></View>
                      
                      


                      
                      <View style={{backgroundColor: 'transparent', maxHeight: 90}}>
                      <ScrollView>

                      
                      {allergy_array && allergy_array.length > 0  ?
                        <Text style={{ color: secondary_color, fontSize: 12, fontWeight: '600',marginTop:5, fontWeight: 'bold' }}>ALLERGIES: 
                        {this.state.allergies_string !== '' &&
                          <Text style={{color: secondary_color, fontSize: 12, fontWeight: '600'}}> {this.state.allergies_string}</Text>
                        }
                        {((allergy_array && allergy_array.length > 0) && this.state.allergy) &&
                          <Text style={{color: secondary_color, fontSize: 12, fontWeight: '600'}}>,</Text>
                        }                    
                        {this.state.allergy}                    
                        </Text>
                        :
                        <View></View>
                      }
    
                      {(this.state.medications !== '' || this.state.benadryl !== '' || this.state.epinephrine !== '') ? 
                      <View>
                      <View style={{flexDirection: 'row', backgroundColor: 'transparent', width: '90%'}}>
                        <View>
                        <Text style={{ color: secondary_color, fontSize: 12, fontWeight: '600', marginRight: 5, fontWeight: 'bold'}}>MEDS:</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          {(this.state.benadryl == '' && this.state.epinephrine == '') &&
                            <View>
                              {this.state.medications !== '' &&
                                  <View style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                                  <Text style={{ flexWrap: 'wrap', color: secondary_color, fontSize: 12, fontWeight: '600', marginLeft: 2}}>{this.state.medications}</Text>
                                  </View>
                                } 
                            </View>
                          }
                            {this.state.benadryl !== '' &&
                            <Text style={{ color: secondary_color, fontSize: 12, fontWeight: '600', marginLeft: 2}}>Bendryl ({this.state.benadryl}ml)</Text>
                            }
                            {(this.state.benadryl !== '' && this.state.epinephrine !== '') &&
                            <Text style={{ color: secondary_color, fontSize: 12, fontWeight: '600', marginLeft: 2}}>,</Text>
                            }
                            {this.state.epinephrine !== '' &&
                            <Text style={{ color: secondary_color, fontSize: 12, fontWeight: '600', marginLeft: 2}}>{this.state.epinephrine}</Text>
                            }
                                                                        
                        </View>
                       
                      </View> 
                       {(this.state.medications !== '' && (this.state.benadryl !== '' || this.state.epinephrine !== '')) &&
                       <View style={{flexDirection: 'row'}}>
                         <Text style={{ flexShrink: 1, color: secondary_color, fontSize: 12, fontWeight: '600', marginLeft: 2}}>{this.state.medications}</Text>
                       </View>                   
                       } 
                       </View>                                                                        
                        :
                        <View></View>
                      }
                      {
                      emergency_plan == ''
                      ?
                   
                      :
                      <Text style={{ color: secondary_color, fontSize: 12, fontWeight: 'bold' }}>EMERGENCY ACTION PLAN: 
                      <Text style={{ color: secondary_color, fontSize: 12, fontWeight: '600' }}> {this.state.emergency_plan}</Text></Text>
                      }
                      </ScrollView>
                      </View>
                      
                   
                     
                      {(this.state.health !== '' || this.state.medicine !== '' || this.state.other !== '') &&
                        <View>                          
                          <View style={{flex: 0, flexDirection:'row',marginTop:5, backgroundColor:'transparent'}}>
                          {(this.state.health !== '' || this.state.other !== '') ?
                              <View style={{flexDirection: 'row', flex: 0.43, justifyContent: 'space-between'}}>
                                <Text style={{ color: primary_color, fontSize: 12, fontWeight: 'bold'}}>ALERTS</Text>
                                <View style={{marginLeft: 15, backgroundColor:'red',borderRadius:20,height:15,width:25,justifyContent:'center',alignItems:'center',marginBottom:3}}><Text style={{ color: 'white',fontSize: 9,padding:2}}>YES</Text></View>
                              </View>
                              :
                              <Text></Text>                        
                          }
    
                          {this.state.medicine !== '' ?
                          <View style={{flexDirection: 'row', flex: 0.57}}>
                          <Text style={{ color: primary_color, fontSize: 11, fontWeight: 'bold', marginRight: 5, marginLeft: 5}}> / </Text>  
                          <Text style={{ color: primary_color, fontSize: 11, fontWeight: 'bold'}}>CARRIES MEDICATION </Text>
                          <View style={{backgroundColor:'red',borderRadius:20,height:15,width:25,justifyContent:'center',alignItems:'center',marginLeft: 3}}><Text style={{ color: 'white',fontSize: 9,padding:2}}>YES</Text></View>
                          </View>
                          :
                          <Text></Text>
                          }                 
                          </View>
                          <View style={{opacity: border_opacity, width: '100%', flexDirection:'row',borderBottomColor:border_color,borderBottomWidth:1}}></View>
                          </View>
                      }
                      
                      <View style={{backgroundColor: 'transparent', maxHeight: 65}}>
                      <ScrollView>
                      {(this.state.health !== '' || this.state.medicine !== '' || this.state.other !== '') &&
    
                      <View style={{marginTop:5, backgroundColor: 'transparent'}}>
                        {this.state.health !== '' &&                        
                          <Text style={{ color: secondary_color, fontSize: 12, fontWeight: 'bold' }}>HEALTH: 
                          <Text style={{ color: secondary_color, fontSize: 12, fontWeight: '600'}}> {this.state.health}</Text></Text>
                        }  
                        
                        {this.state.medicine !== '' &&                        
                          <Text style={{ color: secondary_color, fontSize: 12, fontWeight: 'bold'}}>MEDS: 
                          <Text style={{ color: secondary_color, fontSize: 12, fontWeight: '600'}}> {this.state.medicine}</Text></Text>                       
                        }
    
                        {this.state.other !== '' &&                         
                          <Text style={{ color: secondary_color, fontSize: 12, fontWeight: 'bold'}}>OTHER: 
                          <Text style={{ color: secondary_color, fontSize: 12, fontWeight: '600'}}>{this.state.other}</Text></Text>                          
                        }
                      </View>
    
                      }
					  </ScrollView>
					  </View>
                      
                      {(book !== '' || food !== '' || game !=='' || song !== '' || movie !=='') &&
                      <View>
                        <View>
                          <Text style={{ color: primary_color, fontSize: 12, fontWeight: 'bold',textAlign:'center', marginBottom: 1 }}>THE +</Text> 
                        </View>    
                        <View style={{opacity: border_opacity, width: '100%', flexDirection:'row',borderBottomColor:border_color,borderBottomWidth:1}}></View>                
                        <View style={{ flexWrap: 'wrap', marginTop:5, flexDirection: 'row', width: '100%', backgroundColor: 'transparent'}}>
                          {
                            this.renderFav(secondary_color)                   
                          }
                        </View>
                      </View> 
                      }
                      
                      <View style={{marginTop: 10, paddingVertical: 0, justifyContent: 'center', alignItems: 'flex-end'}}>
                        {this.state.card_colors.logos.branding == 'EmCardColoredLogo' &&
                          <Image source={require("../../assets/EmCard-Logo.png")}></Image>
                        }
                        {this.state.card_colors.logos.branding == 'EmCardGrayLogo' &&
                          <Image source={require("../../assets/EmCardGrayLogo.png")}></Image>
                        }
                         {this.state.card_colors.logos.branding == 'EmCardWhiteLogo' &&
                          <Image style={{width: 90, height:25}} source={require("../../assets/whiteLogo.png")}></Image>
                        }                      
                    </View>
                    </View>
                    
                  </View>
                  </LinearGradient>
                    
                  </View>
    )
                      }
                      else {
                        
                          var yeslabel_textcolor = '#fff';
                          var yeslabel_backcolor = 'red';
                          var primary_color = '#fff';      
                          var secondary_color = '#fff';
                          var border_color = '#fff';
                          var border_opacity = 1;
                        return(
                          <View></View>
                        )
                      }
  }


render() {
   
    const { navigation } = this.props;
    var optionArray = [
      'Message',
      'Cancel',
    ];
    var optionArray1 = [
      'Email',
      'Message',
      'Cancel',
    ];
    var optionArray2 = [
      'Email',
      'Cancel',
    ];

    return (
      <Container>

        <View style={{ flex: 1, backgroundColor: '#fff' }}>

          <Header style={{ backgroundColor: '#E94369' }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <TouchableOpacity style={{ flex: 0.33, justifyContent: 'center' }} onPress={() => this.props.navigation.navigate('Home', {path: 'ShareCard'})}>
                <View>
                  <Image source={back_arrow} style={{ marginTop: 10, marginLeft: 15 }}></Image>
                </View>
              </TouchableOpacity>

              <View style={{ flex: 0.33, justifyContent: 'flex-end', alignItems: 'center' }}>
                <Image source={em_card_white} style={{marginBottom: 8}}></Image>
              </View>
              <View style={{ flex: 0.33, alignItems: 'flex-end', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Home', {path: 'ShareCard'})}>
                  <View>
                  <Image source={ColorBox} style={{ height: 30, width: 30, marginTop: 6, marginRight: 2 }}></Image>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Header>

          <View style={{flex: 1}}>
            {this.state.modal_visible &&
                <View style={{
                  left: 0,
                  right: 0,
                  position: 'absolute',
                  zIndex: 1,
                  bottom: 0,
                  top: 0, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center'
                }}>
              </View>
            }
          
          {this.state.isLoading &&
              <Loader
                LoaderText={this.state.popUpText}
                errorIcon={this.state.errorIcon}
                successIcon={this.state.successIcon}
              />
            }

             <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modal_visible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
              <View style={{flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 80}}>
                <View style={{ margin: 20,
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 0,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5}}>


                  {this.renderCard()}
                </View>
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 5}}>
                      <Text>Capturing...</Text>
                    </View>
            </Modal>


       
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
         
            <View style={{
              marginTop: 25,
              paddingBottom: 0,
              paddingHorizontal: 25,
              alignSelf: 'stretch',
              justifyContent: 'flex-start',
              alignItems: 'center',
              backgroundColor: 'transparent',
              shadowColor: "#F5F6F8",
              shadowOpacity: 0.3,
              shadowRadius: 2,
              shadowOffset: {
                height: 1,
                width: 1
              }
            }}>
              <Text style={{ color: '#33A6FF', fontSize: 24, fontWeight: '600' }}>Share</Text>
              <Text style={{ marginBottom: 15, color: '#BABFC9', fontSize: 15, textAlign: 'center' }}>Share your EmCard+ with those who need to know</Text>
           </View>
          </View>

          {/* card View start */}
            {this.state.DATA_LIST.length !== 0 &&

                <View style={{
                  borderRadius: 5,
                        backgroundColor: '#fff',
                        marginTop: 15,
                        shadowColor: '#000000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.3,
                       shadowRadius: 2,
                       elevation:3,
                  marginHorizontal: 20, marginBottom: 15,  paddingVertical: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <View style={{ flex: 0.02,  height: 35, overflow: 'hidden', borderTopRightRadius: 3, borderBottomRightRadius: 3}}>
                  <LinearGradient                
                    start={[0.3, 1]} end={[1, 0]}
                    style={{flex: 1}}
                    colors={this.gradient}
                  >
                  </LinearGradient>
                  </View>
                  <View style={{ flex: 0.01 }}>

                  </View>
                  <View style={{ flex: 0.13, backgroundColor:'transparent', justifyContent:'center'}}>
                    
                    <View style={{
                      paddingHorizontal: 0, paddingVertical: 0,
                      borderRadius: 4,
                      marginVertical: 4,
                      marginLeft: 4,
                      backgroundColor: '#fff',
                      shadowColor: '#000000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.4,
                      shadowRadius: 2,
                    }}>
                      {this.state.card_image == '' &&
                          <Image source={emcard_logo} style={{borderRadius: 4,  width: '100%', height: 35, marginTop: 0, marginLeft: 0 }}></Image>
                      }
                      {this.state.card_image !== '' &&
                          <Image source={{uri: this.state.card_image}} style={{ borderRadius: 4, width: '100%', height: 35, marginTop: 0, marginLeft: 0 }}></Image>
                      }
                      
                    </View>
                  </View>
                  <View style={{ flex: 0.03 }}>

                  </View>
                  <View style={{ flex: 0.81, marginVertical: 4 }}>
                    <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{this.state.cardName}</Text>
                      <Text style={{ color: '#8E8E93', fontSize: 9, marginTop: 5 }}>created on {this.state.card_date}</Text>       
                  </View>
                </View>
                
            }
                 {/* card View end */}
                 
                 {this.state.DATA_LIST.length !== 0 &&
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View style={{  width: '80%', marginBottom: 10, justifyContent: 'center', backgroundColor: '#2B92FE', marginTop: 0, borderRadius: 30 }}>
          <TouchableOpacity onPress={() => this._sendShareImage()}>
                    <View style={{width: '100%', paddingHorizontal: 30, alignSelf: 'stretch', paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={{  textAlign: 'center', color: '#fff', fontSize: 17, fontWeight: '600' }}>Share Card Image</Text>
                    </View>
          </TouchableOpacity>
          </View></View>
          }

          <View style={{  backgroundColor: 'transparent', paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
        
            
              <View style={{
              width: '100%', alignSelf: 'stretch', paddingHorizontal: 15, paddingVertical: 10,
              borderRadius: 2,
              backgroundColor: '#fff',
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 3,
            }}>

              <View style={{
                flexDirection: 'row',
                backgroundColor: 'transparent',

              }}>
                <View style={{ flex: 0.10, justifyContent: 'center', alignItems: 'flex-start', backgroundColor: 'transparent' }}>
                  <Image source={search_icon}></Image>
                </View>

                <View style={{ flex: 0.90,justifyContent:'center',height:30 }}>
                  <TextInput
                    placeholder='Enter Contact / Phone Number / Email'
                    onChangeText={(text) => {this.searchData(text)}}
                    value={this.state.text}
                    style={{ fontSize: 16 }}
                  />
                </View>
              </View>
            </View>

          </View>

  
            <FlatList
            style={{marginTop:10, marginLeft: 10, marginRight: 10, marginBottom:3}}
            data={this.state.contacts}

            renderItem={({ item, index }) => {
              var name = item.name;
          
                if(item.email.length > 0){
                  return(
                    <View style={{flex:1,alignSelf: 'stretch', alignItems: 'flex-start', justifyContent: 'flex-start', paddingHorizontal: 20}}>
                        <View style={{ width: '100%', alignSelf: 'stretch', paddingHorizontal: 15, paddingVertical: 15,
                                    borderRadius: 7,
                                    backgroundColor: '#fff',
                                    marginTop: 15,
                                    shadowColor: '#000000',
                                    shadowOffset: { width: 0, height: 3 },
                                    shadowOpacity: 0.3,
                                   shadowRadius: 2,
                                   elevation:3}}>
                       <View style={{flexDirection:'row',  backgroundColor: 'transparent',justifyContent:'space-between'}}>
                       <View style={{flex: 0.7}}>
                          <Text 
                          style={{fontWeight: 'bold', fontSize: 14}}>{name}</Text>
                          {item.appUser == true && 
                              <Text style={{ color: '#BABFC9', fontSize: 10, marginTop: 8 }}>is using the app</Text>  
                          }
            
                          {item.appUser == false && 
                              <Text style={{ color: '#BABFC9', fontSize: 10, marginTop: 8 }}>is not using the app</Text>  
                          }
                          
                       </View>
                       <View style={{flex: 0.3}}>
                       {item.appUser == true && 
                        <TouchableOpacity onPress={() => {this.updateAppUser(item.appUserId)}}>
                        <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 10, paddingVertical: 9, backgroundColor: '#DCEDC8', justifyContent: 'center', alignItems: 'center', borderRadius: 6 }}>
                           <Text style={{ fontSize: 11, color: '#4CAF50', fontWeight: '600', paddingRight: 10 }}>share</Text>
                           <Image source={arrow_green}></Image>
                        </View>
                       </TouchableOpacity>
                        }
            
                      {item.appUser == false && 
                        <TouchableOpacity onPress={() => {this.updateUserdetail(item.mobile[0], item.email[0], 'newUser', name)}}>
                        <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 10, paddingVertical: 6, backgroundColor: '#99ccff', justifyContent: 'center', alignItems: 'center', borderRadius: 6 }}>
                           <Text style={{ fontSize: 11, color: '#2590FE', fontWeight: '600', paddingRight: 10 }}>share</Text>
                           <Image source={arrow_blue}></Image>
                        </View>
                       </TouchableOpacity>
                        }
                          
                               
                      </View>
                      </View>
                      </View>
                  </View>
                  );
                }else{
                return(
                    <View style={{flex:1,alignSelf: 'stretch', alignItems: 'flex-start', justifyContent: 'flex-start', paddingHorizontal: 20}}>
                        <View style={{ width: '100%', alignSelf: 'stretch', paddingHorizontal: 15, paddingVertical: 15,
                                    borderRadius: 7,
                                    backgroundColor: '#fff',
                                    marginTop: 15,
                                    shadowColor: '#000000',
                                    shadowOffset: { width: 0, height: 3 },
                                    shadowOpacity: 0.3,
                                   shadowRadius: 2,
                                   elevation:3}}>
                       <View style={{flexDirection:'row',  backgroundColor: 'transparent',justifyContent:'space-between'}}>
                       <View style={{flex: 0.7}}>
                          <Text 
                          style={{fontWeight: 'bold', fontSize: 14}}>{name}</Text>
                          {item.appUser == true && 
                              <Text style={{ color: '#BABFC9', fontSize: 10, marginTop: 8 }}>is using the app</Text>  
                          }
            
                          {item.appUser == false && 
                              <Text style={{ color: '#BABFC9', fontSize: 10, marginTop: 8 }}>is not using the app</Text>  
                          }
                       </View>
                       <View style={{flex: 0.3}}>
                       {item.appUser == true && 
                       <TouchableOpacity onPress={() => {this.updateAppUser(item.appUserId)}}>
                         <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 10, paddingVertical: 9, backgroundColor: '#DCEDC8', justifyContent: 'center', alignItems: 'center', borderRadius: 6 }}>
                            <Text style={{ fontSize: 11, color: '#4CAF50', fontWeight: '600', paddingRight: 10 }}>share</Text>
                            <Image source={arrow_green}></Image>
                         </View>
                        </TouchableOpacity>
                        }
            
                      {item.appUser == false && 
                       <TouchableOpacity onPress={() => {this.updateUserdetail(item.mobile[0], 'NULL', 'newUser', name)}}>
                         <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 10, paddingVertical: 6, backgroundColor: '#99ccff', justifyContent: 'center', alignItems: 'center', borderRadius: 6 }}>
                            <Text style={{ fontSize: 11, color: '#2590FE', fontWeight: '600', paddingRight: 10 }}>share</Text>
                            <Image source={arrow_blue}></Image>
                         </View>
                        </TouchableOpacity>
                        }
            
                      </View>
                      </View>
                      </View>
                  </View>
                  );
                  }
            }
            }
            keyExtractor={item => item.id}
            ListEmptyComponent={() => (<Text style={{textAlign:'center',justifyContent:"center",marginTop:"15%"}}>No Contacts Found</Text>)}/>

       </View>
       </View>
        {(this.state.email == 'NULL' && this.state.phoneNumber !== undefined) && 
              <ActionSheet
              title={'EmCard+'}
              message={'Please select a share method'}
              ref={o => (this.ActionSheet = o)}
              options={optionArray}
              cancelButtonIndex={1}
              onPress={index => {
              if (index == 0) {
                this._sentSms();
              } 
              else if (index == 1) {
              }
            }}
          />
        }

        {(this.state.email !== 'NULL' && this.state.phoneNumber !== undefined) &&
            <ActionSheet
            title={'EmCard+'}
            message={'Please select a share method'}
            ref={o => (this.ActionSheet = o)}
            options={optionArray1}
            cancelButtonIndex={2}
            onPress={index => {
            if (index == 0) {
              this._sendMail('mail')
            } 
            else if (index == 1) {
              this._sentSms();
            }
            else if (index == 2){
              }
          }}
        />
        }

      {(this.state.email !== 'NULL' && this.state.phoneNumber == undefined) &&
            <ActionSheet
            title={'EmCard+'}
            message={'Please select a share method'}
            ref={o => (this.ActionSheet = o)}
            options={optionArray2}
            cancelButtonIndex={1}
            onPress={index => {
            if (index == 0) {
              this._sendMail('mail')
            } 
            else if (index == 1){
              }
          }}
        />
        }
          
        
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  }
})



