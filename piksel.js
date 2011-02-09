
var utils = {
  propList: function(obj) {
    var list = [];
    for ( var prop in obj )
      if ( obj.hasOwnProperty(prop) )
        list.push(prop);
    return list;
  },
  extend: function(target, source) {
    var plist = utils.propList(source);
    for ( var n in plist ) {
      var prop = plist[n];
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
  this._initFillHelpers();
  this.unit = this.cell*this.zoom;
  this.doub = 2*this.unit;
  this.half = parseInt(this.unit/2);
  this.cursor3D = this.point3D(0,0,0);
}
Piksel.defaultOptions = {
  cell: 4,
  zoom: 4,
  fill: {
    def: '#000000',
    xa: '#00BB00',
    xb: '#00DD00',
    ya: '#0000BB',
    yb: '#0000DD',
    za: '#BB0000',
    zb: '#DD0000',
    oa: '#F0F0F4',
    ob: '#F8F8FA',
    ha: '#808080',
    hb: '#909090'
  }
};
Piksel.triMap = {
  x: [null, 0, 1, 0, 0, -1, 0],
  y: [null, -1, 0, 1, 1, 0, -1]
};

Piksel.fn = {};
Piksel.fn.setFill = function(instance, color) {
  return function() {
    instance.ct.fillStyle = color;
  };
};

Piksel.point2D = function(pk, x, y) {
  this.piksel = pk;
  this.x = x;
  this.y = y;
  return this;
};
Piksel.point2D.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
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

Piksel.prototype._initFillHelpers = function() {
  var plist = utils.propList(this.fill);
  for ( var n in plist ) {
    var prop = plist[n],
      color = this.fill[prop];
    this.fill[prop] = Piksel.fn.setFill(this, color);
    this.fill[prop].value = color;
  }
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
  this.fill.zb();
  this.fillTriangle(p3d, 1);
  this.fill.xa();
  this.fillTriangle(p3d, 2);
  this.fill.xb();
  this.fillTriangle(p3d, 3);
  this.fill.ya();
  this.fillTriangle(p3d, 4);
  this.fill.yb();
  this.fillTriangle(p3d, 5);
  this.fill.za();
  this.fillTriangle(p3d, 6);
  this.fill.def();
  return this;
};
Piksel.prototype.fillBackground = function() {
  var offLeft = this.offsetLeft,
    offTop = this.offsetTop,
    units = {
      left  : Math.ceil(offLeft/this.doub),
      right : Math.ceil((this.fullWidth-offLeft)/this.doub),
      top   : Math.ceil(offTop/this.unit),
      bottom: Math.ceil((this.fullHeight-offTop)/this.unit)+1
    };
  for ( var row = 0; row < (units.top+units.bottom); row++ ) {
    for ( var col = 0; col < (units.left+units.right); col++ ) {
      var p2d = this.point2D(
        offLeft+(col-units.left)*this.doub,
        offTop+(row-units.top)*this.unit );
      if ( (row+units.top)%2 == (col+units.left)%2 ) {
        this.fill.oa();
        this.fillTriangleP2D(p2d.move(this.doub, 0), false);
      } else {
        this.fill.ob();
        this.fillTriangleP2D(p2d, true);
      }
    }
  }
  this.fill.def();
  return this;
};
Piksel.prototype._lineOblique = function(p2d, len, up) {
  this.ct.fillRect(
    p2d.x,
    p2d.y-this.zoom,
    this.zoom,
    2*this.zoom
  );
  for ( var i = 1; i < len; i++ ) {
    this.ct.fillRect(
      p2d.x+(2*i-1)*this.zoom,
      p2d.y+(up?-i-1:i-1)*this.zoom,
      2*this.zoom,
      2*this.zoom
    );
  }
  this.ct.fillRect(
    p2d.x+(2*len-1)*this.zoom,
    p2d.y+(up?-len-1:len-1)*this.zoom,
    this.zoom,
    2*this.zoom
  );
  return this;
};
Piksel.prototype.lineXArbitraryP2D = function(p2d, len) {
  return this._lineOblique(p2d, len, true);
};
Piksel.prototype.lineYArbitraryP2D = function(p2d, len) {
  return this._lineOblique(p2d, len, false);
};
Piksel.prototype.lineZArbitraryP2D = function(p2d, len) {
  this.ct.fillRect(
    p2d.x-1*this.zoom,
    p2d.y-(2*len*this.zoom),
    2*this.zoom,
    2*len*this.zoom
  );
  return this;
};
Piksel.prototype.lineX = function(p3d, len) {
  return this.lineXArbitraryP2D(p3d.to2D(), len*this.cell);
};
Piksel.prototype.lineY = function(p3d, len) {
  return this.lineYArbitraryP2D(p3d.to2D(), len*this.cell);
};
Piksel.prototype.lineZ = function(p3d, len) {
  return this.lineZArbitraryP2D(p3d.to2D(), len*this.cell);
};
