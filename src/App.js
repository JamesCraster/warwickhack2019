import React, { Component } from "react";
import { Input, Header, Menu, Segment } from "semantic-ui-react";
import ChatBox from "./ChatBox";

class App extends Component {
  render() {
    return (
      <div className="App" style={{ textAlign: "center", height: "100%" }}>
        <Menu inverted fluid>
          <Menu.Item header>
            <img src="logo-full.png" />
          </Menu.Item>
          <Menu.Item header>Talking-2.0</Menu.Item>
        </Menu>
        <Header as="h1">Talking-2.0</Header>
        <ChatBox /*sendToEncoder={string_to_ascii}*/ />
      </div>
    );
  }
}

/*var packet_delay = 1000; //ms
var bit_pulse_delay = 500; //ms

var freq_high = 2000; //hz
var freq_low = 1000; //hz

var audioContext = new (window.AudioContext || window.webkitAudioContext)();

var oscillator = audioContext.createOscillator();

function string_to_ascii(value) {
  console.log(value);
  
  for (let i = 0; i < value.length; i++) {
    generate_packet(value[i].charCodeAt(0));
  }
}

function generate_packet(value) {
  var bin = [];
  for (var i = 0; i < 8; i++) {
    bin[i] = (value >> i) & 1;
  }

  //Transmit header
  generate_bit(1);

  setTimeout(function () {
    //Transmit payload
    for (var i = 0; i < 8; i++) {
      setTimeout(function () {
        generate_bit(bin[i]);
      }, i * bit_pulse_delay);
    }
    stop_oscillator();
  }, bit_pulse_delay);
}

function generate_bit(bit) {
  generate_sine(bit == 1 ? freq_high : freq_low);
}

function generate_sine(freq) {
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
  oscillator.connect(audioContext.destination);
  oscillator.start();
}

function stop_oscillator() {
  oscillator.stop();
}
*/
export default App;
