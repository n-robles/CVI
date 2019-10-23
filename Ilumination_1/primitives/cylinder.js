class Cylinder {
    static initBuffers(gl) {
      let positionBuffer;
      let textureCoordBuffer;
      let indexBuffer;
      let normalBuffer;
  
      const vertexPositionData = [];
      const textureCoordData = [];
      const indexData = [];
      const normalData = [];
  
      const r = 0.8;
      const n = 360;
  
      for (let i = 0; i < n; i++) {
        const x = r * Math.cos(i * 2 * Math.PI / n);
        const z = r * Math.sin(i * 2 * Math.PI / n);
        vertexPositionData.push(x);
        vertexPositionData.push(r);
        vertexPositionData.push(z);
  
        vertexPositionData.push(x);
        vertexPositionData.push(-r);
        vertexPositionData.push(z);
  
        normalData.push(x, 0, z);
        normalData.push(x, 0, z);
  
        const u = i/n;
        const vTop = 1;
        const vBottom = 0;
        textureCoordData.push(u);
        textureCoordData.push(vTop);
        textureCoordData.push(u);
        textureCoordData.push(vBottom);
      }
  
      for (let i = 0; i < 2*n; i+=2) {
          const first = i;
          const second = i + 1;
          const third = (i + 2) % (2*n);
          const fourth = (i + 3) % (2*n);
  
          indexData.push(first);
          indexData.push(second);
          indexData.push(third);
  
          indexData.push(second);
          indexData.push(third);
          indexData.push(fourth);
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