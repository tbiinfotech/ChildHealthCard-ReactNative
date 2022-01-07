import React from 'react'
import { Dimensions, Platform,  StyleSheet, Keyboard, View, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Item, Input } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import constants from '../constants/constants';
import * as firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import ActionSheet from 'react-native-actionsheet';
import * as Analytics from 'expo-firebase-analytics';
import * as Permissions from 'expo-permissions';
import { LinearGradient } from 'expo-linear-gradient';
import Loader from './Loader/loader';
import FormData from 'form-data';
import * as ImageManipulator from 'expo-image-manipulator';

const em_card_white = require("../../assets/whiteLogo.png");
const back_arrow = require("../../assets/BackIcon.png");
const tick = require("../../assets/GreenTickIcon.png");

const user_profile = require("../../assets/UserSqIcon.png");
const camera_pic = require("../../assets/CameraBlueIcon.png");
const ColorBox = require("../../assets/cardBoxIcon.png");
const right_arrow = require("../../assets/RightArrowIcon.png");
const initialLayout = Dimensions.get('window').width;


export default class GenerateCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nameonCard: '',
      token: "",     
      card_object: {},
      prev_path: this.props.navigation.state.params.path,
      fnameonCardTextLengthfocus: false,
      network_error: false,
      gradient1: true,
      gradient2: false,
      gradient3: false,
      gradient4: false,
      gradient5: false,
      gradient6: false,
      gradient7: false,
      gradient8: false,
      gradientcolor1: [],
      gradientcolor2: [],
      gradientcolor3: [],
      gradientcolor4: [],
      gradientcolor5: [],
      gradientcolor6: [],
      gradientcolor7: [],
      gradientcolor8: [],
      imageUrl: null,
	  imageLink: '',
      card_id: '',
      crd_id: '',
      optionId: 1,
      isLoading: false,
	  image_update: false,
      popUpText: "",
      type: 'create',
      errorIcon: false,
      successIcon: false
    };

  }

    async componentWillMount() {
      var card_status  = await AsyncStorage.getItem('card_status');
      if(card_status == 'edit_card') {
        this.setState({type: 'update'});
        this.updateCardInfo();      
      }
    }

    updateCardInfo = async() => {
      var card_details = await AsyncStorage.getItem('card_info');
      var parse_details = JSON.parse(card_details);
      var allData = parse_details.details;
      if(allData.card_id !== '') {
        this.setState({crd_id: allData.card_id});
      }
      if(allData.color_id !=='') {
        var color_id = JSON.parse(allData.color_id);
        this.setState({optionId: color_id});
        if(color_id == 1) {
          this.setState({gradient1: true});
        }
        else if(color_id == 2) {
          this.setState({gradient1: false});
          this.setState({gradient2: true});
        }
        else if(color_id == 3) {
          this.setState({gradient1: false});
          this.setState({gradient3: true});
        }
        else if(color_id == 4) {
          this.setState({gradient1: false});
          this.setState({gradient4: true});
        }
        else if(color_id == 5) {
          this.setState({gradient1: false});
          this.setState({gradient5: true});
        }
        else if(color_id == 6) {
          this.setState({gradient1: false});
          this.setState({gradient6: true});
        }
        else if(color_id == 7) {
          this.setState({gradient1: false});
          this.setState({gradient7: true});
        }
        else if(color_id == 8) {
          this.setState({gradient1: false});
          this.setState({gradient8: true});
        }  
      }
      this.setState({ imageUrl:allData.card_image});
	    this.setState({ imageLink:allData.card_image});
      console.log('details', allData);
  }


  async componentDidMount() {
    console.log('previous path ', this.state.prev_path);
    this.getColorCodes();

    var formData = await AsyncStorage.getItem('ProfileBuilder');
    var formParseData = JSON.parse(formData);
    console.log('FormParseData', formParseData);
    this.setState({card_object: formParseData});

    if(formParseData.cardData.details == undefined) {
      this.setState({nameonCard: formParseData.cardData.contactDetails.childName});
      
    }
    else{
      this.setState({nameonCard: formParseData.cardData.details.card_name});
    }
    
    

    let userDetails = await AsyncStorage.getItem('userData');
    let user = JSON.parse(userDetails);
    this.setState({ token: user.stsTokenManager.accessToken})
  }

  getColorCodes = async() => {
    var color_data = await AsyncStorage.getItem('colorCodes');
    var parse_data = JSON.parse(color_data);

    var code_array1 = parse_data.data.cardColorSchemes[0].background.colors;
    var code_array2 = parse_data.data.cardColorSchemes[1].background.colors;
    var code_array3 = parse_data.data.cardColorSchemes[2].background.colors;
    var code_array4 = parse_data.data.cardColorSchemes[3].background.colors;
    var code_array5 = parse_data.data.cardColorSchemes[4].background.colors;
    var code_array6 = parse_data.data.cardColorSchemes[5].background.colors;
    var code_array7 = parse_data.data.cardColorSchemes[6].background.colors;
    var code_array8 = parse_data.data.cardColorSchemes[7].background.colors;

    this.setState({gradientcolor1: code_array1, gradientcolor2: code_array2, gradientcolor3: code_array3, 
      gradientcolor4: code_array4, gradientcolor5: code_array5, gradientcolor6: code_array6,
      gradientcolor7: code_array7, gradientcolor8: code_array8});

    console.log('parse_data', parse_data);
  }


  showActionSheet = () => {
    Keyboard.dismiss();
    var that = this;
    setTimeout(() => {
      this.ActionSheet.show();
    }, 500);

  };

  ///Selet image from Camera
  _takePhoto = async () => {
    const {
      status: cameraPerm
    } = await Permissions.askAsync(Permissions.CAMERA);

    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera AND camera roll
    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0
      });

      let filename = pickerResult.uri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let fileType = match ? `image/${match[1]}` : `image`;
	  
	  
	  const resizedPhoto = await ImageManipulator.manipulateAsync(
		 pickerResult.uri,
		 [{ resize: { width: 300 } }], // resize to width of 300 and preserve aspect ratio 
		 { compress: 0.5, format: 'jpeg' },
	  );

      if (!pickerResult.cancelled) {
        this.setState({ imageUrl: resizedPhoto.uri, imagetype: fileType, name: filename });
		this.setState({image_update: true});
      }      
    }
  };


  ///Selet image from Gallery
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0
    });
    console.log(result);
    let filename = result.uri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let fileType = match ? `image/${match[1]}` : `image`;
	
	 const resizedPhoto = await ImageManipulator.manipulateAsync(
		 result.uri,
		 [{ resize: { width: 300 } }], // resize to width of 300 and preserve aspect ratio 
		 { compress: 0.5, format: 'jpeg' },
	  );

    if (!result.cancelled) {
      this.setState({ imageUrl: resizedPhoto.uri, imagetype: fileType, name: filename });
	  this.setState({image_update: true});
    }
  }

  // Upload image function
  uploadImage(cardId, type) {
    
  
    this.setState({ successIcon: false });
    this.setState({ popUpText: 'Uploading Card Image...' });
    this.setState({ isLoading: true });
    this.setState({ errorIcon: false });

    var that = this;
    var image_urll = this.state.imageUrl;
    var image_type = this.state.imagetype;
    var image_name = this.state.name;
    var that = this;
    const token = this.state.token;

    var imageData =  {
      uri: Platform.OS === 'android' ? image_urll : image_urll.replace('file://', ''),
      name:image_name,
      type:image_type
    };

    console.log('imageDatata', imageData);

    var axios = require('axios'); 

    var formdata = new FormData();
    formdata.append('card_id', cardId);
    formdata.append('card_image', imageData);
    console.log('formData', formdata);
    var config = {
      method: 'post',
      url: constants.URL.activeURL +'/cards/upload_card_image',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'   
      },
      data: formdata
    };

    axios(config)
    .then(async function (response) {
      
      if(response.data.success) {
        that.setState({ popUpText: '' });
        that.setState({ isLoading: false });
        if(type == 'create') {
          that.props.navigation.navigate('Congratulations', {cardId: cardId}); 
        }
        else{
          that.props.navigation.navigate('ViewCard', {cardId: cardId, cardType: 'created'}); 
        }
                      
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
          that.setState({token: idToken});
          that.uploadImage(cardId, type);
          }).catch(function(error) {
            that.setState({ isLoading: false });          
            console.log('idTokenError', error);
           });
          } else {
            console.log('Not authenticated');
          }
        }); 
        
       }
       else{
        console.log('false', response.data.message);
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
        var errorMessage = error.response.data.message;  
        that.setState({ errorIcon: true });    
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
                console.log('ok Pressed');
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

  createCard = async() => {
    
    var cardObject = this.state.card_object;
    var colorId = '"'+this.state.optionId+'"';
    cardObject["cardData"]["details"] = {
      "card_name": this.state.nameonCard,
      "card_id": this.state.crd_id,            
      "color_id": JSON.parse(colorId),
      "card_image": this.state.imageLink,
      "created_date": ""
    };

    if(this.state.type == 'create') {
      this.callCreateApi(cardObject);
    }
    else{
      this.callUpdateApi(cardObject);
    }
    
  }

  callCreateApi = (crdData) => {
    this.setState({ popUpText: 'Creating Card...' });
    this.setState({ isLoading: true });
    this.setState({ errorIcon: false });
    this.setState({ successIcon: false });

    var that = this;
    const token = this.state.token;
    var axios = require('axios'); 
    var Carddata = JSON.stringify(crdData);

    var config = {
      method: 'put',
      url: constants.URL.activeURL +'/cards/create_card',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: Carddata
    };
    axios(config)
    .then(async function (response) {
      if(response.data.success) {
        that.setState({ isLoading: false })
        console.log('Response', response.data);  
        
        that.setState({ errorIcon: false });
        that.setState({ successIcon: true });         
          var errorMessage = response.data.message;   
          that.setState({ popUpText: errorMessage });     
          setTimeout(function () { that.setState({ isLoading: true })  }, 100)
          setTimeout(async function () { 
            var colorId = '"'+that.state.optionId+'"';
            that.setState({ isLoading: false });  
            await Analytics.logEvent('emcardCreated');
            await Analytics.logEvent('emcardStyleSelected', {
              "styleID": JSON.parse(colorId)
            });

            var firstEmcard = await AsyncStorage.getItem('firstEmCardCreated');

            if(firstEmcard == null) {
                  await Analytics.logEvent('firstEmCardCreated');
                  await AsyncStorage.setItem('firstEmCardCreated',JSON.stringify(true));
            }
 
            if(that.state.imageUrl !== null && that.state.imageUrl !== '' && that.state.image_update == true) {
              that.uploadImage(response.data.data.card_id, 'create');
            }
            else{
              that.props.navigation.navigate('Congratulations', {cardId: response.data.data.card_id}); 
            }

             
          }, 3000)               
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
          that.setState({token: idToken});
          that.callCreateApi(crdData);
          }).catch(function(error) {
            that.setState({ isLoading: false });          
            console.log('idTokenError', error);
           });
          } else {
            console.log('Not authenticated');
          }
        }); 
        
       }
       else{
        console.log('false', response.data.message);
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
        var errorMessage = error.response.data.message;  
        that.setState({ errorIcon: true });    
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
                console.log('ok Pressed');
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

  callUpdateApi = (crdData) => {
    this.setState({ popUpText: 'Updating Card...' });
    this.setState({ isLoading: true });
    this.setState({ errorIcon: false });
    this.setState({ successIcon: false });

    var that = this;
    const token = this.state.token;
    var axios = require('axios'); 
    var Carddata = JSON.stringify(crdData);

    var config = {
      method: 'put',
      url: constants.URL.activeURL +'/cards/create_card',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: Carddata
    };
    axios(config)
    .then(async function (response) {
      if(response.data.success) {
        that.setState({ isLoading: false })
        console.log('Response', response.data);  
        
        that.setState({ errorIcon: false });
        that.setState({ successIcon: true });         
          var errorMessage = 'Card updated successfully...';   
          that.setState({ popUpText: errorMessage });     
          setTimeout(function () { that.setState({ isLoading: true })  }, 100)
          setTimeout(async function () { 
            that.setState({ isLoading: false }); 
            await Analytics.logEvent('emcardUpdated');  
            if(that.state.imageUrl !== null && that.state.imageUrl !== '' && that.state.image_update == true) {
              that.uploadImage(response.data.data.card_id, 'update');
            }
            else{
              that.props.navigation.navigate('ViewCard', {cardId: response.data.data.card_id, cardType: 'created'}); 
            }                             
          }, 3000)               
      }
      else{
        if(response.data.statusCode == 403) {        
          firebase.auth().currentUser.getIdToken(true)
         .then(async function(idToken) {
           var userData = await AsyncStorage.getItem('userData');
           var userParseData = JSON.parse(userData);
           userParseData.stsTokenManager.accessToken = idToken;
           await AsyncStorage.setItem('userData', JSON.stringify(userParseData));
           that.setState({token: idToken});
           that.callUpdateApi(crdData);           
         }).catch(function(error) {
          that.setState({ isLoading: false });
           console.log('idTokenError', error);
         });                   
       }
       else{
          console.log('false', response.data.message);
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
      if(error.toJSON().message === 'Network Error'){        
        that.setState({network_error: true});
        Alert.alert(
          'EmCard+',
          'An SSL error has occured and a secure connection to the server cannot be made.',
          [
            {
              text: 'Ok', onPress: async () => {
                console.log('Ok Pressed');
              }
            }
          ],
          { cancelable: false }
        );      
      }
      else{
        that.setState({ errorIcon: true });
        var errorMessage = error.response.data.message;   
        that.setState({ popUpText: errorMessage });   
        setTimeout(function () { that.setState({ isLoading: true })  }, 100)
        setTimeout(function () { that.setState({ isLoading: false })  }, 3000)   
      }
    });

  }


  render() {
    var optionArray = [
      'Take photo',
      'Camera roll',
      'Photo library',
      'Remove Image',
      'Cancel',
    ];
    let { imageUrl } = this.state;
    const { navigation } = this.props;
    return (
      <Container>

        
			<Header style={{ backgroundColor: '#E94369', width: '100%'}}>
                <Left style={{flex:1, backgroundColor: 'transparent'}}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate(this.state.prev_path, { 'route': 'GenerateCard' })} style={{ backgroundColor: 'transparent' ,flex: 0.10, justifyContent: 'center' }}>
                  <View>
                    <Image source={back_arrow} style={{ marginTop: 10, marginLeft: 10, height: 22, width: 28 }}></Image>
                  </View>
                </TouchableOpacity>
                </Left>
                <Body style={{flex:1}}>
                <Image source={em_card_white} style={{marginBottom: 0}}></Image>
                </Body>
                <Right style={{flex:1, backgroundColor: 'transparent'}}>
				<TouchableOpacity onPress={() => this.props.navigation.navigate('Home', {path: 'GenerateCard'})}>
					<Image source={ColorBox} style={{ height: 30, width: 30, marginTop: 6, marginRight: 4 }}></Image>
				</TouchableOpacity>
                </Right>
        </Header>
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
          {this.state.isLoading &&
              <Loader
                LoaderText={this.state.popUpText}
                errorIcon={this.state.errorIcon}
                successIcon={this.state.successIcon}
              />
          }
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
              <Text style={{ color: '#33A6FF', fontSize: 28, fontWeight: '600' }}>Generate</Text>
              <Text style={{ marginTop: 4, color: '#BABFC9', fontSize: 16, textAlign: 'center' }}>Add the final details to your EmCard+</Text>
            </View>

          </View>

          <View style={{ flex: 0.03, backgroundColor: 'transparent' }}>
          </View>

          <View style={{ flex: 0.84, alignSelf: 'stretch', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#fff' }}>

            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 0, marginHorizontal: 20, width: initialLayout - 40 }}>
              <View style={{
                backgroundColor: '#fff',
                marginVertical: 15,
                borderRadius: 15,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}>
                {/* First Fields View */}
                <View style={{ borderBottomColor: '#E4E4E4', borderBottomWidth: 0.5, backgroundColor: '#fff', marginTop: 20, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                  <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                    <Text style={{ color: '#9E9E9E', fontWeight: '600', fontSize: 16 }}>Name your card:<Text style={{ color: 'red', fontSize: 16 }}>*</Text></Text>
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>

                      <View style={{ marginTop: 0 }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent' }}>
                          <TextInput
                            value={this.state.nameonCard}
                            onChangeText={text => {
                              this.setState({ nameonCard: text });
                            }}
                            onBlur={() => this.setState({ fnameonCardTextLengthfocus: false })}
                            onFocus={() => this.setState({ fnameonCardTextLengthfocus: true })}
                            maxLength={50}
                            style={{ width: '100%', fontSize: 18, fontWeight: '600', marginHorizontal: 0, backgroundColor: 'transparent' }} />

                        </View>
                        {(!this.state.fnameonCardTextLengthfocus && this.state.nameonCard.length == 0) &&
                          <View style={{ height: 2, backgroundColor: '#E4E4E4', width: 110 }}>
                          </View>
                        }
                      </View>


                    </View>
                  </View>

                </View>


                {/* Photo View */}
                <View style={{ marginBottom: 10, backgroundColor: '#fff', marginTop: 10, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                  <View style={{ marginHorizontal: 20, marginBottom: 0, justifyContent: 'center', alignItems: 'center', width: '100%' }}>

                    <TouchableOpacity onPress={() => this.showActionSheet()} style={{ flexDirection: 'row' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <Image style={{ borderRadius: 10, height: (imageUrl !== null && imageUrl !== '') ? 70 : 70, width: (imageUrl !== null && imageUrl !== '') ? 70 : 70 }} source={(imageUrl !== null && imageUrl !== '') ? { uri: imageUrl } : user_profile}></Image>
                        <View style={{ marginLeft: -15, padding: 6, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                          <Image style={{}} source={camera_pic}></Image>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <Text style={{ marginTop: 12, color: '#9E9E9E', fontWeight: '600', fontSize: 16 }}>Add a photo of your child</Text>


                  </View>

                </View>

              </View>

              {/* Select Background             */}
              <View style={{
                backgroundColor: '#fff',
                marginVertical: 15,
                borderRadius: 15,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}>
                {/* First Fields View */}
                <View style={{ borderBottomColor: '#E4E4E4', borderBottomWidth: 0.5, backgroundColor: '#fff', marginTop: 15, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                  <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                    <Text style={{ color: '#000', fontWeight: '600', fontSize: 15 }}>Select card background:</Text>
                    <View style={{ marginVertical: 15 }}>
                      <View style={{ flexDirection: 'row', width: '100%', backgroundColor: 'transparent' }}>
                        <View style={{ width: '20%', alignItems: 'flex-start', backgroundColor: 'transparent' }}>
                          <TouchableOpacity onPress={() => {
                            this.setState({ optionId: 1, gradient1: true, gradient2: false, gradient3: false, gradient4: false, gradient5: false, gradient6: false, gradient7: false, gradient8: false });
                          }} style={{
                            shadowColor: "#000",
                            shadowOpacity: 0.4,
                            shadowRadius: 2,
                            shadowOffset: {
                              height: 3,
                              width: 0
                            }
                          }}>
                            <LinearGradient
                              // Button Linear Gradient
                              colors={this.state.gradientcolor1}
                              style={{
                                borderRadius: 5, height: 25, width: 45, justifyContent: 'center', alignItems: 'center'
                              }}>
                              {this.state.gradient1 &&
                                <Image style={{ height: 15, width: 15 }} source={tick}></Image>
                              }
                            </LinearGradient>
                          </TouchableOpacity>

                        </View>

                        <View style={{ width: '30%', alignItems: 'center', backgroundColor: 'transparent' }}>
                          <TouchableOpacity onPress={() => {
                            this.setState({ optionId: 2, gradient1: false, gradient2: true, gradient3: false, gradient4: false, gradient5: false, gradient6: false, gradient7: false, gradient8: false });
                          }} style={{
                            shadowColor: "#000",
                            shadowOpacity: 0.4,
                            shadowRadius: 2,
                            shadowOffset: {
                              height: 3,
                              width: 0
                            }
                          }}>
                            <LinearGradient
                              // Button Linear Gradient
                              colors={this.state.gradientcolor2}
                              style={{ borderRadius: 5, height: 25, width: 45, justifyContent: 'center', alignItems: 'center' }}>
                              {this.state.gradient2 &&
                                <Image style={{ height: 15, width: 15 }} source={tick}></Image>
                              }
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>

                        <View style={{ width: '30%', alignItems: 'center', backgroundColor: 'transparent' }}>
                          <TouchableOpacity onPress={() => {
                            this.setState({ optionId: 3, gradient1: false, gradient2: false, gradient3: true, gradient4: false, gradient5: false, gradient6: false, gradient7: false, gradient8: false });
                          }} style={{
                            shadowColor: "#000",
                            shadowOpacity: 0.4,
                            shadowRadius: 2,
                            shadowOffset: {
                              height: 3,
                              width: 0
                            }
                          }}>
                            <LinearGradient
                              // Button Linear Gradient
                              colors={this.state.gradientcolor3}
                              style={{ borderRadius: 5, height: 25, width: 45, justifyContent: 'center', alignItems: 'center' }}>
                              {this.state.gradient3 &&
                                <Image style={{ height: 15, width: 15 }} source={tick}></Image>
                              }
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>

                        <View style={{ width: '20%', justifyContent: 'center', alignItems: 'flex-end', backgroundColor: 'transparent' }}>
                          <TouchableOpacity onPress={() => {
                            this.setState({ optionId: 4, gradient1: false, gradient2: false, gradient3: false, gradient4: true, gradient5: false, gradient6: false, gradient7: false, gradient8: false });
                          }} style={{
                            shadowColor: "#000",
                            shadowOpacity: 0.4,
                            shadowRadius: 2,
                            shadowOffset: {
                              height: 3,
                              width: 0
                            }
                          }}>
                            <LinearGradient
                              // Button Linear Gradient
                              colors={this.state.gradientcolor4}
                              style={{ borderRadius: 5, height: 25, width: 45, justifyContent: 'center', alignItems: 'center' }}>
                              {this.state.gradient4 &&
                                <Image style={{ height: 15, width: 15 }} source={tick}></Image>
                              }
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{  marginTop: 30, flexDirection: 'row', width: '100%', backgroundColor: 'transparent' }}>
                        <View style={{ width: '20%', alignItems: 'flex-start', backgroundColor: 'transparent' }}>
                          <TouchableOpacity onPress={() => {
                            this.setState({ optionId: 5, gradient1: false, gradient2: false, gradient3: false, gradient4: false, gradient5: true, gradient6: false, gradient7: false, gradient8: false });
                          }} style={{
                            shadowColor: "#000",
                            shadowOpacity: 0.4,
                            shadowRadius: 2,
                            shadowOffset: {
                              height: 3,
                              width: 0
                            }
                          }}>
                            <LinearGradient
                              // Button Linear Gradient
                              colors={this.state.gradientcolor5}
                              style={{ borderRadius: 5, height: 25, width: 45, justifyContent: 'center', alignItems: 'center' }}>
                              {this.state.gradient5 &&
                                <Image style={{ height: 15, width: 15 }} source={tick}></Image>
                              }
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>

                        <View style={{ width: '30%', alignItems: 'center', backgroundColor: 'transparent' }}>
                          <TouchableOpacity onPress={() => {
                            this.setState({ optionId: 6, gradient1: false, gradient2: false, gradient3: false, gradient4: false, gradient5: false, gradient6: true, gradient7: false, gradient8: false });
                          }} style={{
                            shadowColor: "#000",
                            shadowOpacity: 0.4,
                            shadowRadius: 2,
                            shadowOffset: {
                              height: 3,
                              width: 0
                            }
                          }}>
                            <LinearGradient
                              // Button Linear Gradient
                              colors={this.state.gradientcolor6}
                              style={{ borderRadius: 5, height: 25, width: 45, justifyContent: 'center', alignItems: 'center' }}>
                              {this.state.gradient6 &&
                                <Image style={{ height: 15, width: 15 }} source={tick}></Image>
                              }
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>

                        <View style={{ width: '30%', alignItems: 'center', backgroundColor: 'transparent' }}>
                          <TouchableOpacity onPress={() => {
                            this.setState({ optionId: 7, gradient1: false, gradient2: false, gradient3: false, gradient4: false, gradient5: false, gradient6: false, gradient7: true, gradient8: false });
                          }} style={{
                            shadowColor: "#000",
                            shadowOpacity: 0.4,
                            shadowRadius: 2,
                            shadowOffset: {
                              height: 3,
                              width: 0
                            }
                          }}>
                            <LinearGradient
                              // Button Linear Gradient
                              colors={this.state.gradientcolor7}
                              style={{ borderRadius: 5, height: 25, width: 45, justifyContent: 'center', alignItems: 'center' }}>
                              {this.state.gradient7 &&
                                <Image style={{ height: 15, width: 15 }} source={tick}></Image>
                              }
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>

                        <View style={{ width: '20%', justifyContent: 'center', alignItems: 'flex-end', backgroundColor: 'transparent' }}>
                          <TouchableOpacity onPress={() => {
                            this.setState({ optionId: 8, gradient1: false, gradient2: false, gradient3: false, gradient4: false, gradient5: false, gradient6: false, gradient7: false, gradient8: true });
                          }} style={{
                            shadowColor: "#000",
                            shadowOpacity: 0.4,
                            shadowRadius: 2,
                            shadowOffset: {
                              height: 3,
                              width: 0
                            }
                          }}>
                            <LinearGradient
                              // Button Linear Gradient
                              colors={this.state.gradientcolor8}
                              start={[0.3, 0.9]} end={[0.5, 0]}
                              style={{ borderRadius: 5, height: 25, width: 45, justifyContent: 'center', alignItems: 'center' }}>
                              {this.state.gradient8 &&
                                <Image style={{ height: 15, width: 15 }} source={tick}></Image>
                              }
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>

                      </View>
                    </View>
                  </View>

                </View>

              </View>

              <View style={{ flex: 1, backgroundColor: 'transparent', marginVertical: 20, alignItems: 'center', justifyContent: 'center' }}>


                <View style={{ width: '90%', backgroundColor: '#2B92FE', marginTop: 10, borderRadius: 30 }}>
                  <TouchableOpacity onPress={() => this.createCard()}>
                    <View style={{ paddingHorizontal: 30, alignSelf: 'stretch', paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Generate EmCard+</Text>
                      <Image source={right_arrow}></Image>
                    </View>
                  </TouchableOpacity>
                </View>

              </View>
            </KeyboardAwareScrollView>
          </View>

        </View>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          options={optionArray}
          cancelButtonIndex={4}
          destructiveButtonIndex={3}
          onPress={index => {
            if (index == 0) {
              this._takePhoto()
            } else if (index == 1) {
              this._pickImage()
            }
            else if (index == 2) {
              this._pickImage()
            }
            else if (index == 3) {
              this.setState({ imageUrl: null });
            }
          }}
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  }
})
