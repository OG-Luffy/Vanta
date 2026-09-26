import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const canvas=document.querySelector('#game');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x91a9ba);
scene.fog=new THREE.FogExp2(0x91a9ba,0.0027);

const camera=new THREE.PerspectiveCamera(60,16/9,.05,900);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.05;

scene.add(new THREE.HemisphereLight(0xdbeeff,0x273329,1.7));
const sun=new THREE.DirectionalLight(0xfff0cf,4.2);
sun.position.set(90,150,65);
sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-90;sun.shadow.camera.right=90;sun.shadow.camera.top=90;sun.shadow.camera.bottom=-90;
sun.shadow.bias=-0.00015;
scene.add(sun);

// Procedural terrain with gentle elevation variation.
const terrainGeo=new THREE.PlaneGeometry(700,700,120,120);
const pos=terrainGeo.attributes.position;
for(let i=0;i<pos.count;i++){
  const x=pos.getX(i),z=pos.getY(i);
  const h=Math.sin(x*.025)*1.8+Math.cos(z*.021)*1.4+Math.sin((x+z)*.012)*2.2;
  pos.setZ(i,h);
}
terrainGeo.computeVertexNormals();
const terrain=new THREE.Mesh(terrainGeo,new THREE.MeshStandardMaterial({
  color:0x536b4d,roughness:.93,metalness:0
}));
terrain.rotation.x=-Math.PI/2;
terrain.receiveShadow=true;
scene.add(terrain);

// Asphalt with subtle lane markings.
const roadMat=new THREE.MeshStandardMaterial({color:0x24282a,roughness:.82,metalness:.05});
const road=new THREE.Mesh(new THREE.PlaneGeometry(700,18),roadMat);
road.rotation.x=-Math.PI/2;road.position.y=.08;road.receiveShadow=true;scene.add(road);
const lineMat=new THREE.MeshStandardMaterial({color:0xe5d6a0,roughness:.65});
for(let x=-330;x<=330;x+=18){
  const mark=new THREE.Mesh(new THREE.PlaneGeometry(7,.18),lineMat);
  mark.rotation.x=-Math.PI/2;mark.position.set(x,.095,0);scene.add(mark);
}

function box(x,y,z,s,c,rough=.72,metal=0){
  const m=new THREE.Mesh(new THREE.BoxGeometry(...s),new THREE.MeshStandardMaterial({color:c,roughness:rough,metalness:metal}));
  m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;
}

// Denser city blocks, varied heights and tones.
for(let i=0;i<95;i++){
  const x=(Math.random()-.5)*560,z=(Math.random()-.5)*560;
  if(Math.abs(z)<15)continue;
  const h=4+Math.random()*25,w=5+Math.random()*10,d=5+Math.random()*10;
  const palette=[0x59615f,0x68716d,0x4b5558,0x70736e,0x3f4a4d];
  box(x,h/2,z,[w,h,d],palette[i%palette.length],.62,.03);
}

// Simple vegetation silhouettes for depth.
const trunkMat=new THREE.MeshStandardMaterial({color:0x49392b,roughness:1});
const leafMat=new THREE.MeshStandardMaterial({color:0x314b35,roughness:.95});
for(let i=0;i<130;i++){
  const x=(Math.random()-.5)*620,z=(Math.random()-.5)*620;
  if(Math.abs(z)<14)continue;
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.16,.22,2.4,6),trunkMat);
  trunk.position.set(x,1.2,z);trunk.castShadow=true;scene.add(trunk);
  const crown=new THREE.Mesh(new THREE.SphereGeometry(1.5+Math.random()*1.3,8,6),leafMat);
  crown.position.set(x,3+Math.random()*1.2,z);crown.castShadow=true;scene.add(crown);
}

// Player/vehicle placeholder, deliberately simple while the full 3D asset pipeline is built.
const player=box(0,1,0,[1.2,2,1.2],0x566dff,.38,.15);
player.position.y=1;

let vehicleMode=false,speed=0,yaw=0;
const keys={};
addEventListener('keydown',e=>{
  keys[e.key.toLowerCase()]=true;
  if(e.key.toLowerCase()==='v')toggleVehicle();
});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
document.querySelectorAll('[data-key]').forEach(b=>{
  const k=b.dataset.key;
  b.onpointerdown=()=>keys[k]=true;
  b.onpointerup=b.onpointercancel=()=>keys[k]=false;
});
document.querySelector('#vehicle').onpointerdown=toggleVehicle;

function toggleVehicle(){
  vehicleMode=!vehicleMode;
  player.material.color.set(vehicleMode?0xb52d36:0x566dff);
  document.querySelector('#mode').textContent=vehicleMode?'VEHICLE':'ON FOOT';
}

function resize(){
  const w=canvas.clientWidth,h=canvas.clientHeight;
  if(!w||!h)return;
  camera.aspect=w/h;
  camera.updateProjectionMatrix();
  renderer.setSize(w,h,false);
}
addEventListener('resize',resize);
resize();

function loop(t){
  requestAnimationFrame(loop);
  const dt=Math.min(.033,(t-(loop.last||t))/1000);loop.last=t;
  const f=(keys.w?1:0)-(keys.s?1:0);
  const s=(keys.d?1:0)-(keys.a?1:0);
  const max=vehicleMode?30:8;
  const accel=vehicleMode?24:12;
  speed+=f*accel*dt;
  speed*=Math.pow(vehicleMode?.12:.06,dt);
  speed=THREE.MathUtils.clamp(speed,-max*.45,max);
  yaw+=s*(vehicleMode?1.55:2.5)*dt*(Math.abs(speed)/Math.max(max,.1));
  player.rotation.y=yaw;
  player.position.x+=Math.sin(yaw)*speed*dt;
  player.position.z+=Math.cos(yaw)*speed*dt;

  const target=new THREE.Vector3(player.position.x,player.position.y+1,player.position.z);
  const distance=vehicleMode?9:7;
  const off=new THREE.Vector3(Math.sin(yaw)*-distance,vehicleMode?5.2:4.5,Math.cos(yaw)*-distance);
  camera.position.lerp(target.clone().add(off),.11);
  camera.lookAt(target);

  document.querySelector('#speed').textContent=Math.round(Math.abs(speed)*(vehicleMode?3.6:1))+' km/h';
  renderer.render(scene,camera);
}
requestAnimationFrame(loop);
