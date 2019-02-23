var packet_delay = 1000; //ms
var bit_pulse_delay = 500; //ms

const freq_high = 3000; //hz
const freq_low = 2000; //hz

var word_length = 8;

var audioContext = new (window.AudioContext || window.webkitAudioContext)();

var oscillator = audioContext.createOscillator();
oscillator.start();

function send(str) {
  var char_index = 0;
  audioContext.resume();
  generate_bit(0);
  for (var i = 0; i < str.length; i++) {
    setTimeout(() => {
      //console.log(str.charCodeAt(char_index));
      generate_packet(str.charCodeAt(char_index));
      char_index++;
    }, (packet_delay + (word_length + 2) * bit_pulse_delay) * i);
  }

  console.log("change");
  for (let x = 0; x < str.length; x++) {
    console.log(packet_delay * x + bit_pulse_delay * (word_length + 2));
  }
  console.log(
    (packet_delay + (word_length + 2) * bit_pulse_delay) * str.length,
  );
  setTimeout(() => {
    //oscillator.disconnect();
  }, (packet_delay + (word_length + 2) * bit_pulse_delay) * str.length);
}

function generate_packet(value) {
  //Convert to Binary Array
  var bin = [];
  for (var i = 0; i < word_length; i++) {
    bin[i] = (value >> (word_length - 1 - i)) & 1;
  }
  console.log(bin);
  var byte_index = 0;
  //Transmit header
  generate_bit(1);
  setTimeout(function() {
    generate_bit(0);
    setTimeout(function() {
      //Transmit payload within nested timeout
      for (var i = 0; i < word_length; i++) {
        setTimeout(function() {
          generate_bit(bin[byte_index++]);
          //console.log(bin[i]);
        }, i * bit_pulse_delay);
      }
    }, bit_pulse_delay);
  }, bit_pulse_delay);

  //Set intermediate frequency to low_output
  setTimeout(function() {
    generate_bit(0);
  }, bit_pulse_delay * word_length + 2);
}

function generate_bit(bit) {
  generate_sine(bit == 1 ? freq_high : freq_low);
}

function generate_sine(freq) {
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
  oscillator.connect(audioContext.destination);
  //console.log(audioContext.currentTime);
}

export default send;
