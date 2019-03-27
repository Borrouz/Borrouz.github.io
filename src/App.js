import React, { Component } from 'react';

import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import firebase from 'firebase';

import Levels from '../src/Levels/Levels';
import './App.css';
// import Form from './components/Form';
// import Monitor from './components/Monitor/Monitor';
// import Validation from './Validation/Validation';

import Registration from './Registration/Registration';
import LevelScreen from './components/LevelScreen/LevelScreen';

class App extends Component {
  componentDidMount() {
    const {history} = this.props;

    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        console.log("Logined");
        history.push('/')
      } else {
        console.log("Not logined");
        history.push('/login')
      }
    })
  }
  render() {
    const { levelName } = this.props;

    return (
      <div className="App">
      {/* <Validation/> */}
        <Switch>
          <Route exact path="/" component={Levels} />
          <Route path={`/:id`} component={LevelScreen} />
          <Route path='/login' component={Registration} />
        </Switch>
        {/* <Form /> */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    levelName: state.selected.title
  };
}

export default withRouter(connect(mapStateToProps)(App));
