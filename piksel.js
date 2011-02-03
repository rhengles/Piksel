
var utils = {
  extend: function(target, source) {
    for ( var prop in source ) {
      if ( source.hasOwnProperty(prop) )
        target[prop] = source[prop];
    }
    return target;
  }
};

function Piksel(canvas, options) {
  if ( !( canvas instanceof HTMLCanvasElement ) )
    throw new Error('<canvas> parameter missing or invalid');
  this.cv = canvas;
  this.ct = canvas.getContext('2d');
  this.fullWidth = canvas.width;
  this.fullHeight = canvas.height;
  this.offsetLeft = parseInt(this.fullWidth/2);
  this.offsetTop = parseInt(this.fullHeight/2);
  utils.extend(this, options === null
    ? Piksel.defaultOptions
    : utils.extend(Piksel.defaultOptions, options) );
  this.unit = this.cell*this.zoom;
  this.doub = 2*this.unit;
  this.half = parseInt(this.unit/2);
  this.cursor3D = this.point3D(0,0,0);
}
Piksel.defaultOptions = {
  cell: 4,
  zoom: 4,
  fill: {
    xa: '#00BB00',
    xb: '#00DD00',
    ya: '#0000BB',
    yb: '#0000DD',
    za: '#BB0000',
    zb: '#DD0000',
    oa: '#D0D0D0',
    ob: '#E0E0E0',
    ha: '#808080',
    hb: '#909090'
  }
};
Piksel.triMap = {
  x: [null, 0, 1, 0, 0, -1, 0],
  y: [null, -1, 0, 1, 1, 0, -1]
};

Piksel.point2D = function(pk, x, y) {
  this.piksel = pk;
  this.x = x;
  this.y = y;
  return this;
};
Piksel.point2D.prototype.placeTriangle = function(i) {
  if ( !i || i < 1 || i > 6 ) {
    throw new Error('<index> parameter missing or invalid');
  }
  this.x += Piksel.triMap.x[i]*this.piksel.doub;
  this.y += Piksel.triMap.y[i]*this.piksel.unit;
  return this;
};
Piksel.point3D = function(pk, x, y, z) {
  this.piksel = pk;
  this.x = x;
  this.y = y;
  this.z = z;
  return this;
};
Piksel.point3D.prototype.to2D = function() {
  return new Piksel.point2D( this.piksel,
    this.piksel.offsetLeft + (this.y-this.x)*this.piksel.doub,
    this.piksel.offsetTop + this.z*this.piksel.doub - (this.x+this.y)*this.piksel.unit
  );
};

Piksel.prototype.point2D = function(x, y) {
  return new Piksel.point2D(this, x, y);
};
Piksel.prototype.point3D = function(x, y, z) {
  return new Piksel.point3D(this, x, y, z);
};

Piksel.prototype.fillTriangleP2D = function(p2d, ltr) {
  for ( i = 0; i < this.cell; i += 1 ) {
    this.ct.fillRect(
      p2d.x+(i*2+(ltr?(i?-1:0):1))*(ltr?1:-1)*this.zoom,
      p2d.y+(i-this.cell)*this.zoom,
      (i?2:1)*this.zoom,
      2*(this.cell-i)*this.zoom
    );
  }
  return this;
};
Piksel.prototype.fillTriangle = function(p3d, pos) {
  return this.fillTriangleP2D(
    p3d.to2D().placeTriangle(pos),
    Boolean(pos%2)
  );
};
Piksel.prototype.fillCube = function(p3d) {
  this.ct.fillStyle = this.fill.zb;
  this.fillTriangle(p3d, 1);
  this.ct.fillStyle = this.fill.xa;
  this.fillTriangle(p3d, 2);
  this.ct.fillStyle = this.fill.xb;
  this.fillTriangle(p3d, 3);
  this.ct.fillStyle = this.fill.ya;
  this.fillTriangle(p3d, 4);
  this.ct.fillStyle = this.fill.yb;
  this.fillTriangle(p3d, 5);
  this.ct.fillStyle = this.fill.za;
  this.fillTriangle(p3d, 6);
  return this;
};
