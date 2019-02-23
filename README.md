# Talking 2.0
### WarwickHACK 2019

Send data using ultrasonic sound!

The user sends a message, which is encoded in ASCII, over a custom serial protocol using frequency shift keying of ultrasonic sound. The morse code is played out loud, which the decoder can then hear and turn back into ASCII, then into text.

The interface is built in React using Semantic UI. The encoder and decoder use the webkit AudioContext interface.

# Team

- [Sporech](https://github.com/Sporech): Audio encoder
- [James Craster](https://github.com/JamesCraster): Interface with React and Semantic UI
- [Daniel Spencer](https://github.com/danielfspencer): Audio decoder
- [William Russell](https://github.com/wrussell1999): Getting everything to work with each other.



# Encoder
![Screenshot](screenshot.png)


# Decoder
![Screenshot](decoder-screenshot.png)
