import React, { Component } from 'react';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import {
    BarChart, Bar,  Legend,
} from 'recharts';

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';


class DataViz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allOfTheTickets: [],
            loggedin: true,
            activeIndex:0,
            filter: 'all',
        };
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.loadTickets();
        this.loadTickets = this.loadTickets.bind(this);
        this.getStatus = this.getStatus.bind(this);
        this.getTime = this.getTime.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.renderActiveShape = this.renderActiveShape.bind(this);
        this.getInitialState = this.getInitialState.bind(this);
        this.onPieEnter = this.onPieEnter.bind(this);
    }

    loadTickets() {
        if (this.state.filter === 'my_tickets') {
            this.loadMyTickets();
        } else if (this.state.filter === 'unassigned') {
            this.loadUnassignedTickets();
        } else if (this.state.filter === 'closed') {
            this.loadClosedTickets();
        } else {

            fetch('/tickets/open', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.token
                }
            })
                .then(function (response) {
                    if (response.status === 403) {
                        localStorage.removeItem('token');
                        this.setState({ loggedin: false });
                    } else {
                        return response.json();
                    }
                }.bind(this))
                .then(data => {
                    this.setState({ allOfTheTickets: data.reverse() })
                })
                .catch(err => console.log(err))
        }
    }
    getStatus(tickets){
        let data = [{status: 'open', value: 0}, {status:'waiting', value:0}, {status:'closed', value:0}];
        tickets.forEach(d=>{
            if (d.status === 'open'){
                data[0]['value']++;
            }
            else if (d.status === 'waiting'){
                data[1]['value']++;
            }
            else if (d.status === 'closed'){
                data[2]['value']++;
            }else{
                return null;
            }
        });

        return data;
    }

    getTime(tickets){
        //calculate past week
        let today = new Date();;
        const weekday = new Array (7);
        weekday [0] = "Sunday";
        weekday [1] = "Monday";
        weekday [2] = "Tuesday";
        weekday [3] = "Wednesday";
        weekday [4] = "Thursday";
        weekday [5] = "Friday";
        weekday [6] = "Saturday";

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
        console.log(data);
        return data;
    }

    renderActiveShape(props) {
        const RADIAN = Math.PI / 180;
        const {
            cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
            fill, payload, percent, value
        } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';
        return (
                <g>
                    <text x={cx} y={cy} dy={8} textAnchor={"middle"} fill={fill}>
                        {payload.status}
                    </text>
                    <Sector
                        cx={cx}
                        cy={cy}
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        startAngle={startAngle}
                        endAngle={endAngle}
                        fill={fill}
                    />
                    <Sector
                        cx={cx}
                        cy={cy}
                        innerRadius={innerRadius + 6}
                        outerRadius={outerRadius + 10}
                        startAngle={startAngle}
                        endAngle={endAngle}
                        fill={fill}
                    />
                    <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
                    <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
                    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor}
                          fill="#333">{`Number of Tickets ${value}`}</text>
                    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                        {`(Percentage ${(percent * 100).toFixed(0)}%)`}
                    </text>
                </g>
        );
    }
    getInitialState() {
        return {
            activeIndex: 0,
        };
    }

    onPieEnter(data, index) {
        this.setState({
            activeIndex: index,
        });
    }

    render(){
        let data = this.getStatus(this.state.allOfTheTickets);
        const COLORS = ['#0088FE', '#00a884', '#FFBB28'];
        let data2 = this.getTime(this.state.allOfTheTickets);
        let data3 = this.getLocation(this.state.allOfTheTickets);

        return(
            <div>
                <p> Current State of Tickets: Open, Closed, Waiting </p>
                <PieChart width={this.width} height={this.height/2}>
                    <Pie
                        activeIndex={this.state.activeIndex}
                        activeShape={this.renderActiveShape}
                        data={data}
                        cx={this.width / 4}
                        cy={this.height /4}
                        innerRadius={100}
                        outerRadius={120}
                        fill={"#8884d8"}
                        dataKey="value"
                        onMouseEnter={this.onPieEnter}
                    >
                        {
                            data.map((entry, index) => <Cell  fill={COLORS[index % COLORS.length]}/>)
                        }
                    </Pie>
                </PieChart>
                <p> Tickets submitted this past week </p>
                <AreaChart
                    width={this.width/2}
                    height={this.height/2}
                    data={data2}
                    margin={{top:10, right:30, left:0, bottom: 0}}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis dataKey="value" />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
                <p> Tickets by Location </p>
                <BarChart
                    width={this.width/1.5}
                    height={this.height/2}
                    data={data3}
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

            </div>
        );
    }
}

export default DataViz;
