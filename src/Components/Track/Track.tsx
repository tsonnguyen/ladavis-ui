import * as React from 'react';

import LineChart from './LineChart/LineChart';
import BarChart from './BarChart/BarChart';
import EventChart from './EventChart/EventChart';
import TimelineChart from './TimelineChart/TimelineChart';

import './Track.css';

interface Props {
  type: string;
  name: string;
  position: number;
}

interface States {

}

class Track extends React.Component<Props, States> {

  constructor() {
    super();
  }

  renderLineChart() {
    return (
      <LineChart name={this.props.name} position={50}/>
    );
  }

  renderBarChart() {
    return (
      <BarChart name={this.props.name} position={350}/>
    );
  }

  renderEventChart() {
    return (
      <EventChart name={this.props.name} position={650}/>
    );
  }

  renderTimelineChart() {
    return (
      <TimelineChart name={this.props.name} position={650}/>
    );
  }

  renderTrackBorder() {
    return (
      <rect 
        className="track-border" 
        x="50" 
        y="20.5" 
        transform="translate(0,0)" 
      />
    );
  }

  renderTrackDrag() {
    return (
      <rect 
        className="track-drag" 
        x="800" 
        y="20.5" 
        transform="translate(0,0)" 
      />
    );
  }

  render() {
    let renderComponent = null;
    switch (this.props.type) {
    case 'bar-chart':
        renderComponent = this.renderBarChart();
        break;
    case 'line-chart':
        renderComponent = this.renderLineChart();
        break;
    case 'event-chart':
        renderComponent = this.renderEventChart();
        break;
    case 'timeline-chart':
        renderComponent = this.renderTimelineChart();
        break;
    default:
        renderComponent = null;
    }

    return (
      <svg className="track" y={this.props.position}>
        {this.renderTrackBorder()}
        {this.renderTrackDrag()}
        {renderComponent}  
      </svg>
    );
  }
}
export default Track;