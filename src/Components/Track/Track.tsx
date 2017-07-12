import * as React from 'react';

import LineChart from './LineChart/LineChart';
import BarChart from './BarChart/BarChart';
import EventChart from './EventChart/EventChart';
import TimelineChart from './TimelineChart/TimelineChart';

import './Track.css';

interface TrackProps {
  type: string;
  position: number;
}

interface TrackState {

}

class Track extends React.Component<TrackProps, TrackState> {
  constructor() {
    super();
  }

  renderLineChart() {
    return (
      <div>
        <LineChart name={'line-chart'} position={50}/>
      </div>
    );
  }

  renderBarChart() {
    return (
      <div>
        <BarChart name={'bar-chart'} position={350}/>
      </div>
    );
  }

  renderEventChart() {
    return (
      <div>
        <EventChart name={'event-chart'} position={650}/>
      </div>
    );
  }

  renderTimelineChart() {
    return (
      <div>
        <TimelineChart name={'timeline-chart'} position={650}/>
      </div>
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
      <div className="track" style={{top: this.props.position}}>
        {renderComponent}
      </div>
    );
  }
}
export default Track;