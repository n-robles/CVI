class Figure {
    static draw(gl,
                programInfo,
                buffers,
                texture,
                projectionMatrix,
                modelViewMatrix,
                sunDirectionalVector,
                isSun,
                headlightPosition1,
                headlightPosition2,
                isHeadlight,
                shadowTexture,
                shadowMapTransformMatrix,
                isLightPole = false) {
      const normalMatrix = mat4.create();
      mat4.invert(normalMatrix, modelViewMatrix);
      mat4.transpose(normalMatrix, normalMatrix);
      // Tell WebGL how to pull out the positions from the position
      // buffer into the vertexPosition attribute
      { 
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          buffers.position.itemSize,
          type,
          normalize,
          stride,
          offset);
        gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition);
      }
  
      // Tell WebGL how to pull out the texture coordinates from
      // the texture coordinate buffer into the textureCoord attribute.
      {
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(
          programInfo.attribLocations.textureCoord,
          buffers.textureCoord.itemSize,
          type,
          normalize,
          stride,
          offset);
        gl.enableVertexAttribArray(
          programInfo.attribLocations.textureCoord);
      }
  
      // Get normal data.
      {
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal,
          buffers.normal.itemSize,
          type,
          normalize,
          stride,
          offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
      }
  
      // Tell WebGL which indices to use to index the vertices
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  
      // Tell WebGL to use our program when drawing
  
      gl.useProgram(programInfo.program);
  
      // Set the shader uniforms
      gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
      gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
      gl.uniformMatrix4fv(
        programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix);
      gl.uniformMatrix4fv(
        programInfo.uniformLocations.shadowMapTransformMatrix,
        false,
        shadowMapTransformMatrix
      );
      gl.uniform3fv(programInfo.uniformLocations.sunDirectionalVector, sunDirectionalVector);
      gl.uniform1f(programInfo.uniformLocations.isSun, isSun ? 1.0 : 0.0);
      gl.uniform3fv(programInfo.uniformLocations.headlightPosition1, headlightPosition1);
      gl.uniform3fv(programInfo.uniformLocations.headlightPosition2, headlightPosition2);
      gl.uniform1f(programInfo.uniformLocations.isHeadlight, isHeadlight ? 1.0 : 0.0);
      gl.uniform1f(programInfo.uniformLocations.isLightPole, isLightPole ? 1.0 : 0.0);
      gl.uniform1f(programInfo.uniformLocations.applyShadow, shadowTexture ? 1.0 : 0.0);
  
      // Specify the texture to map onto the faces.
  
      // Tell WebGL we want to affect texture unit 0
      gl.activeTexture(gl.TEXTURE0);
  
      // Bind the texture to texture unit 0
      gl.bindTexture(gl.TEXTURE_2D, texture);
  
      // Tell the shader we bound the texture to texture unit 0
      gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
      
      if (shadowTexture ) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, shadowTexture);
        gl.uniform1i(programInfo.uniformLocations.uShadowSampler, 1);
      }
  
      {
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, buffers.indices.numItems, type, offset);
      }
    }
  }