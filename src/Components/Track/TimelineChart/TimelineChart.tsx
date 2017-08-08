import * as React from 'react';
import * as d3 from 'd3';

import * as SizeTrack from '../SizeTrack';

import './TimelineChart.css';

interface Props {
  name: string;
  position: number;
}

interface States {

}

class TimelineChart extends React.Component<Props, States> {
  constructor() {
    super();
  }

  draw() {
    var self = this;

    var data = [
      [1, 3, 1], 
      [4, 5, 1]
    ];

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = SizeTrack.TRACK_WIDTH - margin.left - margin.right,
        height = SizeTrack.TRACK_HEIGHT - margin.top - margin.bottom;

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
    y.domain([0, 3]);

    // append the rectangles for the bar chart
    svg.selectAll('.bar')
        .data(data)
        .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', function(d: any) { return x(d[0]); })
          .attr('width', function(d: any) { return x(d[1] - d[0]); })
          .attr('y', function(d: any) { return y(d[2]); })
          .attr('height', '10px')
          .attr('transform', 'translate(0,0)');

    // // add the x Axis
    // svg.append('g')
    //     .attr('transform', 'translate(0,' + height + ')')
    //     .call(d3.axisBottom(x));

    // add the y Axis
    // svg.append('g')
    //     .call(d3.axisLeft(y));
  }

  componentDidMount() {
    this.draw();
  }

  render() {
    return (
      <svg id={this.props.name} className="timeline-chart"/>
    );
  }
}
export default TimelineChart;