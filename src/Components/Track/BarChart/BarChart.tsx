import * as React from 'react';
import * as d3 from 'd3';

import './BarChart.css';

interface BarChartProps {
  name: string;
  position: number;
}

interface BarChartState {

}

class BarChart extends React.Component<BarChartProps, BarChartState> {
  constructor() {
    super();
  }

  draw() {
    var self = this;

    var data = [
      [1, 20, 80], 
      [3, 40, 20],
      [5, 50, 10],
      [7, 20, 80]
    ];

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear()
              .range([0, width]);
    var y = d3.scaleLinear()
              .range([height, 0]);
              
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select('#' + self.props.name).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
          .attr('transform', 
                'translate(' + margin.left + ',' + margin.top + ')');

    // Scale the range of the data in the domains
    x.domain([0, 10]);
    y.domain([0, 90]);

    // append the rectangles for the bar chart
    svg.selectAll('.bar')
        .data(data)
        .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', function(d: any) { return x(d[0]); })
          .attr('width', '10px')
          .attr('y', function(d: any) { return y(d[1]); })
          .attr('height', function(d: any) { return height - y(d[1]); })
          .attr('transform', 'translate(-10,0)');
    
    svg.selectAll('.bar2')
        .data(data)
        .enter().append('rect')
          .attr('class', 'bar2')
          .attr('x', function(d: any) { return x(d[0]); })
          .attr('width', '10px')
          .attr('y', function(d: any) { return y(d[2]); })
          .attr('height', function(d: any) { return height - y(d[2]); })
          .attr('transform', 'translate(0,0)');

    // add the x Axis
    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append('g')
        .call(d3.axisLeft(y));
  }

  componentDidMount() {
    this.draw();
  }

  render() {
    return (
      <svg id={this.props.name} className="bar-chart"/>
    );
  }
}
export default BarChart;