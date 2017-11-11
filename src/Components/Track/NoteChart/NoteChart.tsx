import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';

import ROOTSTATE, { PATIENT, EVENT } from '../../../Interfaces';
import { convertedTime, formatDate } from  '../../../api';
import * as SizeTrack from '../SizeTrack';

import './NoteChart.css';

interface Props {
  name: string;
  title: string;
  value: EVENT[];
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

class NoteChart extends React.Component<any, States> {
  constructor() {
    super();
  }

  drawChart(data: Object[], timeRange: [number, number], name: string) {
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
    var svg = d3.select('#' + name).append('svg')
        .attr('class', 'note-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
          .attr('clip-path', 'url(#clipPath-' + name + ')')
          .attr('transform', 
                'translate(' + margin.left + ',' + margin.top + ')');

    x.domain([timeRange[0], timeRange[1]]);
    y.domain([0, 3]);

    svg.append('defs').append('pattern')
      .attr('id', 'notebg')
      .append('image')
        .attr('src', require('./note.png'))
        .attr('width', 4)
        .attr('height', 4);

    svg.selectAll('.note-bar')
        .data(data)
        .enter().append('image')
          .attr('class', 'note-bar')
          .attr('xlink:href', require('./note.png'))
          .attr('x', function(d: any) { return x(Number(convertedTime(d.time))); })
          .attr('y', function(d: any) { return y(1.7); })
          .attr('width', '20px') 
          .attr('height', '20px')
          .attr('transform', 'translate(-5,0)')
          .on('mousedown', function(d: any) { 
            var idHTML = document.getElementById('note-patient-id');
            if (idHTML) {
              idHTML.innerHTML = '<strong>PATIENT ID</strong>: ' + self.props.patient.info.id;
            }

            var desHTML = document.getElementById('note-patient-des');
            if (desHTML) {
              desHTML.innerHTML = '<strong>DESCRIPTION</strong>: ' + d.description;
            }

            var timeHTML = document.getElementById('note-patient-time');
            if (timeHTML) {
              timeHTML.innerHTML = '<strong>RECORDED TIME</strong>: ' + formatDate(d.time, false);
            }

            var catHTML = document.getElementById('note-patient-cat');
            if (catHTML) {
              catHTML.innerHTML = '<strong>CATEGORY</strong>: ' + d.category;
            }

            var textHTML = document.getElementById('note-patient-text');
            if (textHTML) {
              textHTML.innerHTML = d.text;
            }

            var notePatientHTML = document.getElementById('note-patient');
            if (notePatientHTML) {
              notePatientHTML.style.display = 'block';
            }
          });
  }

  drawFigureBox() {
    var svg = d3.select('#' + this.props.name);
    svg.append('rect')
            .attr('class', 'figure-box')
            .attr('x', SizeTrack.TRACK_WIDTH + 40)
            .attr('y', 20)
            .attr('width', 130)
            .attr('height', 100)
            .attr('fill', 'rgba(0, 0, 255, 0.7)');

    svg.append('text')
            .attr('class', 'figure-name')
            .text(this.props.title)
            .attr('x', SizeTrack.TRACK_WIDTH + 78)
            .attr('y', 75);
  }

  componentDidMount() {
    d3.select('#' + this.props.name).selectAll('.note-chart').remove();

    if (this.props.value.length !== 0) {
      let start = convertedTime((this.props.patient as any).info.admittime);
      let end = convertedTime((this.props.patient as any).info.dischtime);
      
      let zoom = (this.props.zoom) ? this.props.zoom : [0, 1];

      let value = this.props.value;
      let timeRange = [start + (end - start) * zoom[0], 
          start + (end - start) * zoom[1]] as [number, number];

      this.drawChart(value, timeRange, this.props.name);
    }
  }

  componentWillReceiveProps(props: Props) {
    d3.select('#' + this.props.name).selectAll('.note-chart').remove();
    
    let name;
    if (props.name.includes('top')) {
      name = props.name;
    } else {
      name = this.props.name;
    }

    if (props.value.length !== 0) {
      let value = props.value;
      // let unit = props.unit;

      let start = convertedTime((props.patient as any).info.admittime);
      let end = convertedTime((props.patient as any).info.dischtime);

      let zoom = (props.zoom) ? props.zoom : [0, 1];
      let timeRange = [start + (end - start) * zoom[0], 
            start + (end - start) * zoom[1]] as [number, number];
    
      this.drawChart(value, timeRange, name);
      // this.drawFigureBox(color, color2 , unit);
    } 
  }

  render() {
    return (
      <svg id={this.props.name} className="bar-chart"/>
    );
  }
}

// export default NoteChart;
const NoteChartContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(NoteChart);
export default NoteChartContainer;