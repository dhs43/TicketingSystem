import React, { Component } from 'react';
import {max, scaleOrdinal,schemeSet2, pie, entries,arc, select } from  'd3';

class DataViz extends Component {
    constructor(props) {
        super(props);

        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
        this.pieDimensions={w: this.windowWidth/4, h:this.windowHeight/4};
        this.margin= 40;
        this.radius = max(this.pieDimensions.w, this.pieDimensions.h) - this.margin;

        this.state = {
            allOfTheTickets: [],
            loggedin: true,
        };

        this.loadTickets();
        this.loadTickets = this.loadTickets.bind(this);
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
                    data.forEach(item => {
                        var date = new Date(item.time_submitted * 1000);
                        item.time_submitted = (("0" + (date.getMonth() + 1)).slice(-2)) + '/' + (("0" + date.getDate()).slice(-2)) + '/' + date.getFullYear();
                    });
                    this.setState({ allOfTheTickets: data.reverse() })
                })
                .catch(err => console.log(err))
        }
    }

    render(){
        let data = {a: 9, b: 20, c:30, d:8, e:12};
        let color = scaleOrdinal()
            .domain(data)
            .range(schemeSet2);

        let mepie = pie()
            .value(function(d) {return d.value; });

        let data_ready = mepie(entries(data));

        let arcGenerator = arc()
            .innerRadius(0)
            .outerRadius(this.radius);

        return(
          <div>
              <p>  Data Visualization  </p>
              <svg
                  width={this.windowWidth}
                  height={this.windowHeight}
              >
                  <g
                      transform={"translate(" + this.pieDimensions.w + "," + this.pieDimensions.h + ")"}
                  >
                      <circle x={0} y={50} r={100}> </circle>
                  </g>
              </svg>
          </div>
        );
    }

}

export default DataViz;
