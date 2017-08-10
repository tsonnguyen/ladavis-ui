import * as React from 'react';
import * as d3 from 'd3';

import * as SizeTrack from '../SizeTrack';

import './EventChart.css';

interface Props {
  name: string;
  position: number;
}

interface States {

}

class EventChart extends React.Component<Props, States> {
  constructor() {
    super();
  }

  drawChart() {
    var self = this;

    var data = [
      [1, 1, 80], 
      [3, 0, 20],
      [5, 1, 10],
      [7, 1, 80]
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
          .attr('width', '10px')
          .attr('y', function(d: any) { return y(d[1]); })
          .attr('height', function(d: any) { return (d[1] === 1) ? '10px' : '0px'; })
          .attr('transform', 'translate(-5,0)');

    // add the x Axis
    // svg.append('g')
    //     .attr('transform', 'translate(0,' + height + ')')
    //     .call(d3.axisBottom(x));

    // add the y Axis
    // svg.append('g')
    //     .call(d3.axisLeft(y));
  }

  drawFigureBox() {
    var svg = d3.select('#' + this.props.name);
    svg.append('rect')
            .attr('class', 'figure-box')
            .attr('x', SizeTrack.TRACK_WIDTH + 40)
            .attr('y', 20)
            .attr('width', 90)
            .attr('height', 30)
            .attr('fill', 'rgba(255, 0, 0, 0.7)');

    svg.append('text')
            .attr('class', 'figure-name')
            .text('HbA1c')
            .attr('x', SizeTrack.TRACK_WIDTH + 50)
            .attr('y', 40); 

    svg.append('rect')
            .attr('class', 'figure-box')
            .attr('x', SizeTrack.TRACK_WIDTH + 40)
            .attr('y', 55)
            .attr('width', 90)
            .attr('height', 30)
            .attr('fill', 'rgba(255, 0, 0, 0.7)');

    svg.append('text')
            .attr('class', 'figure-name')
            .text('HbA1c')
            .attr('x', SizeTrack.TRACK_WIDTH + 50)
            .attr('y', 75); 

    svg.append('rect')
            .attr('class', 'figure-box')
            .attr('x', SizeTrack.TRACK_WIDTH + 40)
            .attr('y', 90)
            .attr('width', 90)
            .attr('height', 30)
            .attr('fill', 'rgba(255, 0, 0, 0.7)');

    svg.append('text')
            .attr('class', 'figure-name')
            .text('HbA1c')
            .attr('x', SizeTrack.TRACK_WIDTH + 50)
            .attr('y', 110); 

    svg.append('rect')
            .attr('class', 'figure-box')
            .attr('x', SizeTrack.TRACK_WIDTH + 135)
            .attr('y', 20)
            .attr('width', 35)
            .attr('height', 100)
            .attr('fill', 'rgba(255, 0, 0, 0.7)');

    svg.append('text')
            .attr('class', 'figure-name')
            .text('HbA1c')
            .attr('x', 40)
            .attr('y', -(SizeTrack.TRACK_WIDTH + 145))
            .attr('transform', 'rotate(90)'); 
  }

  componentDidMount() {
    this.drawChart();
    this.drawFigureBox();
  }

  render() {
    return (
      <svg id={this.props.name} className="bar-chart"/>
    );
  }
}
export default EventChart;