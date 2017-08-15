import React, { Component } from 'react';
import { getKeysFromBitmap, encrypt, decrypt } from './util';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }
  handleImage(e) {
    e.preventDefault();
    
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      const ctx = document.getElementById('canvas').getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const bitmap = ctx.getImageData(0, 0, img.width, img.height);
        const keys = getKeysFromBitmap(bitmap);
        this.setState({
          keys
        });
      };            
      this.setState({
        imagePreviewUrl: reader.result
      });
      img.src = reader.result;
    }
    
    if (file) {
      reader.readAsDataURL(file);
    }
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Encryption using images as the key</h2>
        </div>
        <div className="App-body">
          <h3>Select an image</h3>
          <input type="file" accept="image/*" onChange={this.handleImage.bind(this)} />
          <canvas id="canvas" />
          {
            this.state.imagePreviewUrl && <img src={this.state.imagePreviewUrl} className="preview" alt="preview" />
          }
          <h3>Enter message or ciphertext</h3>
          <textarea ref={el => this.message1 = el} />
          <h3>Select encrypt or decrypt</h3>
          <button onClick={() => this.message2.value = encrypt(this.message1.value, this.state.keys)}>Encrypt</button>
          <span className="or"> OR </span>
          <button onClick={() => this.message2.value = decrypt(this.message1.value, this.state.keys)}>Decrypt</button>
          <br />
          <br />
          <textarea ref={el => this.message2 = el} />          
        </div>
      </div>
    );
  }
}

export default App;
