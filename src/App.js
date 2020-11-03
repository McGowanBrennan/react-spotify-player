import React from "react"
import LandingScreen from "./LandingScreen"
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import AddToQ from "./AddToQ"



class App extends React.Component{
    constructor(){
        super()
        this.state={
            path: "",
            token: null
        }
    }
    

    callAPI = () => {
        fetch("http://localhost:9000/testAPI")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }));
    }

    componentDidMount(){
        this.callAPI()
    }

    render(){
        const eventhandler = credList => {
    
            console.log("Im in app.js")
            console.log(credList)
            console.log(credList[1])
            this.setState({
                path: credList[1],
                token: credList[0]
            })
        }
        return(
            <Router>
                <Switch>
            <Route exact path="/" render={props => <LandingScreen onTokenChange = {eventhandler} />}/>
            
            <Route exact path={this.state.path} render={props => <AddToQ token = {this.state.token} path={this.state.path} />}/>
            </Switch>

        </Router>
        )
    }
    
    
}
export default App