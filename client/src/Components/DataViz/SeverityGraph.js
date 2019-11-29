import React, { Component } from 'react';
import {
    BarChart, Bar, Legend, CartesianGrid, XAxis, YAxis, Tooltip,
} from 'recharts';

class SeverityGraph extends Component {
    constructor(props) {
        super(props);
        this.getSeverity = this.getSeverity.bind(this);

    }
    getSeverity(tickets){
        let data = [{severity: 'high', value: 0}, {severity:'medium', value:0}, {severity:'low', value:0}, {severity:"no_response", value:0}];
        tickets.forEach(d=>{
            if (d.severity === 'high'){
                data[0]['value']++;
            }
            else if (d.severity === 'medium'){
                data[1]['value']++;
            }
            else if (d.severity === 'low'){
                data[2]['value']++;
            } else {
                data[3]['value']++;
            }
        });

        return data;
    }

    render() {
        return (
            <BarChart
                width={this.props.width/1.5}
                height={this.props.height/2}
                data={this.getSeverity(this.props.data)}
                margin={{
                    top: 5, right: 30, left: 0, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="severity" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
        )
    }
}

export default SeverityGraph;