import * as React from 'react';
import * as d3 from 'd3';

import { POINT } from '../../../Interfaces';
import { convertedTime } from  '../../../API';
import * as SizeTrack from '../SizeTrack';

import './LineChart.css';

interface Props {
  name: string;
  title: string;
  value: POINT[];
  range: [number, number];
  unit: string;
  color: string;
  position: number;
}

interface States {

}

class LineChart extends React.Component<Props, States> {
  constructor() {
    super();
  }

  drawChart(data: Object[], range: [number, number], color: string) {
    var self = this;

    // var data: Object[] = [
    //   [Date.parse('2013-03-12 15:09:04') * 25 / 9 / 10000000 / 4, 20], 
    //   [Date.parse('2013-03-12 16:09:04') * 25 / 9 / 10000000 / 4, 90],
    //   [Date.parse('2013-03-12 17:09:04') * 25 / 9 / 10000000 / 4, 50],
    //   [Date.parse('2013-03-12 18:09:04') * 25 / 9 / 10000000 / 4, 90]
    // ];

    // var data2 = [
    //   [Date.parse('2013-03-12 15:09:04') * 25 / 9 / 10000000 / 4, 70], 
    //   [Date.parse('2013-03-12 16:09:04') * 25 / 9 / 10000000 / 4, 30],
    //   [Date.parse('2013-03-12 17:09:04') * 25 / 9 / 10000000 / 4, 80],
    //   [Date.parse('2013-03-12 18:09:04') * 25 / 9 / 10000000 / 4, 50]
    // ];

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = SizeTrack.TRACK_WIDTH - margin.left - margin.right,
    height = SizeTrack.TRACK_HEIGHT - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
        .x(function(d: any) { return x(Number(convertedTime(d.time))); })
        .y(function(d: any) { return y(Number(d.value)); });
    
    // var valueline = d3.line()
    //     .x(function(d: any) { return x(d[0]); })
    //     .y(function(d: any) { return y(d[1]); });

    // var valueline2 = d3.line()
    //     .x(function(d: any) { return x(d[0]); })
    //     .y(function(d: any) { return y(d[1]); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select('#' + self.props.name).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Scale the range of the data
    x.domain([292780, 293190]);
    y.domain(range);

    // Add the valueline path.
    svg.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', valueline)
        .attr('stroke', color)
        .attr('stroke-width', '1px')
        .attr('fill', 'none');
    
    // svg.append('path')
    //     .data([data2])
    //     .attr('class', 'line')
    //     .attr('d', valueline2)
    //     .attr('stroke', 'blue')
    //     .attr('stroke-width', '1px')
    //     .attr('fill', 'none');

    // // Add the X Axis
    // svg.append('g')
    //     .attr('transform', 'translate(0,' + height + ')')
    //     .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append('g')
        .call(d3.axisLeft(y).ticks(5, 's'));
  }

  drawFigureBox(color: string, unit: string) {
    var svg = d3.select('#' + this.props.name);
    svg.append('text')
            .attr('class', 'figure-value')
            .text('822')
            .attr('x', SizeTrack.TRACK_WIDTH + 40)
            .attr('y', 55); 

    svg.append('text')
            .attr('class', 'figure-unit')
            .text(unit)
            .attr('x', SizeTrack.TRACK_WIDTH + 125)
            .attr('y', 55); 

    svg.append('rect')
            .attr('class', 'figure-box')
            .attr('x', SizeTrack.TRACK_WIDTH + 40)
            .attr('y', 65)
            .attr('width', 130)
            .attr('height', 55)
            .attr('fill', color);

    svg.append('text')
            .attr('class', 'figure-name')
            .text(this.props.title)
            .attr('x', SizeTrack.TRACK_WIDTH + 50)
            .attr('y', 85); 
  }

  componentWillReceiveProps(props: Props) {
    this.drawChart(props.value, props.range, props.color);
    this.drawFigureBox(props.color, props.unit);
  }

  render() {
    return (
      <svg id={this.props.name} className="line-chart"/>
    );
  }
}
export default LineChart;