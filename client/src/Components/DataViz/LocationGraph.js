import React, { Component } from 'react';
import {
    BarChart, Bar, Label, CartesianGrid, XAxis, YAxis, Tooltip,
} from 'recharts';


// import {
//     ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
//     Legend,
// } from 'recharts';


class LocationGraph extends Component {
    constructor(props) {
        super(props);
        this.getLocation = this.getLocation.bind(this);
    }

    getLocation(tickets){
        let data = [{location:"Canyon", value:0},
            {location:"Hill", value:0},
            {location:"Cypress", value:0},
            {location:"Creekview", value:0},
            {location:"Campus Apartments", value:0},
            {location:"College Creek", value:0},
        ];

        tickets.forEach(d => {
            if(d.location === 'canyon'){
                data[0].value++;
            }
            if(d.location === 'hill'){
                data[1].value++;
            }
            if(d.location === 'cypress'){
                data[2].value++;
            }
            if(d.location === 'creekview'){
                data[3].value++;
            }
            if(d.location === 'campus_apartments'){
                data[4].value++;
            }
            if(d.location === 'college_creek'){
                data[5].value++;
            }
            else{
                return null;
            }
        });
        return data;
    }

    render(){
        return(
            <BarChart
                width={this.props.width/2.5}
                height={this.props.height/2}
                data={this.getLocation(this.props.data)}
                margin={{
                    top: 5, right: 0, left: 20, bottom: 20,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" type="category">
                    <Label value="Location" offset={0} position="bottom" />
                </XAxis>
                <YAxis>
                    <Label value="Num Tickets" position="left" angle={-90} />
                </YAxis>
                <Tooltip />
                <Bar dataKey="value"
                     fill="#ad1457"
                     barSize={30}
                />
            </BarChart>










        );
    }
}

export default LocationGraph;
