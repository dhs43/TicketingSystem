import React, { Component } from 'react';
import { PieChart, Pie, Sector, Cell } from 'recharts';

class PieGraph extends Component{
    constructor(props) {
        super(props);
        this.state = {
            tickets: this.props.tickets,
            activeIndex:0,
        };
        this.renderActiveShape = this.renderActiveShape.bind(this);
        this.getInitialState = this.getInitialState.bind(this);
        this.onPieEnter = this.onPieEnter.bind(this);
        this.getStatus = this.getStatus.bind(this);
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
                      fill="#333">{`Tickets ${value}`}</text>
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

    render(){
        const COLORS = ['#0088FE', '#FFBB28', '#00a884'];
        return(
            <PieChart width={this.props.width/2.3} height={this.props.height/1.7}>
                <Pie
                    activeIndex={this.state.activeIndex}
                    activeShape={this.renderActiveShape}
                    data={this.getStatus(this.props.data)}
                    innerRadius={95}
                    outerRadius={110}
                    fill={"#8884d8"}
                    dataKey="value"
                    onMouseEnter={this.onPieEnter}
                    key={"PieChartBaby"}
                >
                    {
                        this.props.data.map((entry, index) => <Cell  fill={COLORS[index % COLORS.length]}/>)
                    }
                </Pie>
            </PieChart>
        );
    }
}

export default PieGraph;