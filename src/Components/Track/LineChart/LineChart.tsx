import * as React from 'react';
import * as d3 from 'd3';

import * as SizeTrack from '../SizeTrack';

import './LineChart.css';

interface Props {
  name: string;
  position: number;
}

interface States {

}

class LineChart extends React.Component<Props, States> {
  constructor() {
    super();
  }

  draw() {
    var self = this;

    var data = [
      [1, 20], 
      [3, 40],
      [5, 50],
      [7, 20]
    ];

    var data2 = [
      [1, 70], 
      [3, 30],
      [5, 80],
      [7, 50]
    ];

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = SizeTrack.TRACK_WIDTH - margin.left - margin.right,
    height = SizeTrack.TRACK_HEIGHT - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
        .x(function(d: any) { return x(d[0]); })
        .y(function(d: any) { return y(d[1]); });

    var valueline2 = d3.line()
        .x(function(d: any) { return x(d[0]); })
        .y(function(d: any) { return y(d[1]); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select('#' + self.props.name).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Scale the range of the data
    x.domain([0, 10]);
    y.domain([0, 100]);

    // Add the valueline path.
    svg.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', valueline)
        .attr('stroke', 'red')
        .attr('stroke-width', '1px')
        .attr('fill', 'none');
    
    svg.append('path')
        .data([data2])
        .attr('class', 'line')
        .attr('d', valueline2)
        .attr('stroke', 'blue')
        .attr('stroke-width', '1px')
        .attr('fill', 'none');

    // // Add the X Axis
    // svg.append('g')
    //     .attr('transform', 'translate(0,' + height + ')')
    //     .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append('g')
        .call(d3.axisLeft(y).ticks(5, 's'));
  }

  componentDidMount() {
    this.draw();
  }

  render() {
    return (
      <svg id={this.props.name} className="line-chart"/>
    );
  }
}
export default LineChart;