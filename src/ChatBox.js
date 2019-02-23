import React, { Component } from "react";
import { Input, Segment, Form, List } from "semantic-ui-react";

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 1,
      inputValue: "",
      messages: [
        <List.Item key={0}>Enter text and everyone can hear it!</List.Item>,
      ],
    };
  }

  updateInputValue = evt => {
    this.setState({
      inputValue: evt.target.value,
    });
  };

  onSubmit = () => {
    let messages = this.state.messages;
    messages.push(
      <List.Item key={this.state.key}>
        <List.Icon name="volume up" />
        <List.Content>{this.state.inputValue}</List.Content>
      </List.Item>,
    );
    this.props.sendToEncoder(this.state.inputValue);
    this.setState({ key: this.state.key + 1 });
    this.setState({ inputValue: "" });
  };

  receiveDecodeMessage = message => {
    let messages = this.state.messages;
    messages.push(
      <List.Item key={this.state.key}>
        <List.Icon name="microphone" />
        <List.Content>{message}</List.Content>
      </List.Item>,
    );
    this.setState({ key: this.state.key + 1 });
  };

  componentDidUpdate() {
    document.getElementById("message").scrollTop = document.getElementById(
      "message",
    ).scrollHeight;
  }
  render() {
    return (
      <div style={{ height: "80%" }}>
        <Segment
          id="message"
          style={{
            height: "60%",
            overflowY: "scroll",
            width: "60%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <List style={{ textAlign: "left" }}>{this.state.messages}</List>
        </Segment>
        <Form onSubmit={this.onSubmit}>
          <Input
            value={this.state.inputValue}
            action="Submit"
            placeholder="Enter text..."
            onChange={this.updateInputValue}
            maxLength="25"
          />
        </Form>
      </div>
    );
  }
}

export default ChatBox;
