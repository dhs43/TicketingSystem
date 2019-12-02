import React, { Component } from 'react';
import {
    ComposedChart, Bar, Label, CartesianGrid, XAxis, YAxis, Tooltip, BarChart,
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
            <ComposedChart
                layout="vertical"
                width={this.props.width/2.5}
                height={this.props.height/2}
                data={this.getLocation(this.props.data)}
                margin={{
                    top: 5, right: 30, left: 30, bottom: 20,
                }}
            >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis type="number">
                    <Label value="Num Tickets" offset={0} position="bottom" />
                </XAxis>
                <YAxis dataKey="location" type="category" >
                    <Label value="Location" offset={-5} position="insideBottomLeft" angle={-90} />
                </YAxis>
                <Tooltip />
                <Bar dataKey="value"
                     fill="#ad1457"
                     barSize={30}
                />
            </ComposedChart>










        );
    }
}

export default LocationGraph;
