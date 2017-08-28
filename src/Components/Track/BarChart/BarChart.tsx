import * as React from 'react';
import * as d3 from 'd3';

import { POINT } from '../../../Interfaces';
import { convertedTime } from  '../../../API';
import * as SizeTrack from '../SizeTrack';

import './BarChart.css';

interface Props {
  name: string;
  title: string;
  title2: string;
  value: POINT[];
  value2: POINT[];
  position: number;
}

interface States {

}

class BarChart extends React.Component<Props, States> {
  constructor() {
    super();
  }

  drawChart(data1: Object[], data2: Object[]) {
    var self = this;

    // var data = [
    //   [1, 20, 80], 
    //   [2, 20, 80], 
    //   [3, 40, 20],
    //   [5, 50, 10],
    //   [10, 20, 80]
    // ];

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
    x.domain([292810, 292813]);
    y.domain([0, 200]);

    // append the rectangles for the bar chart
    svg.selectAll('.bar')
        .data(data1)
        .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', function(d: any) { return x(Number(convertedTime(d.time))); })
          .attr('width', '10px')
          .attr('y', function(d: any) { return y(Number(d.value)); })
          .attr('height', function(d: any) { return height - y(Number(d.value)); })
          .attr('transform', 'translate(-10,0)');
    
    svg.selectAll('.bar2')
        .data(data2)
        .enter().append('rect')
          .attr('class', 'bar2')
          .attr('x', function(d: any) { return x(Number(convertedTime(d.time))); })
          .attr('width', '10px')
          .attr('y', function(d: any) { return y(Number(d.value)); })
          .attr('height', function(d: any) { return height - y(Number(d.value)); })
          .attr('transform', 'translate(0,0)');

    // add the x Axis
    // svg.append('g')
    //     .attr('transform', 'translate(0,' + height + ')')
    //     .call(d3.axisBottom(x));

    // add the y Axis
    svg.append('g')
        .attr('transform', 'translate(0, 0)')
        .call(d3.axisLeft(y).ticks(5, 's'));
  }

  drawFigureBox() {
    var svg = d3.select('#' + this.props.name);
    svg.append('text')
        .attr('class', 'figure-value-1')
        .text('822')
        .attr('x', SizeTrack.TRACK_WIDTH + 40)
        .attr('y', 35); 

    svg.append('text')
        .attr('class', 'figure-value-2')
        .text('822')
        .attr('x', SizeTrack.TRACK_WIDTH + 40)
        .attr('y', 90); 

    svg.append('text')
        .attr('class', 'figure-unit')
        .text('mmHg')
        .attr('x', SizeTrack.TRACK_WIDTH + 85)
        .attr('y', 35); 

    svg.append('text')
        .attr('class', 'figure-unit')
        .text('mmHg')
        .attr('x', SizeTrack.TRACK_WIDTH + 85)
        .attr('y', 90); 

    svg.append('rect')
        .attr('class', 'figure-box')
        .attr('x', SizeTrack.TRACK_WIDTH + 40)
        .attr('y', 40)
        .attr('width', 130)
        .attr('height', 25)
        .attr('fill', 'rgba(255, 0, 0, 0.7)');

    svg.append('rect')
        .attr('class', 'figure-box')
        .attr('x', SizeTrack.TRACK_WIDTH + 40)
        .attr('y', 95)
        .attr('width', 130)
        .attr('height', 25)
        .attr('fill', 'rgba(0, 0, 255, 0.7)');

    svg.append('text')
        .attr('class', 'figure-name')
        .text(this.props.title)
        .attr('x', SizeTrack.TRACK_WIDTH + 50)
        .attr('y', 59); 

    svg.append('text')
        .attr('class', 'figure-name')
        .text(this.props.title2)
        .attr('x', SizeTrack.TRACK_WIDTH + 50)
        .attr('y', 114); 
  }

  componentWillReceiveProps(props: Props) {
    this.drawChart(props.value, props.value2);
    this.drawFigureBox();
  }

  render() {
    return (
      <svg id={this.props.name} className="bar-chart"/>
    );
  }
}
export default BarChart;