import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';

import ROOTSTATE from '../../Interfaces';

import { getDatesBetween, formatDate, addDays } from '../../api';
import { updateZoomRange } from '../../Actions/zoomActions';

import './TimeBar.css';

interface Props {
  startTime: string;
  endTime: string;
  zoom?: [number, number];
  updateZoomRange?: (zoomRange: [number, number]) => void;
}

interface States {
  adjustPos: number;
  adjustLength: number;
}

const mapStateToProps = (state: ROOTSTATE, ownProps: Props) => ({
  zoom: state.zoom
});
const mapDispatchToProps = (dispatch: any) => ({ 
  updateZoomRange: (zoomRange: [number, number]) => {
    dispatch(updateZoomRange(zoomRange));
  },
});
const mergeProps = (stateProps: ROOTSTATE, dispatchProps: any, ownProps: Props) => ({
  ...ownProps,
  zoom: stateProps.zoom,
  updateZoomRange: dispatchProps.updateZoomRange
});

class TimeBar extends React.Component<any, States> {
  arrayPosition: number[] = [];
  leftEndPoint: number = 0;
  rightEndPoint: number = 740;
  isZoom: boolean = true;
  action: string = '';
  zoomLevel: number = 1;
  originalElementLength: number = 74;

  constructor() {
    super();
    this.state = {
      adjustPos: 0,
      adjustLength: 740
    };
  }

  drawDate(date: string, position: number, width: number) {
    var svg = d3.select('#date-bar');
    var groupDate = svg.append('g')
                      .attr('class', 'date-element')
                      .attr('transform', 'translate(' + (position + this.leftEndPoint) + ',0)');
    
    groupDate.append('rect')
            .attr('class', 'date-element-bkg')
            .attr('width', width);
    
    let textPosition = width / 2 - 29;
    if (Number(date.split('/')[2]) < 10) {
      textPosition += 10;
    }

    groupDate.append('text')
            .attr('class', 'date-element-text')
            .text(date)
            .attr('x', textPosition)
            .attr('y', 14);          
  }

  drawTimeBar(position: number, width: number) {
    var svg = d3.select('#time-bar');

    var x = d3.scaleLinear()
              .range([0, width])
              .domain([0, 24]);
    
    svg.append('g')
        .attr('class', 'time-element')
        .attr('transform', 'translate(' + (position +  + this.leftEndPoint) + ', 20)')
        .call(d3.axisBottom(x).tickValues([0, 4, 8, 12, 16, 20]));
  }

  drawAdjustBar() {
    var self = this;

    var svg = d3.select('#adjust-bar');

    svg.append('rect')
      .attr('id', 'adjust-pointer')
      .attr('width', this.state.adjustLength)
      .attr('transform', 'translate(' + this.state.adjustPos + ', 40)')
      .call(d3.drag()
        .on('drag', (d: any) => {
          if (self.state.adjustPos <= this.leftEndPoint && d3.event.dx < 0) { return; }
          if (self.state.adjustPos + self.state.adjustLength >= this.rightEndPoint && d3.event.dx > 0) { return; }
          this.action = 'move';
          self.setState({
            adjustPos: (self.state.adjustPos + d3.event.dx < this.leftEndPoint) ? 
                                  this.leftEndPoint : self.state.adjustPos + d3.event.dx
          });
          let start = (self.state.adjustPos + d3.event.dx < this.leftEndPoint) ? 
              this.leftEndPoint : self.state.adjustPos + d3.event.dx;
          let end = start + self.state.adjustLength;
          this.props.updateZoomRange([start / 740, end / 740]);
        }));

    svg.append('rect')
      .attr('id', 'adjust-pointer-left')
      .attr('class', 'adjust-pointer-y')
      .attr('transform', 'translate(' + (this.state.adjustPos - 3) + ', 40)')
      .call(d3.drag()
        .on('drag', (d: any) => {
          if (self.state.adjustPos <= this.leftEndPoint && d3.event.dx < 0) { return; }
          if (d3.event.dx > 0) {
            this.action = 'zoom in';
          } else if (d3.event.dx < 0) {
            this.action = 'zoom out';
          }
          self.setState({
            adjustPos: (self.state.adjustPos + d3.event.dx < this.leftEndPoint) ? 
                                this.leftEndPoint : self.state.adjustPos + d3.event.dx,
            adjustLength: self.state.adjustLength - d3.event.dx
          });
          let start = (self.state.adjustPos + d3.event.dx < this.leftEndPoint) ? 
              this.leftEndPoint : self.state.adjustPos + d3.event.dx;
          let end = start + self.state.adjustLength - d3.event.dx;
          this.props.updateZoomRange([start / 740, end / 740]);
        }));

    svg.append('rect')
      .attr('id', 'adjust-pointer-right')
      .attr('class', 'adjust-pointer-y')
      .attr('transform', 'translate(' + (this.state.adjustPos + this.state.adjustLength - 2) + ', 40)')
      .call(d3.drag()
        .on('drag', (d: any) => {
          if (self.state.adjustPos + self.state.adjustLength >= this.rightEndPoint && d3.event.dx > 0) { return; }
          if (d3.event.dx < 0) {
            this.action = 'zoom in';
          } else if (d3.event.dx > 0) {
            this.action = 'zoom out';
          }
          self.setState({
            adjustLength: (self.state.adjustLength + d3.event.dx > this.rightEndPoint) ? 
                              this.rightEndPoint : self.state.adjustLength + d3.event.dx
          });
          let start = self.state.adjustPos;
          let length = (self.state.adjustLength + d3.event.dx > this.rightEndPoint) ? 
              this.rightEndPoint : self.state.adjustLength + d3.event.dx;
          let end = start + length;
          this.props.updateZoomRange([start / 740, end / 740]);
        }));
  }

  updateAllBar() {
    var self = this;

    d3.select('#adjust-bar').select('#adjust-pointer')
      .attr('width', this.state.adjustLength)
      .attr('transform', 'translate(' + self.state.adjustPos + ', 40)');
    
    d3.select('#adjust-bar').select('#adjust-pointer-left')
      .attr('transform', 'translate(' + (self.state.adjustPos - 3) + ', 40)');

    d3.select('#adjust-bar').select('#adjust-pointer-right')
      .attr('transform', 'translate(' + (self.state.adjustPos + self.state.adjustLength - 2) + ', 40)');

    let dayBetweens = getDatesBetween(new Date(this.props.startTime), new Date(this.props.endTime));
    let newWidth = this.originalElementLength / (this.state.adjustLength) * this.rightEndPoint / this.zoomLevel;

    if (this.isZoom && this.action === 'zoom in' && 
        newWidth > this.originalElementLength * 2) {
      d3.select('#date-bar').selectAll('*').remove();
      d3.select('#time-bar').selectAll('*').remove();
      this.zoomLevel = this.zoomLevel * 2;
      
      let temp = Math.floor(dayBetweens.length / 10 / this.zoomLevel) + 1;
      if (Math.floor(dayBetweens.length / 10 / (this.zoomLevel / 2)) === 0) {
        temp = 0;
      }

      let run = 0;
      this.arrayPosition = [];
      for (i = 0; i < dayBetweens.length; i++) {
        if (temp !== 0 && i % temp !== 0) { 
          continue;
        }
        this.arrayPosition.push(run * this.originalElementLength);
        this.drawDate(formatDate(dayBetweens[i]), run * this.originalElementLength, this.originalElementLength);
        if (temp - 1 === 0) {
          this.drawTimeBar(run * this.originalElementLength, this.originalElementLength);
        }
        run++;
      }

      // console.log(this.arrayPosition.length)
      if (this.arrayPosition.length === dayBetweens.length) {
        this.isZoom = false;
      }
    
      run = 1;
      while (run < 30) {
        let nextDate = addDays(dayBetweens[i - 1], (temp) * run);
        this.arrayPosition.push(run * this.originalElementLength);
        this.drawDate(formatDate(nextDate.toString()), run * this.originalElementLength, this.originalElementLength);
        run++;
      }
    } else if (this.action === 'zoom out' && 
        newWidth <= this.originalElementLength / 2 + 30) {
      d3.select('#date-bar').selectAll('*').remove();
      d3.select('#time-bar').selectAll('*').remove();
      this.zoomLevel = this.zoomLevel / 2;
      
      let temp = Math.ceil(dayBetweens.length / 10 / this.zoomLevel);
      if (temp % 2 !== 0) {
        temp++;
      }

      let run = 0;
      this.arrayPosition = [];
      for (i = 0; i < dayBetweens.length; i++) {
        if (temp !== 0 && i % temp !== 0) { 
          continue;
        }
        this.arrayPosition.push(run * this.originalElementLength);
        this.drawDate(formatDate(dayBetweens[i]), run * this.originalElementLength, this.originalElementLength);
        run++;
      }

      if (this.arrayPosition.length !== dayBetweens.length) {
        this.isZoom = true;
      }

      run = 1;
      if (temp % 2 === 0) {
        temp--;
      }
      while (run < 30) {
        let nextDate = addDays(dayBetweens[i - 1], (temp) * run);
        this.arrayPosition.push(run * this.originalElementLength);
        this.drawDate(formatDate(nextDate.toString()), run * this.originalElementLength, this.originalElementLength);
        run++;
      }
    } else {
      let length = this.arrayPosition.length;
      this.arrayPosition = [];
      for (var i = 0; i < length; i++) {
        this.arrayPosition.push(i * newWidth);
      }

      let listDateElement = d3.select('#date-bar').selectAll('.date-element');
      listDateElement.data(this.arrayPosition)
        .attr('transform', function(d: any){
            return 'translate(' + (d - self.state.adjustPos / self.state.adjustLength 
              * self.rightEndPoint) + ', 0)';
        });
      listDateElement.select('.date-element-bkg').attr('width', newWidth);
      let textPosition = newWidth / 2 - 29;
      if (Number(listDateElement.select('.date-element-text').text().split('/')[2]) < 10) {
        textPosition += 10;
      }
      listDateElement.select('.date-element-text').attr('x', textPosition);
      
      let listTimeElement = d3.select('#time-bar').selectAll('.time-element');
      let x = d3.scaleLinear().range([0, newWidth]).domain([0, 24]);
      listTimeElement.data(this.arrayPosition)
        .attr('transform', function(d: any){
            return 'translate(' 
              + (d - self.state.adjustPos / self.state.adjustLength * self.rightEndPoint - 0.5) + ', 20)';
        })
        .call(d3.axisBottom(x).tickValues([0, 4, 8, 12, 16, 20, 0]));
    }
  }

  componentWillReceiveProps(props: Props) { 
    d3.select('#date-bar').selectAll('*').remove();
    d3.select('#time-bar').selectAll('*').remove();
    d3.select('#adjust-bar').selectAll('*').remove();

    let dayBetweens = getDatesBetween(new Date(props.startTime), new Date(props.endTime));
    
    let temp = Math.floor(dayBetweens.length / 10 / this.zoomLevel) + 2;
    let run = 0;
    for (var i = 0; i < dayBetweens.length; i++) {
      if (i % temp !== 0) { 
        continue;
      }
      this.arrayPosition.push(run * this.originalElementLength);

      if (dayBetweens[i].getFullYear() === 2001) {
        dayBetweens[i].setFullYear(dayBetweens[i].getFullYear() - 2000);
      }

      this.drawDate(formatDate(dayBetweens[i]), run * this.originalElementLength, this.originalElementLength);
      // this.drawTimeBar(run * elementLength, elementLength);
      run++;
    }

    let nextDate = addDays(dayBetweens[i - 1], temp - 1);
    this.arrayPosition.push(run * this.originalElementLength);
    this.drawDate(formatDate(nextDate.toString()), run * this.originalElementLength, this.originalElementLength);
    // this.drawTimeBar(run * elementLength, elementLength);
    
    this.drawAdjustBar();
  }

  componentWillUpdate() {
    this.updateAllBar();
  }

  render() {
    return (
      <svg className="time-bar" y="-20">
        <rect x="0" y="20" width="740" height="20" fill="#393e44"/>
        <svg id="date-bar" className="time-bar-element" />
        <svg id="time-bar" className="time-bar-element"/>
        <svg id="adjust-bar" className="time-bar-element"/>     
      </svg>
    );
  }
}

// export default TimeBar;
const TimeBarContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(TimeBar);
export default TimeBarContainer;