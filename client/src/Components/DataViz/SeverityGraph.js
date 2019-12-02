import React, { Component } from 'react';
import {
    BarChart, Bar, Label, CartesianGrid, XAxis, YAxis, Tooltip,
} from 'recharts';

class SeverityGraph extends Component {
    constructor(props) {
        super(props);
        this.getSeverity = this.getSeverity.bind(this);

    }
    getSeverity(tickets){
        let data = [{severity: 'High', value: 0},
            {severity:'Medium', value:0},
            {severity:'Low', value:0},
            {severity:"No Response", value:0}];

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
                width={this.props.width/2.5}
                height={this.props.height/1.7}
                data={this.getSeverity(this.props.data)}
                margin={{
                    top: 5, right: 30, left: 30, bottom: 20,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="severity">
                    <Label value="Severity" offset={0} position="bottom" />
                </XAxis>
                <YAxis label={{ value: 'Num Tickets', angle: -90, position: 'left' }} />
                <Tooltip />
                <Bar dataKey="value"
                     fill="#3f51b5"
                />
            </BarChart>
        )
    }
}

export default SeverityGraph;