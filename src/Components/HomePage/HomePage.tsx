import * as React from 'react';

import Track from '../Track/Track';

import './HomePage.css';

class Home extends React.Component<{}, {}> {
  constructor() {
    super();
  }

  render() {
    return (
      <div style={{height: '100%'}}>
        <Track type={'bar-chart'} position={100}/>
        <Track type={'line-chart'} position={300}/>
        <Track type={'event-chart'} position={500}/>
        <Track type={'timeline-chart'} position={700}/>
      </div>
    );
  }
}
export default Home;