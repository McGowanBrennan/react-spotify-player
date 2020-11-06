import React, { Component } from "react";
import * as $ from "jquery";
import hash from "./hash";
import Player from "./Player";
import AddToQ from "./AddToQ"
import "./LandingScreen.css";
import firebase from "./firebase"
import { timers } from "jquery";

class LandingScreen extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      item: {
        album: {
          images: [{ url: "" }]
        },
        name: "",
        artists: [{ name: "" }],
        duration_ms: 0
      },
      is_playing: "Paused",
      progress_ms: 0,
      no_data: false,
      authenticated: false,
      urlCreated: false,
      customURL: ""
    };

    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
    this.tick = this.tick.bind(this);
  }

  pushToDB = () =>{
    var d = new Date();
    var n = d.getTime();
    //var final = n + 2700000;
    var final = n + 2700000
    firebase.firestore().collection("Tokens").doc(this.state.customURL).set({
    tokenID: this.state.token,
    expiryDate: final
    
                  })

}

  componentDidMount() {
    var randomWords = require('random-words');
    let customURL = ""
    let ranWord = randomWords()
    customURL = customURL + ranWord
    ranWord = randomWords()
    customURL = customURL + "-"
    customURL = customURL + ranWord
    ranWord = randomWords()
    customURL = customURL + "-"
    customURL = customURL + ranWord
    customURL = customURL + "-"
    let num = Math.floor(Math.random() * 1001);
    customURL = customURL + num.toString()


    // Set token
    let _token = hash.access_token;

    if (_token) {
      // Set token
      this.setState({
        token: _token,
        customURL: customURL
      });
      this.getCurrentlyPlaying(_token);
    }

    // set interval for polling every 5 seconds
    this.interval = setInterval(() => this.tick(), 5000);
  }

  componentWillUnmount() {
    // clear the interval to save resources
    clearInterval(this.interval);
  }

  tick() {
    if(this.state.token) {
      this.getCurrentlyPlaying(this.state.token);
    }
  }

  handleClick = () =>{
    console.log("here")
    this.setState({
      authenticated: true
    })
  }


  getCurrentlyPlaying(token) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        // Checks if the data is not empty
        if(!data) {
          this.setState({
            no_data: true,
          });
          return;
        }

        this.setState({
          item: data.item,
          is_playing: data.is_playing,
          progress_ms: data.progress_ms,
          no_data: false /* We need to "reset" the boolean, in case the
                            user does not give F5 and has opened his Spotify. */
        });
      }
    });
  }

  myFunction = () => {
    /* Get the text field */
    var copyText = document.getElementById("myInput");
  
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  
    /* Copy the text inside the text field */
    document.execCommand("copy");
  
  }

  handleGenerateUrl = token1 =>{
    let pathObj = [this.state.token, this.state.customURL]
    this.pushToDB()
    this.props.onTokenChange(pathObj)
    this.setState({
      urlCreated: true
    })
  }

  render() {
    if(this.state.urlCreated){
      var res = this.state.token.substring(0, 10);
    var path = "https://stoic-wilson-6e8c75.netlify.app/"
    path = path + this.state.customURL
      return(
        <div className="container">
        <div className="header">
          <h1><code>Shareable Spotify Queue.</code></h1>
          <h3><code>Send this URL to your friends to let them add to the Queue.</code></h3>
        </div>
        <div className="buttons">
          
          <input type="text" value={path} id="myInput"/>
          <a onClick={this.myFunction}
                >copy</a>
        </div>
      </div>
      )
    }
    
    if(this.state.token){
      var res = this.state.token.substring(0, 10);
    var path = "https://stoic-wilson-6e8c75.netlify.app/"
    path = path + this.state.customURL
      return(
        <div className="container">
        <div className="header">
          <h1><code>Shareable Spotify Queue.</code></h1>
          <h3><code>Authenticate your Spotify account then generate a shareable URL to let your friends control the Queue.</code></h3>
        </div>
        <div className="buttons">
        
        <a onClick = {this.handleGenerateUrl}
                >generate shareable url</a>
        </div>
      </div>
      )
    }
    return (
      <div className="container">
        <div className="header">
          <h1><code>Shareable Spotify Queue.</code></h1>
          <h3><code>Authenticate your Spotify account then generate a shareable URL to let your friends control the Queue.</code></h3>
        </div>
        <div className="buttons">
          


              <a onClick = {this.handleClick}
                className="btn btn--loginApp-link"
                href={`${process.env.REACT_APP_AUTHENDPOINT}?client_id=${process.env.REACT_APP_CLIENTID}&redirect_uri=${process.env.REACT_APP_REDIRECTURI + this.state.customURL}&scope=${process.env.REACT_APP_SCOPES}&response_type=token&show_dialog=true`}>Login</a>
        </div>
      </div>
    );
  }
}

export default LandingScreen;
