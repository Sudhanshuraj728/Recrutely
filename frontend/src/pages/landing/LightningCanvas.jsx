import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* =============================================================================
   LightningCanvas — SAFFRON-MATCHED RIVER VEIN NETWORK

   Reference: saffron-griflan.netlify.app — cracked-marble / lightning-river
   background as seen in the uploaded screenshot.

   Key visual targets:
     • Deep black canvas (≥80% pure black negative space)
     • Thick glowing river channels (8–22 px body + massive 3-layer bloom)
    • Dominant ember / copper / rust-gold palette
    • Deep mountain-like shadow planes under the veins
     • Many fine branching hairlines off main channels
     • Slow organic current flowing ALONG veins (not floating blobs)
     • Mouse hover → luminous energy wave + heat glow along nearest vein

   Rendering pipeline each frame:
     L1  wide atmospheric bloom  blur(28px) screen α=0.85
     L2  medium glow             blur(10px) screen α=0.75
     L3  tight definition        blur( 3px) screen α=0.55
     L4  body strokes            screen
     L5  hot core                screen
     L6  hover glow overlay      screen (localised)
   ============================================================================= */

const TAU = Math.PI * 2;

/* Palette — ember copper tones sampled from the supplied reference.
   h=hue, s=sat, lB=body-L (dark), lC=core-L (bright), lG=glow-L, lHot=hotspot-L */
const PAL = [
  { h:  14, s:  88, lB: 11, lC: 43, lG: 19, lHot: 72 }, // ember
  { h:  21, s:  84, lB: 12, lC: 48, lG: 21, lHot: 78 }, // copper
  { h:  28, s:  82, lB: 13, lC: 52, lG: 23, lHot: 82 }, // warm bronze
  { h:   6, s:  80, lB: 10, lC: 39, lG: 17, lHot: 66 }, // rust
  { h:  30, s:  72, lB: 11, lC: 42, lG: 19, lHot: 72 }, // muted gold
  { h:  24, s:  78, lB: 13, lC: 46, lG: 21, lHot: 76 }, // burnt gold
  { h:  11, s:  76, lB:  9, lC: 35, lG: 15, lHot: 62 }, // deep copper
];

function pickPal(depth) {
  const r = Math.random();
  if (depth === 0) {
    if (r < 0.30) return PAL[0];
    if (r < 0.52) return PAL[1];
    if (r < 0.68) return PAL[2];
    if (r < 0.78) return PAL[3];
    if (r < 0.88) return PAL[4];
    if (r < 0.95) return PAL[5];
    return PAL[6];
  }
  if (depth === 1) {
    if (r < 0.28) return PAL[0];
    if (r < 0.50) return PAL[1];
    if (r < 0.66) return PAL[2];
    if (r < 0.76) return PAL[3];
    if (r < 0.88) return PAL[4];
    if (r < 0.96) return PAL[5];
    return PAL[6];
  }
  if (r < 0.25) return PAL[0];
  if (r < 0.48) return PAL[1];
  if (r < 0.65) return PAL[2];
  if (r < 0.78) return PAL[4];
  if (r < 0.90) return PAL[5];
  return PAL[3];
}

/* Geometry classes:
   bodyW  = visible painted stroke width (thick for primaries)
   coreW  = thin bright inner line = bodyW x frac
   glowW  = bloom stroke width on off-screen buffer = bodyW x mul            */
const CLS = [
  { stepPx:[4,7],  bodyW:[10,25],   coreWFrac:[0.18,0.30], glowWMul:[14,25], aBody:[0.30,0.54], aCore:[0.56,0.86], maxChildren:8 },
  { stepPx:[3,6],  bodyW:[3,10],    coreWFrac:[0.20,0.35], glowWMul:[11,20], aBody:[0.18,0.40], aCore:[0.40,0.72], maxChildren:6 },
  { stepPx:[3,5],  bodyW:[0.7,2.8], coreWFrac:[0.30,0.50], glowWMul:[6,12],  aBody:[0.08,0.22], aCore:[0.25,0.55], maxChildren:2 },
];

function rng(lo, hi) { return lo + Math.random() * (hi - lo); }

/* Vein record — X,Y never mutated after creation (no worm wobble).
   br[] = per-vertex brightness 0-1 (current + pulse).
   heat[] = per-vertex hover heat 0-1 (decays over ~3s).              */
function makeVein(pts, depth, id) {
  const n = pts.length;
  const X = new Float32Array(n), Y = new Float32Array(n), D = new Float32Array(n);
  let acc = 0;
  for (let i = 0; i < n; i++) {
    X[i] = pts[i][0]; Y[i] = pts[i][1]; D[i] = acc;
    if (i < n-1) acc += Math.hypot(pts[i+1][0]-X[i], pts[i+1][1]-Y[i]);
  }
  const L = acc || 1;
  const cls = CLS[Math.min(depth, 2)];
  const pal = pickPal(depth);
  const bodyW = rng(...cls.bodyW);
  const coreW = bodyW * rng(...cls.coreWFrac);
  const glowW = bodyW * rng(...cls.glowWMul);

  const hsl = (h, s, l, a) => `hsla(${h},${s}%,${l}%,${a})`;

  return {
    X, Y, D, L, n, depth, id,
    bodyW, coreW, glowW,
    aBody: rng(...cls.aBody),
    aCore: rng(...cls.aCore),
    pal, hsl,
    br:   new Float32Array(n),
    heat: new Float32Array(n),
    edges:[], parent:-1, isSource:false,
    pulsePhase:   Math.random() * TAU,
    pulseFreq:    0.14 + Math.random() * 0.28,
    flowSpeedMul: 0.55 + Math.random() * 0.80,
    cls,
  };
}

/* Waypoint-guided path — bounded heading + tiny noise → long sweeping arcs, no spirals. */
function growPath(x0, y0, wps, stepPx, nudge, out, maxLen) {
  let x=x0, y=y0, wp=0, trav=0, guard=0;
  let hdg = wps.length ? Math.atan2(wps[0][1]-y, wps[0][0]-x) : 0;
  const lim = maxLen || 1e9;
  out.push([x, y]);
  while (wp < wps.length && trav < lim && ++guard < 80000) {
    const [tx,ty] = wps[wp];
    let diff = Math.atan2(ty-y, tx-x) - hdg;
    while (diff >  Math.PI) diff -= TAU;
    while (diff < -Math.PI) diff += TAU;
    hdg += diff*0.16 + (Math.random()-0.5)*nudge*0.20;
    x += Math.cos(hdg)*stepPx; y += Math.sin(hdg)*stepPx; trav += stepPx;
    out.push([x, y]);
    if ((tx-x)*(tx-x)+(ty-y)*(ty-y) < stepPx*stepPx*9) wp++;
  }
  return { x, y };
}

/* Field generation — 5-8 primaries, each spawns secondaries, which spawn fines. */
function generateField(W, H) {
  const veins = []; let nextId=0;
  const diag = Math.hypot(W, H), PAD = diag*0.10;

  function edgePt(side) {
    const r=Math.random();
    if (side===0) return [-PAD,  H*(0.05+r*0.90)];
    if (side===1) return [W+PAD, H*(0.05+r*0.90)];
    if (side===2) return [W*(0.05+r*0.90),-PAD   ];
    return               [W*(0.05+r*0.90),H+PAD   ];
  }

  function growPrimary() {
    const cls=CLS[0], step=rng(...cls.stepPx);
    const s0=(Math.random()*4)|0, [x0,y0]=edgePt(s0);
    const s1=(s0+1+((Math.random()*3)|0))%4, [xE,yE]=edgePt(s1);
    const nWp=2+((Math.random()*3)|0), wps=[];
    for (let i=1;i<=nWp;i++) {
      const t=i/(nWp+1);
      const mx=x0+(xE-x0)*t, my=y0+(yE-y0)*t;
      const perp=Math.atan2(yE-y0,xE-x0)+Math.PI/2;
      const mag=(Math.random()-0.5)*diag*0.46;
      wps.push([mx+Math.cos(perp)*mag, my+Math.sin(perp)*mag]);
    }
    wps.push([xE,yE]);
    const pts=[]; growPath(x0,y0,wps,step,1.5,pts,diag*1.7);
    if (pts.length<8) return;
    const v=makeVein(pts,0,nextId++); v.isSource=true; veins[v.id]=v;
    const numSec=3+((Math.random()*(cls.maxChildren-3))|0);
    let made=0,tries=0;
    while (made<numSec && tries++<140) {
      const fi=(1+Math.random()*(v.n-3))|0;
      const px=v.X[fi],py=v.Y[fi];
      if (px<-40||px>W+40||py<-40||py>H+40) continue;
      const sId=growSecondary(v,fi,px,py,v.id);
      if (sId>=0) { v.edges.push({other:sId,myArc:v.D[fi],otherArc:0}); made++; }
    }
  }

  function growSecondary(pv,atIdx,px,py,parentId) {
    const cls=CLS[1],step=rng(...cls.stepPx);
    const ni=Math.min(atIdx+1,pv.n-1);
    const ang0=Math.atan2(pv.Y[ni]-pv.Y[atIdx],pv.X[ni]-pv.X[atIdx]);
    const side=Math.random()<0.5?1:-1;
    const brAng=ang0+side*(0.45+Math.random()*1.20);
    const len=diag*(0.10+Math.random()*0.18);
    const perp=brAng+Math.PI/2;
    const ex=px+Math.cos(brAng)*len, ey=py+Math.sin(brAng)*len;
    const wps=[
      [(px+ex)*0.5+Math.cos(perp)*(Math.random()-0.5)*len*0.50,
       (py+ey)*0.5+Math.sin(perp)*(Math.random()-0.5)*len*0.50],
      [Math.max(-PAD,Math.min(W+PAD,ex)),Math.max(-PAD,Math.min(H+PAD,ey))],
    ];
    const pts=[]; growPath(px,py,wps,step,1.9,pts,len*1.25);
    if (pts.length<4) return -1;
    const v=makeVein(pts,1,nextId++); v.parent=parentId; veins[v.id]=v;
    v.edges.push({other:parentId,myArc:0,otherArc:pv.D[atIdx]});
    const numFine=1+((Math.random()*cls.maxChildren)|0);
    let made=0,tries=0;
    while (made<numFine && tries++<60) {
      const fi=(1+Math.random()*(v.n-3))|0;
      const fx=v.X[fi],fy=v.Y[fi];
      if (fx<-30||fx>W+30||fy<-30||fy>H+30) continue;
      const fId=growFine(v,fi,fx,fy,v.id);
      if (fId>=0) { v.edges.push({other:fId,myArc:v.D[fi],otherArc:0}); made++; }
    }
    return v.id;
  }

  function growFine(pv,atIdx,px,py,parentId) {
    const cls=CLS[2],step=rng(...cls.stepPx);
    const ni=Math.min(atIdx+1,pv.n-1);
    const ang0=Math.atan2(pv.Y[ni]-pv.Y[atIdx],pv.X[ni]-pv.X[atIdx]);
    const side=Math.random()<0.5?1:-1;
    const brAng=ang0+side*(0.35+Math.random()*1.40);
    const len=diag*(0.04+Math.random()*0.07);
    const ex=px+Math.cos(brAng)*len, ey=py+Math.sin(brAng)*len;
    const perp=brAng+Math.PI/2;
    const wps=[
      [(px+ex)*0.5+Math.cos(perp)*(Math.random()-0.5)*len*0.40,
       (py+ey)*0.5+Math.sin(perp)*(Math.random()-0.5)*len*0.40],
      [ex,ey],
    ];
    const pts=[]; growPath(px,py,wps,step,2.1,pts,len*1.30);
    if (pts.length<3) return -1;
    const v=makeVein(pts,2,nextId++); v.parent=parentId; veins[v.id]=v;
    v.edges.push({other:parentId,myArc:0,otherArc:pv.D[atIdx]});
    return v.id;
  }

  const nPrim=5+((Math.random()*4)|0);
  for (let i=0;i<nPrim;i++) growPrimary();
  const out=[];
  for (let i=0;i<nextId;i++) if (veins[i]) out.push(veins[i]);
  return out;
}

/* Current / front system */
const MAX_FRONTS=180, SPD_LO=70, SPD_HI=165;
const TRAIL_LEN=130, HEAD_LEN=20, MIN_AMP=0.020;
const BRANCH_PROB=0.72, BRANCH_DECAY=0.54;

function makeFront(state,vIdx,arc,dir,amp,spd) {
  if (state.fronts.length>=MAX_FRONTS) return;
  const v=state.veins[vIdx]; if (!v||v.n<3) return;
  state.fronts.push({ v:vIdx,d:arc,dir,amp:Math.min(2.0,amp),
    spd:spd*v.flowSpeedMul, decay:2.2+Math.random()*3.0, age:0, spawned:new Set() });
}

function stepFronts(state,dt) {
  const {fronts,veins}=state;
  const now=performance.now();
  if (now>=state.nextSpawn && fronts.length<MAX_FRONTS*0.68) {
    const srcs=state.sources;
    if (srcs.length) {
      const sidx=srcs[(Math.random()*srcs.length)|0];
      const v=veins[sidx];
      if (v&&v.n>=3) {
        const bright=Math.random()<0.18;
        const spd=SPD_LO+Math.random()*(SPD_HI-SPD_LO);
        makeFront(state,sidx,Math.random()<0.60?0:Math.random()*v.L*0.50,1,
          bright?1.2+Math.random()*0.7:0.35+Math.random()*0.30,spd);
      }
    }
    state.nextSpawn=now+450+Math.random()*950;
  }
  for (let f=fronts.length-1;f>=0;f--) {
    const fr=fronts[f];
    fr.d+=fr.dir*fr.spd*dt; fr.amp*=Math.exp(-dt/fr.decay); fr.age+=dt;
    const v=veins[fr.v];
    if (!v) { fronts.splice(f,1); continue; }
    for (const edge of v.edges) {
      if (fr.spawned.has(edge.other)) continue;
      const d0=fr.d-fr.dir*fr.spd*dt*1.6;
      const lo=Math.min(fr.d,d0), hi=Math.max(fr.d,d0);
      if (edge.myArc>=lo && edge.myArc<=hi) {
        fr.spawned.add(edge.other);
        const ba=fr.amp*BRANCH_DECAY;
        if (ba>MIN_AMP && Math.random()<BRANCH_PROB) {
          const ov=veins[edge.other];
          if (ov&&ov.n>=3) {
            const cd=edge.otherArc<ov.L*0.5?1:-1;
            makeFront(state,edge.other,edge.otherArc,cd,ba,
              SPD_LO*0.65+Math.random()*(SPD_HI-SPD_LO)*0.75);
          }
        }
      }
    }
    if (fr.amp<MIN_AMP||fr.d>v.L+TRAIL_LEN||fr.d<-TRAIL_LEN) fronts.splice(f,1);
  }
}

/* Hover heat */
const HEAT_DECAY=0.9;
function decayHeat(veins,dt) {
  const k=Math.exp(-dt/HEAT_DECAY);
  for (const v of veins) for (let i=0;i<v.n;i++) v.heat[i]*=k;
}
function injectHeat(veins,vIdx,arc,radius) {
  const v=veins[vIdx]; if (!v) return;
  const r2=radius*radius;
  for (let i=0;i<v.n;i++) {
    const d=arc-v.D[i]; const nb=v.heat[i]+Math.exp(-(d*d)/r2);
    v.heat[i]=nb>1?1:nb;
  }
}

/* Brightness update */
function updateBrightness(state,t) {
  const {veins,fronts}=state;
  for (const v of veins) {
    const p1=0.5+0.5*Math.sin(t*v.pulseFreq+v.pulsePhase);
    const p2=0.7+0.3*Math.sin(t*v.pulseFreq*0.33+v.pulsePhase+2.1);
    const rest=v.aCore*(0.40+0.60*p1*p2);
    for (let i=0;i<v.n;i++) { const nb=rest+v.heat[i]*0.60; v.br[i]=nb>1?1:nb; }
  }
  for (const fr of fronts) {
    const v=veins[fr.v]; if (!v) continue;
    const {D,br,n}=v; const d=fr.d,amp=fr.amp;
    for (let i=0;i<n;i++) {
      const delta=d-D[i]; let add=0;
      if (delta>=-HEAD_LEN && delta<=TRAIL_LEN)
        add=delta<0 ? amp*Math.exp(-(-delta)/(HEAD_LEN*0.60))
                    : amp*(1-delta/TRAIL_LEN)*(1-delta/TRAIL_LEN);
      const nb=br[i]+add; br[i]=nb>1?1:nb;
    }
  }
}

/* Nearest point on vein */
function nearestOnVein(v,mx,my) {
  const {X,Y,D,n}=v; let bestD2=Infinity,bestArc=0;
  for (let i=0;i<n-1;i++) {
    const ax=X[i],ay=Y[i],bx=X[i+1],by=Y[i+1];
    const dx=bx-ax,dy=by-ay,l2=dx*dx+dy*dy||1;
    let t=((mx-ax)*dx+(my-ay)*dy)/l2; t=t<0?0:t>1?1:t;
    const px=ax+dx*t-mx,py=ay+dy*t-my,d2=px*px+py*py;
    if (d2<bestD2) { bestD2=d2; bestArc=D[i]+t*(D[i+1]-D[i]); }
  }
  return {d2:bestD2,arc:bestArc};
}

/* Alpha tables */
const BODY_A=[0.020,0.045,0.090,0.160,0.250,0.370,0.510,0.680];
const CORE_A=[0.060,0.140,0.260,0.420,0.600,0.760,0.900,0.980];
const GLOW_A=[0.000,0.016,0.038,0.075,0.130,0.205,0.290,0.390];
function bkt(b) {
  if (b<0.06) return 0; if (b<0.14) return 1; if (b<0.24) return 2;
  if (b<0.36) return 3; if (b<0.52) return 4; if (b<0.68) return 5;
  if (b<0.84) return 6; return 7;
}

function drawTerrainShadows(ctx,W,H,t) {
  const layers = [
    { color:'rgba(47,13,6,0.34)', base:0.68, amp:0.16, speed:0.00010 },
    { color:'rgba(28,9,5,0.62)', base:0.78, amp:0.13, speed:-0.00007 },
    { color:'rgba(8,3,2,0.86)', base:0.88, amp:0.10, speed:0.00005 },
  ];

  layers.forEach((layer, layerIndex) => {
    const points = 12;
    const drift = t * layer.speed * W;
    ctx.beginPath();
    ctx.moveTo(-W * 0.08, H);
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * W;
      const wave = Math.sin(i * 1.65 + layerIndex * 1.8 + drift) * layer.amp;
      const secondary = Math.sin(i * 3.2 + layerIndex) * layer.amp * 0.32;
      ctx.lineTo(x, H * (layer.base + wave + secondary));
    }
    ctx.lineTo(W * 1.08, H);
    ctx.closePath();
    ctx.fillStyle = layer.color;
    ctx.fill();
  });
}

function drawCursorBloom(ctx,S,now) {
  if (S.mobile || S.smx === null || S.smy === null) return;
  const pulse = 0.72 + Math.sin(now * 0.008) * 0.12;
  const radius = 92 + Math.sin(now * 0.004) * 10;
  const bloom = ctx.createRadialGradient(S.smx,S.smy,0,S.smx,S.smy,radius);
  bloom.addColorStop(0,`rgba(220,104,34,${0.032 * pulse})`);
  bloom.addColorStop(0.22,`rgba(128,45,16,${0.018 * pulse})`);
  bloom.addColorStop(1,'rgba(0,0,0,0)');
  ctx.save();
  ctx.globalCompositeOperation='screen';
  ctx.fillStyle=bloom;
  ctx.fillRect(S.smx-radius,S.smy-radius,radius*2,radius*2);
  ctx.restore();
}

/* Draw vein into glow buffer */
function drawVeinGlow(gCtx,v) {
  const {X,Y,br,heat,n,glowW,pal,hsl,depth}=v;
  if (n<2||depth>1) return;
  const {h,s,lG}=pal; let i=0;
  while (i<n-1) {
    const avg=(br[i]+br[i+1])*0.5, hv=(heat[i]+heat[i+1])*0.5;
    const bk=bkt(avg); let j=i+1;
    while (j<n-1&&bkt((br[j]+br[j+1])*0.5)===bk) j++;
    const aG=Math.min(0.42,GLOW_A[bk]+hv*0.22);
    if (aG>0.005) {
      gCtx.lineWidth=glowW; gCtx.lineJoin='round'; gCtx.lineCap='round';

      gCtx.strokeStyle = hsl(h, s, lG, aG);

      gCtx.beginPath(); gCtx.moveTo(X[i],Y[i]);
      for (let k=i+1;k<=j;k++) gCtx.lineTo(X[k],Y[k]);
      gCtx.stroke();
    }
    i=j;
  }
}

/* Draw body + core onto main canvas */
function drawVein(ctx,v) {
  const {X,Y,br,heat,n,bodyW,coreW,pal,hsl}=v;
  if (n<2) return;
  const {h,s,lB,lC,lHot}=pal;
  // body
  ctx.lineWidth=bodyW; ctx.lineJoin='round'; ctx.lineCap='round';
  let i=0;
  while (i<n-1) {
    const avg=(br[i]+br[i+1])*0.5, hv=(heat[i]+heat[i+1])*0.5;
    const bk=bkt(avg); let j=i+1;
    while (j<n-1&&bkt((br[j]+br[j+1])*0.5)===bk) j++;
    const lShift=hv*12;
    ctx.beginPath(); ctx.moveTo(X[i],Y[i]);
    for (let k=i+1;k<=j;k++) ctx.lineTo(X[k],Y[k]);

      ctx.strokeStyle = hsl(h, s, lB+lShift, BODY_A[bk]);

    ctx.stroke(); i=j;
  }
  // core
  ctx.lineWidth=coreW; i=0;
  while (i<n-1) {
    const avg=(br[i]+br[i+1])*0.5, hv=(heat[i]+heat[i+1])*0.5;
    const bk=bkt(avg); let j=i+1;
    while (j<n-1&&bkt((br[j]+br[j+1])*0.5)===bk) j++;
    const ca=Math.min(0.99,CORE_A[bk]+hv*0.30);
    if (ca>0.03) {
      const lBlend=lC+(lHot-lC)*hv*0.75;
      ctx.beginPath(); ctx.moveTo(X[i],Y[i]);
      for (let k=i+1;k<=j;k++) ctx.lineTo(X[k],Y[k]);

      ctx.strokeStyle = hsl(h+4, Math.min(100,s+2), Math.min(94,lBlend), ca);

      ctx.stroke();
    }
    i=j;
  }
}

/* Hover glow overlay */
function drawHoverGlow(ctx,v) {
  const {X,Y,heat,n,bodyW,pal,hsl}=v; if (n<2) return;
  const {h,s,lB,lHot}=pal;
  let maxH=0; for (let i=0;i<n;i++) if (heat[i]>maxH) maxH=heat[i];
  if (maxH<0.04) return;
  let i=0;
  while (i<n-1) {
    const hv=(heat[i]+heat[i+1])*0.5; let j=i+1;
    while (j<n-1&&Math.abs((heat[j]+heat[j+1])*0.5-hv)<0.06) j++;
    if (hv>0.03) {
      // Hover heat reads as a raised terrain ridge, with a smaller ember seam.
      ctx.lineWidth=bodyW*(2.3+hv*3.2); ctx.lineJoin='round'; ctx.lineCap='round';
      ctx.strokeStyle = hsl(h, Math.max(42,s-24), Math.max(8,lB-2), hv*0.22);
      ctx.beginPath(); ctx.moveTo(X[i],Y[i]);
      for (let k=i+1;k<=j;k++) ctx.lineTo(X[k],Y[k]);
      ctx.stroke();

      ctx.lineWidth=bodyW*(0.32+hv*0.70);
      ctx.strokeStyle = hsl(h, Math.min(92,s+2), lHot, hv*0.42);

      ctx.beginPath(); ctx.moveTo(X[i],Y[i]);
      for (let k=i+1;k<=j;k++) ctx.lineTo(X[k],Y[k]);
      ctx.stroke();
    }
    i=j;
  }
}

/* React component */
export function LightningCanvas() {
  const canvasRef=useRef(null);
  const reduce=useReducedMotion();
  const stateRef=useRef(null);

  if (!stateRef.current) {
    stateRef.current={
      veins:[],fronts:[],sources:[],
      prevTime:0,nextSpawn:0,
      alive:false,running:false,
      rawMx:null,rawMy:null,smx:null,smy:null,
      lastProbeMx:-1e9,lastProbeMy:-1e9,
      probeAt:0,injectCd:0,
      cssW:0,cssH:0,lastW:0,lastH:0,
      mobile:false,gc:null,gCtx:null,
    };
  }

  useEffect(() => {
    const S=stateRef.current;
    const canvas=canvasRef.current; if (!canvas) return;
    const ctx=canvas.getContext('2d');
    S.alive=true; let rafId;

    function detectMobile() { S.mobile=window.matchMedia('(pointer:coarse)').matches||window.innerWidth<820; }
    detectMobile();

    function buildBuffers(w,h) {
      const g=document.createElement('canvas');
      g.width=Math.max(1,Math.ceil(w/2)); g.height=Math.max(1,Math.ceil(h/2));
      S.gc=g; S.gCtx=g.getContext('2d');
    }

    function resize() {
      const dpr=Math.min(window.devicePixelRatio||1,2);
      const w=window.innerWidth,h=window.innerHeight;
      S.cssW=w; S.cssH=h;
      canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr);
      canvas.style.width=w+'px'; canvas.style.height=h+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      buildBuffers(w,h);
      const grew=Math.abs(w-S.lastW)>60||Math.abs(h-S.lastH)>60||!S.veins.length;
      S.lastW=w; S.lastH=h;
      if (grew) {
        S.veins=generateField(w,h);
        S.sources=S.veins.filter(v=>v.isSource).map(v=>v.id);
        S.fronts=[]; S.nextSpawn=performance.now()+350;
        S.injectCd=0; S.lastProbeMx=-1e9; S.lastProbeMy=-1e9;
      }
    }

    function probeMouse(now) {
      const {smx,smy}=S; if (smx===null||S.mobile) return;
      const moved=Math.abs(smx-S.lastProbeMx)+Math.abs(smy-S.lastProbeMy);
      if (now<S.probeAt&&moved<2) return;
      S.probeAt=now+35; S.lastProbeMx=smx; S.lastProbeMy=smy;
      let bestD2=Infinity,bestV=-1,bestArc=0;
      const R=190;
      for (let i=0;i<S.veins.length;i++) {
        const r=nearestOnVein(S.veins[i],smx,smy);
        if (r.d2<bestD2) { bestD2=r.d2; bestV=i; bestArc=r.arc; }
      }
      if (bestV>=0&&bestD2<R*R) {
        const prox=1-Math.sqrt(bestD2)/R;
        const hr=90+prox*140;
        injectHeat(S.veins,bestV,bestArc,hr);
        const nv=S.veins[bestV];
        for (const e of nv.edges) injectHeat(S.veins,e.other,e.otherArc,hr*0.42);
        if (now>=S.injectCd) {
          const amp=0.42+prox*0.90;
          const spd=SPD_LO*0.85+prox*(SPD_HI-SPD_LO)*1.1;
          makeFront(S,bestV,bestArc,1,amp,spd);
          makeFront(S,bestV,bestArc,-1,amp,spd);
          S.injectCd=now+100+Math.random()*120;
        }
      }
    }

    function draw(now,dt) {
      const t=now*0.001;
      const {cssW:W,cssH:H,gc,gCtx}=S; if (!gc) return;
      stepFronts(S,dt); decayHeat(S.veins,dt);
      if (!S.mobile) probeMouse(now);
      updateBrightness(S,t);

      ctx.globalCompositeOperation='source-over';
      ctx.globalAlpha=1; ctx.fillStyle='#000';
      ctx.fillRect(0,0,W,H);
      drawTerrainShadows(ctx,W,H,now);
      drawCursorBloom(ctx,S,now);

      // fill glow buffer
      const gW=gc.width,gH=gc.height;
      gCtx.globalCompositeOperation='source-over'; gCtx.fillStyle='#000';
      gCtx.fillRect(0,0,gW,gH);
      gCtx.setTransform(0.5,0,0,0.5,0,0);
      gCtx.globalCompositeOperation='screen';
      for (const v of S.veins) drawVeinGlow(gCtx,v);
      gCtx.setTransform(1,0,0,1,0,0);
      gCtx.globalCompositeOperation='source-over';

      // L1 wide atmospheric bloom
      ctx.save(); ctx.globalCompositeOperation='screen'; ctx.globalAlpha=0.85;
      ctx.filter='blur(28px)'; ctx.drawImage(gc,0,0,W,H);
      ctx.filter='none'; ctx.globalAlpha=1; ctx.restore();
      // L2 medium glow
      ctx.save(); ctx.globalCompositeOperation='screen'; ctx.globalAlpha=0.75;
      ctx.filter='blur(10px)'; ctx.drawImage(gc,0,0,W,H);
      ctx.filter='none'; ctx.globalAlpha=1; ctx.restore();
      // L3 tight definition
      ctx.save(); ctx.globalCompositeOperation='screen'; ctx.globalAlpha=0.55;
      ctx.filter='blur(3px)'; ctx.drawImage(gc,0,0,W,H);
      ctx.filter='none'; ctx.globalAlpha=1; ctx.restore();

      // L4+L5 body + core
      ctx.globalCompositeOperation='screen';
      for (const v of S.veins) drawVein(ctx,v);
      // L6 hover glow
      for (const v of S.veins) drawHoverGlow(ctx,v);
      ctx.globalCompositeOperation='source-over';
    }

    function staticSnapshot() {
      const {cssW:W,cssH:H}=S;
      for (const v of S.veins) { const b=v.aCore*0.65; for (let i=0;i<v.n;i++) v.br[i]=b; }
      ctx.fillStyle='#000'; ctx.fillRect(0,0,W,H);
      ctx.globalCompositeOperation='screen';
      for (const v of S.veins) drawVein(ctx,v);
      ctx.globalCompositeOperation='source-over';
    }

    let lastDrawAt=0;
    function frame(now) {
      if (!S.alive||!S.running) return;
      const dt=Math.min(50,now-(S.prevTime||now))/1000; S.prevTime=now;
      if (S.rawMx!==null) {
        if (S.smx===null) { S.smx=S.rawMx; S.smy=S.rawMy; }
        else { const k=1-Math.exp(-dt/0.08); S.smx+=(S.rawMx-S.smx)*k; S.smy+=(S.rawMy-S.smy)*k; }
      } else { S.smx=null; S.smy=null; }
      if (dt>0 && now-lastDrawAt >= 33) {
        lastDrawAt=now;
        try { draw(now,dt); }
        catch(e) { S.alive=false; cancelAnimationFrame(rafId); console.warn('[LightningCanvas]',e); return; }
      }
      rafId=requestAnimationFrame(frame);
    }

    function onMove(e)  { S.rawMx=e.clientX; S.rawMy=e.clientY; }
    function onLeave()  { S.rawMx=null; S.rawMy=null; }
    function onResize() { resize(); }
    function onVis() {
      S.running=!document.hidden;
      if (S.running) { S.prevTime=performance.now(); rafId=requestAnimationFrame(frame); }
      else cancelAnimationFrame(rafId);
    }

    try { resize(); } catch(e) { console.warn('[LightningCanvas] init',e); }
    window.addEventListener('resize',onResize);
    window.addEventListener('mousemove',onMove,{passive:true});
    window.addEventListener('mouseleave',onLeave);
    document.addEventListener('visibilitychange',onVis);

    if (reduce) {
      try { staticSnapshot(); } catch(e) { console.warn('[LightningCanvas] static',e); }
    } else {
      S.running=true; S.prevTime=performance.now();
      rafId=requestAnimationFrame(frame);
    }

    return () => {
      S.alive=false; S.running=false; cancelAnimationFrame(rafId);
      window.removeEventListener('resize',onResize);
      window.removeEventListener('mousemove',onMove);
      window.removeEventListener('mouseleave',onLeave);
      document.removeEventListener('visibilitychange',onVis);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:'fixed', inset:0,
        width:'100%', height:'100%',
        display:'block',
        pointerEvents:'none',
        zIndex:0,
        opacity:0.18,
      }}
    />
  );
}
