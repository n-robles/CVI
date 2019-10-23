class Cone {
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
  
      vertexPositionData.push(0, 1, 0);
      textureCoordData.push(0.5, 0.5);
      normalData.push(0, 1, 0);
  
      const y = -1;
  
      for (let i = 0; i < n; i++) {
        const x = r * Math.cos(i * 2 * Math.PI / n);
        const z = r * Math.sin(i * 2 * Math.PI / n);
        vertexPositionData.push(x);
        vertexPositionData.push(y);
        vertexPositionData.push(z);
  
        const u = x/(2*r) + 0.5;
        const v = z/(2*r) + 0.5;
  
        textureCoordData.push(u);
        textureCoordData.push(v);
  
        normalData.push(x);
        normalData.push(0);
        normalData.push(z);
      }
  
      for (let i = 0; i < n; i++) {
        const first = 0;
        const second = i;
        const third = (i + 1) % n === 0 ? 1 : (i + 1);
  
        indexData.push(first);
        indexData.push(second);
        indexData.push(third);
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