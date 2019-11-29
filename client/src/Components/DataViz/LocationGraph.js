import React, { Component } from 'react';
import {
    BarChart, Bar, Legend, CartesianGrid, XAxis, YAxis, Tooltip,
} from 'recharts';

class LocationGraph extends Component {
    constructor(props) {
        super(props);
        this.getLocation = this.getLocation.bind(this);
    }

    getLocation(tickets){
        let data = [{location:"canyon", value:0},
            {location:"hill", value:0},
            {location:"cypress", value:0},
            {location:"creekview", value:0},
            {location:"campus_apartments", value:0},
            {location:"college_creek", value:0},
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
                width={this.props.width/1.5}
                height={this.props.height/2}
                data={this.getLocation(this.props.data)}
                margin={{
                    top: 5, right: 30, left: 0, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
        );
    }
}

export default LocationGraph;
