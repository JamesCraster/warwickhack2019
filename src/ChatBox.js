import React, { Component } from "react";
import { Input, Header, Menu, Segment } from "semantic-ui-react";

class ChatBox extends Component {
  render() {
    return (
      <div>
        <Segment>Pellentesque habitant morbi tristique senectus.</Segment>
        <Input action="Submit" placeholder="Enter text..." />
      </div>
    );
  }
}

export default ChatBox;
