import * as d3 from 'd3';

function dashboard(id, fData){
    let barColor = '#5C8021';
    function segColor(c){ return {open:"#cb1519", waiting:"#ff9827",closed:"#1bba2b"}[c]; }

    // compute total for each se.
    let totals={total:0, low:0, medium:0, high:0};
    fData.forEach(function(d){
        totals.total++;
        totals[d.severity]++;
    });

    let by = "severity";

    console.log(totals);
    let hGDim = {t: 60, r: 0, b: 30, l: 0};
    hGDim.w = 500 - hGDim.l - hGDim.r;
    hGDim.h = 300 - hGDim.t - hGDim.b;

    // function to handle histogram.
    function histoGram(fD){
        let hG={};
        //create svg for histogram.
        let hGsvg = d3.select(id)
            .append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        // create function for x-axis mapping.
        // fD.map(function(d) { return d[0]; }));
        let x = d3.scaleBand(
            (fD.map(function(d){return  d[by]; })), //domain
            ([0, hGDim.w])  // range
            )
            .padding(0.1); // padding in between bars

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.axisBottom(x));

        // Create function for y-axis map.
        // Create function for y-axis map.
        // var y = d3.scale.linear().range([hGDim.h, 0])
        //     .domain([0, d3.max(fD, function(d) { return d[1]; })]);


        let y = d3.scaleLinear().range([hGDim.h, 0])
            .domain([0, d3.max(fD, function(d) { return totals[d[by]]; })]);

        // Create bars for histogram to contain rectangles and freq labels.
        let bars = hGsvg.selectAll(".bar").data(fData).enter()
            .append("g").attr("class", "bar");

        //create the rectangles
        bars.append("rect")
            .attr("x", function(d) { console.log("x " + x(d[by])); return x(d[by]) })
            .attr("y", function(d) { console.log("y " + y(totals[d[by]])); return y(totals[d[by]]); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return hGDim.h - y(totals[d[by]] );})
            .attr('fill',barColor)
            .on("mouseover",mouseover)// mouseover is defined below.
            .on("mouseout",mouseout);// mouseout is defined below.

        //Create the frequency labels above the rectangles.
        bars.append("text").text(function(d){ return d3.format(",")(totals[d[by]] )})
            .attr("x", function(d) { return x(d[by])+x.bandwidth()/2; })
            .attr("y", function(d) { return y(totals[d[by]] )-5; })
            .attr("text-anchor", "middle");

        function mouseover(d){  // utility function to be called on mouseover.
            // filter for selected severity.
            let st = fData.filter(function(s){  return s.by  === d[by];})[0];
            let nD = d3.keys(st).map(function(s){ return {severity:st.by[s]};});

            // call update functions of pie-chart and legend.
            pC.update(nD);
            leg.update(nD);
        }

        function mouseout(d){    // utility function to be called on mouseout.
            // reset the pie-chart and legend.
            pC.update(tF);
            leg.update(tF);
        }

        // create function to update the bars. This will be used by pie-chart.
        hG.update = function(nD, color){
            // update the domain of the y-axis map to reflect change in frequencies.
            y.domain([0, d3.max(nD, function(d) { return totals[d[by]]; })]);

            // Attach the new data to the bars.
            let bars = hGsvg.selectAll(".bar").data(nD);

            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
                .attr("y", function(d) {return y(totals[d[by]]); })
                .attr("height", function(d) { return hGDim.h - y(totals[d[by]]); })
                .attr("fill", color);

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(function(d){ return d3.format(",")(totals[d[by]])})
                .attr("y", function(d) {return y(totals[d[by]])-5; });
        };
        return hG;
    }

    // function to handle pieChart.
    function pieChart(pD){
        let pC ={};
        let pieDim ={w:250, h: 250};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

        // create svg for pie chart.
        let piesvg = d3.select(id)
            .append("g")
            .attr("transform", "translate("+ (hGDim.w + pieDim.w) +","+pieDim.h/2+")");

        // create function to draw the arcs of the pie slices.
        let arc = d3.arc().outerRadius(pieDim.r - 10).innerRadius(0);

        // create a function to compute the pie slice angles.
        let pie = d3.pie().sort(null).value(function(d) { return d.number; });

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d) {  return segColor(d.data.type); })
            .on("mouseover",mouseover).on("mouseout",mouseout);

        // create function to update pie-chart. This will be used by histogram.
        pC.update = function(nD){
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        };

        // Utility function to be called on mouseover a pie slice.
        function mouseover(d){
            // call the update function of histogram with new data.
            hG.update(fData.map(function(v){
                return [v.severity,v.status[d.status]];}),segColor(d.status));
        }
        //Utility function to be called on mouseout a pie slice.
        function mouseout(d){
            // call the update function of histogram with all data.
            hG.update(fData.map(function(v){
                return [v.severity,v.total];}), barColor);
        }
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
            let i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }
        return pC;
    }

    // function to handle legend.
    function legend(lD){
        let leg = {};

        // create table for legend.
        let legend = d3.select('#heyAllyouPeople').append("table").attr('class','legend').style('float', 'right');

        // create one row per segment.
        let tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
            .attr("width", '16').attr("height", '16')
            .attr("fill",function(d){ return segColor(d.type); });

        // create the second column for each segment.
        tr.append("td").text(function(d){ return d.type;});

        // create the third column for each segment.
        tr.append("td").attr("class",'legendFreq')
            .text(function(d){ return d.number;});

        // create the fourth column for each segment.
        tr.append("td").attr("class",'legendPerc')
            .text(function(d){ return getLegend(d,lD);});

        // Utility function to be used to update the legend.
        leg.update = function(nD){
            // update the data attached to the row elements.
            let l = legend.select("tbody").selectAll("tr").data(nD);

            // update the frequencies.
            l.select(".legendFreq").text(function(d){ return d3.format(",")(d.status);});

            // update the percentage column.
            l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});
        };

        function getLegend(d,aD){ // Utility function to compute percentage.
            console.log("I'VE JUST HAD A SANDWITCH NO ORDINARY SANDWITCH");
            console.log(aD);
            console.log(aD['total']);
            return d3.format("%")(d.number/aD[0].total); // dividbe by fData.lenght
        }

        return leg;
    }

    // calculate total frequency by segment for all severity.

    let tF = ['open', 'waiting', 'closed'].map(function(level_of_severity){
        let blah = {'total': 0, 'open':0, 'waiting':0,'closed': 0};
        fData.forEach(function(ticket) {
            blah['total']++;
             blah[ticket.status]++;
        });
        return {total: blah['total'], type: level_of_severity, number: blah[level_of_severity]}
    });

    // calculate total frequency by severity for all segment.
    let sF = fData.map(function(d){return d;});
    console.log(tF);

    let hG = histoGram(sF); // create the histogram.
    let pC = pieChart(tF); // create the pie-chart.
    let leg= legend(tF);  // create the legend.

}

export default function callMe(string, data){
    dashboard(string, data);
}

