import React, { Component } from 'react';
import {
    AreaChart , Area, XAxis, YAxis, CartesianGrid, Tooltip, Label,
} from 'recharts';

class TimeGraph extends Component {
    constructor(props) {
        super(props);
        this.timeConverter = this.timeConverter.bind(this);
        this.getTime = this.getTime.bind(this);
    }


    timeConverter(UNIX_timestamp){
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        let a = new Date(UNIX_timestamp * 1000);

        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        let year = a.getFullYear();
        let month = months[a.getMonth()];
        let date = a.getDate();
        let time = date + ' ' + month + ' ' + year;
        return time;
    }


    getTime(tickets, time_period){
        let data =[];
        //get today
        let today = new Date().getTime() / 1000;

        let keys=[];
        for (let i = 0; i < time_period; i++) {
            keys.push(
                this.timeConverter(today - i * 86400)
            );
        }

        keys.forEach(k => {
            data.push(
                {date: k, value: 0}
            );
        });

        tickets.forEach(e => {
            let to_compare = this.timeConverter(e.time_submitted);
            data.forEach(d => {
                if (d.date === to_compare) {
                    d.value++;
                }
            });
        });
        return data;
    }

    render(){
        return(
            <AreaChart
                width={this.props.width/2.5}
                height={this.props.height/2}
                data={this.getTime(this.props.data, this.props.time_period)}
                margin={{
                    top: 5, right: 30, left: 30, bottom: 20,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date"  reversed={true}>
                    <Label value="Time" position="bottom" />
                </XAxis>
                <YAxis dataKey="value">
                    <Label value="Num Tickets" position="left" angle={-90} />
                </YAxis>
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#37474f" />
            </AreaChart >
        );
    }
}

export default TimeGraph;