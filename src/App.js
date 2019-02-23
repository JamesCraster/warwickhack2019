import React, { Component } from "react";
import { Input, Header, Menu, Segment } from "semantic-ui-react";
import ChatBox from "./ChatBox";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Menu inverted fluid>
          <Menu.Item header>Talking-2.0</Menu.Item>
        </Menu>
        <Header as="h1">Talking-2.0</Header>
        <ChatBox />
      </div>
    );
  }
}

export default App;
