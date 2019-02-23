import React, { Component } from "react";
import { Input, Header, Menu, Segment, List } from "semantic-ui-react";

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
  }
  onMessage = () => {};
  render() {
    return (
      <div>
        <Segment>
          <List>
            <List.Item>
              Pellentesque habitant morbi tristique senectus.
            </List.Item>
          </List>
        </Segment>
        <Input action="Submit" placeholder="Enter text..." />
      </div>
    );
  }
}

export default ChatBox;
