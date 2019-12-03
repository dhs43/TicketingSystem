import React, { Component } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Label, BarChart,
} from 'recharts';

class AreaGraph extends Component {
    constructor(props) {
        super(props);
        this.getTime = this.getTime.bind(this);
    }

    getTime(tickets){
        const today = new Date ();
        const weekday = new Array (7);
        weekday [0] = "Sun";
        weekday [1] = "Mon";
        weekday [2] = "Tue";
        weekday [3] = "Wed";
        weekday [4] = "Th";
        weekday [5] = "Fri";
        weekday [6] = "Sat";

        let data =[
            { day:weekday[new Date(today -6 * 86400000).getDay()], value:0},
            { day:weekday[new Date(today -5 * 86400000).getDay()], value:0},
            { day:weekday[new Date(today -4 * 86400000).getDay()], value:0},
            { day:weekday[new Date(today -3 * 86400000).getDay()], value:0},
            { day:weekday[new Date(today -2 * 86400000).getDay()], value:0},
            { day:weekday[new Date(today - 86400000).getDay()], value:0},
            { day: weekday[today.getDay()], value:0}];

        tickets.forEach(d=>{
            let date =  new Date(d.time_submitted * 1000);
            if( today.getDate() - date.getDate() <= 7 ){
                data.forEach(d => {
                    let wkday = weekday[date.getDay()];
                    if (d.day === wkday){
                        d.value++;
                    }
                });
            }
        });
        return data;
    }

    render(){
        return(
            <AreaChart
                width={this.props.width/2.5}
                height={this.props.height/2}
                data={this.getTime(this.props.data)}
                margin={{
                    top: 5, right: 30, left: 30, bottom: 20,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" >
                    <Label value="Time" position="bottom" />
                </XAxis>
                <YAxis dataKey="value">
                    <Label value="Num Tickets" position="left" angle={-90} />
                </YAxis>
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#6a1b9a" />
            </AreaChart>
        );
    }
}

export default AreaGraph;