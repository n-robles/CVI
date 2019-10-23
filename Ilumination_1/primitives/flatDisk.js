class FlatDisk {
    static initBuffers(gl) {
      let positionBuffer;
      let textureCoordBuffer;
      let indexBuffer;
      let normalBuffer;
  
      const vertexPositionData = [];
      const textureCoordData = [];
      const indexData = [];
      const normalData = [];
  
      const r = 1;
      const n = 360;
      // Add center.
      vertexPositionData.push(0, 0, 0);
      textureCoordData.push(0.5, 0.5);
      normalData.push(0, 1, 0);
  
      for (let i = 0; i < n; i++) {
        const x = r * Math.cos(i * 2 * Math.PI / n);
        const z = r * Math.sin(i * 2 * Math.PI / n);
        vertexPositionData.push(x);
        vertexPositionData.push(0);
        vertexPositionData.push(z);
  
        const u = x/(2*r) + 0.5;
        const v = z/(2*r) + 0.5;
  
        textureCoordData.push(u);
        textureCoordData.push(v);
  
        normalData.push(0.0, 1.0, 0.0);
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
  
  class Ring  {
     static initBuffers(gl, innerRadius, outerRadius, slices) {
     if (arguments.length == 0)
        innerRadius = 0.25;
     outerRadius = outerRadius || innerRadius * 2 || 0.5;
     slices = slices || 32;
      let positionBuffer;
      let textureCoordBuffer;
      let indexBuffer;
      let normalBuffer;     
       
     var vertexCount, vertices, normals, texCoords, indices, i;
     vertexCount = (innerRadius == 0)? slices + 1 : slices * 2;
     vertices = new Float32Array( 3*vertexCount );
     normals = new Float32Array( 3* vertexCount );
     texCoords = new Float32Array( 2*vertexCount );
     indices = new Uint16Array( innerRadius == 0 ?  3*slices : 3*2*slices );
     var d = 2*Math.PI/slices;
     var k = 0;
     var t = 0;
     var n = 0;
     if (innerRadius == 0) {
        for (i = 0; i < slices; i++) {
           c = Math.cos(d*i);
           s = Math.sin(d*i);
           vertices[k++] = c*outerRadius;
           vertices[k++] = s*outerRadius;
           vertices[k++] = 0;
           texCoords[t++] = 0.5 + 0.5*c;
           texCoords[t++] = 0.5 + 0.5*s; 
           indices[n++] = slices;
           indices[n++] = i;
           indices[n++] = i == slices-1 ? 0 : i + 1;
        }
        vertices[k++] = vertices[k++] = vertices[k++] = 0;
        texCoords[t++] = texCoords[t++] = 0;
     }
     else {
        var r = innerRadius / outerRadius;
        for (i = 0; i < slices; i++) {
           var c = Math.cos(d*i);
           var s = Math.sin(d*i);
           vertices[k++] = c*innerRadius;
           vertices[k++] = s*innerRadius;
           vertices[k++] = 0;
           texCoords[t++] = 0.5 + 0.5*c*r;
           texCoords[t++] = 0.5 + 0.5*s*r;
           vertices[k++] = c*outerRadius;
           vertices[k++] = s*outerRadius;
           vertices[k++] = 0;
           texCoords[t++] = 0.5 + 0.5*c;
           texCoords[t++] = 0.5 + 0.5*s;
        }
        for (i = 0; i < slices - 1; i++) {
           indices[n++] = 2*i;
           indices[n++] = 2*i+1;
           indices[n++] = 2*i+3;
           indices[n++] = 2*i;
           indices[n++] = 2*i+3;
           indices[n++] = 2*i+2;
        }
        indices[n++] = 2*i;
        indices[n++] = 2*i+1;
        indices[n++] = 1;
        indices[n++] = 2*i;
        indices[n++] = 1;
        indices[n++] = 0;
     }
     for (i = 0; i < vertexCount; i++) {
        normals[3*i] = normals[3*i+1] = 0;
        normals[3*i+2] = 1;
     }
  
      normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
      normalBuffer.itemSize = 3;
      normalBuffer.numItems = normals.length / 3;
  
      textureCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
      textureCoordBuffer.itemSize = 2;
      textureCoordBuffer.numItems = texCoords.length / 2;
  
      positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,vertices, gl.STATIC_DRAW);
      positionBuffer.itemSize = 3;
      positionBuffer.numItems = vertices.length / 3;
  
      indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices, gl.STATIC_DRAW);
      indexBuffer.itemSize = 1;
      indexBuffer.numItems = indices.length;
     return {
         position: positionBuffer,
         normal: normalBuffer,
         textureCoord: textureCoordBuffer,
         indices: indexBuffer
     };
    }
  }
  