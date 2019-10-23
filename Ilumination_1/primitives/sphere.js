class Sphere {
    static initBuffers(gl) {
      var positionBuffer;
      var normalBuffer;
      var textureCoordBuffer;
      var indexBuffer;
  
      var latitudeBands = 30;
      var longitudeBands = 30;
      var radius = 2;
  
      var vertexPositionData = [];
      var normalData = [];
      var textureCoordData = [];
      for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
  
        for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
          var phi = longNumber * 2 * Math.PI / longitudeBands;
          var sinPhi = Math.sin(phi);
          var cosPhi = Math.cos(phi);
  
          var x = cosPhi * sinTheta;
          var y = cosTheta;
          var z = sinPhi * sinTheta;
          var u = 1 - (longNumber / longitudeBands);
          var v = 1 - (latNumber / latitudeBands);
  
          normalData.push(x);
          normalData.push(y);
          normalData.push(z);
          textureCoordData.push(u);
          textureCoordData.push(v);
          vertexPositionData.push(radius * x);
          vertexPositionData.push(radius * y);
          vertexPositionData.push(radius * z);
        }
      }
  
      var indexData = [];
      for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
          var first = (latNumber * (longitudeBands + 1)) + longNumber;
          var second = first + longitudeBands + 1;
          indexData.push(first);
          indexData.push(second);
          indexData.push(first + 1);
  
          indexData.push(second);
          indexData.push(second + 1);
          indexData.push(first + 1);
        }
      }
  
      normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
      normalBuffer.itemSize = 3;
      normalBuffer.numItems = normalData.length / 3;
  
      textureCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
      textureCoordBuffer.itemSize = 2;
      textureCoordBuffer.numItems = textureCoordData.length / 2;
  
      positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
      positionBuffer.itemSize = 3;
      positionBuffer.numItems = vertexPositionData.length / 3;
  
      indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
      indexBuffer.itemSize = 1;
      indexBuffer.numItems = indexData.length;
  
      return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
        indices: indexBuffer,
        normal: normalBuffer
      };
    }
  }