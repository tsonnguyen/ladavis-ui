import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';

import ROOTSTATE, { PATIENT, EVENT } from '../../../Interfaces';
import { convertedTime } from  '../../../api';
import * as SizeTrack from '../SizeTrack';

import './EventChart.css';

interface Props {
  name: string;
  title: string;
  title2: string;
  value: EVENT[];
  value2: EVENT[];
  position: number;
  patient?: PATIENT;
  zoom?: [number, number];
}

interface States {

}

const mapStateToProps = (state: ROOTSTATE, ownProps: Props) => ({
  patient: state.patient,
  zoom: state.zoom
});
const mapDispatchToProps = (dispatch: any) => ({ });
const mergeProps = (stateProps: ROOTSTATE, dispatchProps: any, ownProps: Props) => ({
  ...ownProps,
  patient: stateProps.patient,
  zoom: stateProps.zoom
});

class EventChart extends React.Component<any, States> {
  constructor() {
    super();
  }

  drawChart(data1: Object[], data2: Object[], timeRange: [number, number]) {
    var self = this;

    // var data = [
    //   [1, 1, 80], 
    //   [3, 0, 20],
    //   [5, 1, 10],
    //   [7, 1, 80]
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
        .attr('class', 'event-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
          .attr('transform', 
                'translate(' + margin.left + ',' + margin.top + ')');

    // Scale the range of the data in the domains
    x.domain([timeRange[0], timeRange[1]]);
    y.domain([0, 3]);

    // append the rectangles for the bar chart
    svg.selectAll('.bar')
        .data(data1)
        .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', function(d: any) { return x(Number(convertedTime(d.startdate))); })
          .attr('y', function(d: any) { return y(2.8); })
          .attr('width', '10px') 
          .attr('height', '10px')
          .attr('transform', 'translate(-5,0)');

    svg.selectAll('.bar2')
        .data(data2)
        .enter().append('rect')
          .attr('class', 'bar2')
          .attr('x', function(d: any) { return x(Number(convertedTime(d.startdate))); })
          .attr('y', function(d: any) { return y(1.7); })
          .attr('width', '10px')
          .attr('height', '10px')
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
            .text(this.props.title)
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
            .text(this.props.title2)
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
            .text('')
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
            .text('')
            .attr('x', 40)
            .attr('y', -(SizeTrack.TRACK_WIDTH + 145))
            .attr('transform', 'rotate(90)'); 
  }

  componentWillReceiveProps(props: Props) {
    if (this.props.patient.info.id === '' && props && props.patient) {
      let timeRange = [convertedTime(props.patient.info.admittime), 
        convertedTime(props.patient.info.dischtime)] as [number, number];

      this.drawChart(props.value, props.value2, timeRange);
      this.drawFigureBox();
    } else {
      let start = convertedTime(this.props.patient.info.admittime);
      let end = convertedTime(this.props.patient.info.dischtime);
      let zoom = (props.zoom) ? props.zoom : [0, 100];
      let timeRange = [start + (end - start) * zoom[0], 
                      start + (end - start) * zoom[1]] as [number, number];

      d3.select('#' + this.props.name).selectAll('.event-chart').remove();

      this.drawChart(props.value, props.value2, timeRange);

    }
  }

  render() {
    return (
      <svg id={this.props.name} className="bar-chart"/>
    );
  }
}

// export default EventChart;
const EventChartContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(EventChart);
export default EventChartContainer;