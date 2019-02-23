var packet_delay = 1000; //ms
var bit_pulse_delay = 500; //ms

var freq_high = 2000; //hz
var freq_low = 1000; //hz

var word_length = 8;

var audioContext = new (window.AudioContext || window.webkitAudioContext)();

var oscillator = audioContext.createOscillator();
oscillator.start();

function send(str) {
  audioContext.resume();
  generate_bit(0);
  for (var i = 0; i < str.length; i++) {
    setTimeout(function() {
      generate_packet(str.charCodeAt(i));
    },packet_delay*i + bit_pulse_delay*(word_length+2));
  }
  oscillator.disconnect();
}

function generate_packet(value) {
  //Convert to Binary Array
  var bin = [];
  for (var i = 0; i < word_length; i++) {
    bin[i] = (value >> i) & 1;
  }

  //Transmit header
  generate_bit(1);
  setTimeout(function () {
    generate_bit(0);
    setTimeout(function () {
      //Transmit payload within nested timeout
      for (var i = 0; i < word_length; i++) {
        setTimeout(function () {
          generate_bit(bin[i]);
        }, i * bit_pulse_delay);
      }
    }, bit_pulse_delay);
  },bit_pulse_delay);

  //Set intermediate frequency to low_output
  setTimeout(function() {
    generate_bit(0);
  },bit_pulse_delay*word_length+2);
}

function generate_bit(bit) {
  generate_sine(bit == 1 ? freq_high : freq_low);
}

function generate_sine(freq) {
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
  oscillator.connect(audioContext.destination);
}

export default send;
