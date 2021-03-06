import React, { Component } from "react";
import { Header, Menu } from "semantic-ui-react";
import ChatBox from "./ChatBox";
import send from "./audio/encoder";

class App extends Component {
  render() {
    return (
      <div className="App" style={{ textAlign: "center", height: "100%" }}>
        <Menu inverted fluid>
          <Menu.Item header>
            <img src="logo-white.png" alt="Logo" />
          </Menu.Item>
          <Menu.Item header>Talking 2.0</Menu.Item>
        </Menu>
        <Header as="h1">Talking 2.0</Header>
        <p style={{ fontStyle: "italic" }}>Even better than talking</p>
        <ChatBox sendToEncoder={send} />
      </div>
    );
  }
}

export default App;
