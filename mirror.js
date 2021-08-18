
AFRAME.registerComponent('mirror', {
    schema: {
      resolution: { type:'number', default: 128},
      refraction: { type:'number', default: 0.95},
      color: {type:'color', default: 0xffffff},
      distance: {type:'number', default: 3000},
      interval: { type:'number', default: 1000},
      repeat: { type:'boolean', default: false}
    },

    /**
     * Set if component needs multiple instancing.
     */
    multiple: false,

    /**
     * Called once when component is attached. Generally for initial setup.
     */
    init: function(){
            const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
            this.cam = new THREE.CubeCamera( 1, 100000, cubeRenderTarget);
            this.el.object3D.add( this.cam );
            this.mirrorMaterial = new THREE.MeshBasicMaterial( { color: this.data.color, refractionRatio: this.data.refraction, envMap: this.cam.renderTarget.texture } );
            this.done = false;
            var mirrormat = this.mirrorMaterial;
            this.el.setObject3D('mesh', new THREE.Mesh());
            this.mesh = this.el.getObject3D('mesh');
            if(this.mesh){
              this.mesh.traverse( function( child ) { 
                  if ( child instanceof THREE.Mesh ) child.material = mirrormat;
              });
            }
    },
    
    tick: function(t,dt){
      if(!this.done){
        if( this.counter > 0){
          this.counter-=dt;
        }else{
          this.mesh = this.el.getObject3D('mesh');
          
          if(this.mesh){
              this.mesh.visible = false;
              AFRAME.scenes[0].renderer.autoClear = true;
              this.cam.position.copy(this.el.object3D.worldToLocal(this.el.object3D.getWorldPosition()));
              this.cam.update( AFRAME.scenes[0].renderer, this.el.sceneEl.object3D );
              
              var mirrormat = this.mirrorMaterial;
              this.mesh.traverse( function( child ) { 
                  if ( child instanceof THREE.Mesh ) child.material = mirrormat;
              });
              this.mesh.visible = true;
          
              if(!this.data.repeat){
                this.done = true;
                this.counter = this.data.interval;
              }
          }
        }
      }
    },
});
