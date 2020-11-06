import { timers } from "jquery"
import firebase from "./firebase"
import * as $ from "jquery";
import "./AddToQ.scss"
import React from "react"

class AddToQ extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            search: "",
            suggestions: [],
            token: this.props.token,
            path: this.props.path,
            choice: "",
            loading: true,
            expiry: 0,
            invalid: false
        }
    }



   

    handleChange = (e) =>{
        this.setState({
            search: e.target.value
        })
        

        $.ajax({
            url: "https://api.spotify.com/v1/search?q=" + this.state.search + "&type=track&limit=3",
            type: "GET",
            beforeSend: xhr => {
              xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
            },
            success: data => {
              let suggestions = data.tracks.items
              let newStateObj = []
              newStateObj.push(
                {name: suggestions[0].name, trackId : suggestions[0].uri, artist: suggestions[0].artists[0].name,}
               )
               newStateObj.push(
                {name: suggestions[1].name, trackId : suggestions[1].uri, artist: suggestions[1].artists[0].name}
               )
               newStateObj.push(
                {name: suggestions[2].name, trackId : suggestions[2].uri, artist: suggestions[2].artists[0].name}
               )
             
              this.setState({
                  suggestions: newStateObj
              })
              if(!data) {
                this.setState({
                  no_data: true,
                });
                return;
              }
      
             
            }
          });
    }

    componentDidMount(){
        let path = window.location.pathname
        let dbAccess = path.substring(1)


         firebase.firestore().collection("Tokens").doc(dbAccess).get()
        .then(snapshot => {
            this.setState({
                token: snapshot.data().tokenID,
                loading: false,
                expiry: snapshot.data().expiryDate
            }, ()=>{
                var d = new Date();
            var n = d.getTime();
            console.log(this.state.expiry)
            if (this.state.expiry < n){
            this.setState({
                invalid: true
            })
        } 
            })
        })

        
    }

    handleSelect = (e) =>{
        this.setState({
            choice: e.target.value
        })
    }
    
    addToQueue = () =>{
        console.log('ere')
        this.forceUpdate()
        $.ajax({
            url: "https://api.spotify.com/v1/me/player/queue?uri=" + this.state.choice,
            type: "POST",
            beforeSend: xhr => {
              xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
            },
            success: data => {
              console.log(data)
              if(!data) {
                this.setState({
                  no_data: true,
                });
                return;
              }
      
             
            }
          });
    }

    render(){

        if(this.state.loading){
            return(
                <div className = "container2"> 
                    <div className="head">
                        <h1>Find a song</h1>
                    </div>
                    <div className="input1">
                    <input type="text" name="name" onChange={this.handleChange}/>
                    </div>
                    
                </div>
            )
        }
        if(this.state.invalid){
            return(
                <div className = "container2">
                <div className = "head">
                    <h1>This link has expired, ask your friend to create a new URL.</h1>
                </div>
                </div>
            )
        }

        if(this.state.suggestions.length !== 0){
            return(
                <div className = "container2">
                <div className = "head">
                    <h1>Find a song</h1>
                </div>
                <div className = "input1">
                <input type="text" name="name" onChange={this.handleChange}/>
                </div>
                <div className="form-wrapper
                ">
                                <form>
                                    <div class="radiobtn">
                                        <input type="radio" id="huey" onChange = {this.handleSelect}
                                                    name="drone" value={this.state.suggestions[0].trackId}   />
                                        <label for="huey">{this.state.suggestions[0].name}, {this.state.suggestions[0].artist}</label>
                                    </div>

                                    <div class="radiobtn">
                                        <input type="radio" id="dewey"  onChange = {this.handleSelect}
                                                    name="drone" value={this.state.suggestions[1].trackId}  />
                                        <label for="dewey">{this.state.suggestions[1].name}, {this.state.suggestions[1].artist}</label>
                                    </div>

                                    <div class="radiobtn">
                                        <input type="radio" id="louie"  onChange = {this.handleSelect}
                                                    name="drone" value={this.state.suggestions[2].trackId}  />
                                        <label for="louie">{this.state.suggestions[2].name}, {this.state.suggestions[2].artist}</label>
                                    </div>

                                </form>

                                <a onClick = {this.addToQueue}
                                                >add to queue</a>

                </div>
            </div>
            )
        }
        else{
            console.log(this.state.token)
            return(

                <div className = "container2"> 
                    <div className="head">
                        <h1>Find a song</h1>
                    </div>
                    <div className="input1">
                    <input type="text" name="name" onChange={this.handleChange}/>
                    </div>
                    
                </div>
            )
        }
        
    }
}

export default AddToQ