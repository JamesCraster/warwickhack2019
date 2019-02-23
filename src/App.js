import React, { Component } from "react";
import { Input, Header, Menu } from "semantic-ui-react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Menu inverted fluid>
          <Menu.Item header>Talking-2.0</Menu.Item>
        </Menu>
        <Header as="h1">Talking-2.0</Header>
        <Input action="Submit" placeholder="Enter text..." />
      </div>
    );
  }
}

export default App;
