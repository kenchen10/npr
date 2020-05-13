let scene, camera, renderer;
function init() {
  var geomLoader = new THREE.GLTFLoader();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,45,30000);
  camera.position.set(-900,-200,-900);
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(window.innerWidth,window.innerHeight);
  document.body.appendChild(renderer.domElement);
  let controls = new THREE.OrbitControls(camera);
  controls.addEventListener('change', renderer);
  controls.minDistance = 500;
  controls.maxDistance = 2000;

  let materialArray = [];
  var path = "cubemap/bridge/";
  var format = '.jpg';
  var urls = [
    path + 'posx' + format, path + 'negx' + format,
    path + 'posy' + format, path + 'negy' + format,
    path + 'posz' + format, path + 'negz' + format
  ];
  var textureCube = new THREE.CubeTextureLoader().load( urls );
  let texture_ft = new THREE.TextureLoader().load( urls[0] );
  let texture_bk = new THREE.TextureLoader().load( urls[1] );
  let texture_up = new THREE.TextureLoader().load( urls[2] );
  let texture_dn = new THREE.TextureLoader().load( urls[3] );
  let texture_rt = new THREE.TextureLoader().load( urls[4] );
  let texture_lf = new THREE.TextureLoader().load( urls[5] );
    
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

  for (let i = 0; i < 6; i++) {
    materialArray[i].side = THREE.BackSide;
  }
  let skyboxGeo = new THREE.BoxGeometry( 10000, 10000, 10000);
  let skybox = new THREE.Mesh( skyboxGeo, materialArray );
  var uniforms = {

    "tCube": { value: null },
    "Ka": { value: new THREE.Vector3(0.9, 0.5, 0.3) },
    "Kd": { value: new THREE.Vector3(0.9, 0.5, 0.3) },
    "Ks": { value: new THREE.Vector3(0.8, 0.8, 0.8) }

  };

  uniforms[ "tCube" ].value = textureCube;

  var material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader:document.getElementById( "vertexShaderLight" ).textContent,
    fragmentShader: document.getElementById( "fragmentLight" ).textContent
  } );

  var mesh;
  geomLoader.load( 'geometries/scene.gltf', function ( gltf ) {

    mesh = gltf.scene.children[0];
    mesh.traverse( function ( child ) {
      if ( child instanceof THREE.Mesh ) {
        child.material = material;
      }
    } );
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 5;
    scene.add( mesh );
  }, undefined, function ( error ) {
    console.error( error );
  } );

  window.addEventListener( 'resize', onWindowResize, false );

  scene.add( skybox );  
  animate();
}

function animate() {
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

init();
