import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const canvas=document.querySelector('#game'), scene=new THREE.Scene();
scene.background=new THREE.Color(0x8fa6b8); scene.fog=new THREE.Fog(0x8fa6b8,55,260);
const camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,.1,500);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.75)); renderer.setSize(innerWidth,innerHeight); renderer.shadowMap.enabled=true;
scene.add(new THREE.HemisphereLight(0xddeeff,0x405040,1.8));
const sun=new THREE.DirectionalLight(0xfff1d1,3); sun.position.set(70,110,40); sun.castShadow=true; scene.add(sun);

const ground=new THREE.Mesh(new THREE.PlaneGeometry(600,600,80,80),new THREE.MeshStandardMaterial({color:0x3d563e,roughness:.95}));
ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);
const roadMat=new THREE.MeshStandardMaterial({color:0x25282b,roughness:.9});
const road=new THREE.Mesh(new THREE.PlaneGeometry(600,16),roadMat); road.rotation.x=-Math.PI/2; road.position.y=.02; scene.add(road);

function box(x,y,z,s,c){const m=new THREE.Mesh(new THREE.BoxGeometry(...s),new THREE.MeshStandardMaterial({color:c,roughness:.72}));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m}
for(let i=0;i<70;i++){const x=(Math.random()-.5)*520,z=(Math.random()-.5)*520;if(Math.abs(z)<14)continue;const h=3+Math.random()*18;box(x,h/2,z,[4+Math.random()*8,h,4+Math.random()*8],0x59615d)}

const player=box(0,1,0,[1.2,2,1.2],0xd6d9dc); player.position.y=1;
let vehicleMode=false, speed=0, yaw=0; const keys={};
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==='v')toggleVehicle();});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.onpointerdown=()=>keys[k]=true;b.onpointerup=b.onpointercancel=()=>keys[k]=false});
document.querySelector('#vehicle').onpointerdown=toggleVehicle;
function toggleVehicle(){vehicleMode=!vehicleMode;player.material.color.set(vehicleMode?0x6b7dff:0xd6d9dc);document.querySelector('#mode').textContent=vehicleMode?'VEHICLE':'ON FOOT'}

function loop(t){requestAnimationFrame(loop);const dt=Math.min(.033,(t-(loop.last||t))/1000);loop.last=t;
let f=(keys.w?1:0)-(keys.s?1:0), s=(keys.d?1:0)-(keys.a?1:0); const max=vehicleMode?22:7; const accel=vehicleMode?18:10;
speed += f*accel*dt; speed *= Math.pow(.08,dt); speed=THREE.MathUtils.clamp(speed,-max*.45,max);
yaw += s*(vehicleMode?1.7:2.4)*dt*(Math.abs(speed)/Math.max(max,.1));
player.rotation.y=yaw; player.position.x+=Math.sin(yaw)*speed*dt; player.position.z+=Math.cos(yaw)*speed*dt;
const target=new THREE.Vector3(player.position.x,player.position.y+1,player.position.z), off=new THREE.Vector3(Math.sin(yaw)*-7,4.5,Math.cos(yaw)*-7);camera.position.lerp(target.clone().add(off),.12);camera.lookAt(target);
document.querySelector('#speed').textContent=Math.round(Math.abs(speed)*(vehicleMode?3.6:1))+' km/h';renderer.render(scene,camera)}
requestAnimationFrame(loop);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
