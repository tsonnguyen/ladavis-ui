import * as React from 'react';
import './Login.css';

interface Props {

}

interface States {
  username: string;
  password: string;
  error: boolean;
}

export default class Header extends React.Component<Props, States> {
  constructor (props: Props) {
    super(props);
  
    this.state = {
      username: '',
      password: '',
      error: false
    };
  }

  onLogin = () => {
    if (this.state.username === 'john' && this.state.password === 'admin') {
      window.location.href = '/profile';
    } else {
      this.setState({
        error: true
      });
    }
  }

  render () {
    return(
      <div className="login-background">
        <div className="login-container">
          <div className="login-title">DIA<b>VIS</b></div>
          <div className="login-field" style={{borderBottom: '1px solid black'}}>
            <div className="login-field-picture login-pic-ava"><img src={require('./img/ava.png')}/></div>
            <div className="login-field-value">
              <input 
                placeholder="Username"
                value={this.state.username}
                onChange={(e) => this.setState({username: e.target.value})}
              />
            </div>
          </div>
          <div className="login-field">
            <div className="login-field-picture login-pic-key"><img src={require('./img/key.png')}/></div>
            <div className="login-field-value">
              <input 
                placeholder="Password"
                type="password"
                value={this.state.password}
                onChange={(e) => this.setState({password: e.target.value})}
              />
            </div>
          </div>
          <div className="login-button" onClick={this.onLogin}>LOGIN</div>
          {(this.state.error) ?
            <div className="login-error">Wrong username or password.<br/>Please try again.</div>
          : null}
        </div>
      </div>
    );
  } 
}
  