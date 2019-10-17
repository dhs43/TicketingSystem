import React, { Component } from 'react';

class Home extends Component{
    constructor(props){
        super(props);
	    console.log("temp"); // was getting an error about a "useless constructor" idk
    }
    render(){
        return(
            <div>
                Hello there! This is our Home Page!
            </div>
        );
    }
}

export default Home;
