
function Piksel(canvas, options) {
  if ( !( canvas instanceof HTMLCanvasElement ) )
    throw new Error('<canvas> parameter missing or invalid');
  var utils = Piksel.utils;
  this.cv = canvas;
  this.ct = canvas.getContext('2d');
  this.size = this.p2d(
    canvas.width,
    canvas.height );
  this.offset = this.p2d(
    parseInt(this.size.x/2, 10),
    parseInt(this.size.y/2, 10) );
  var opt = utils.extend({}, Piksel.defaultOptions);
  if ( options ) {
    if ( options.fill ) {
      options.fill = utils.extend(opt.fill, options.fill);
    }
    utils.extend(opt, options);
  }
  utils.extend(this, opt);
  this._initFillHelpers();
  this.unit = this.cell*this.zoom;
  this.doub = 2*this.unit;
  this.half = parseInt(this.unit/2, 10);
  this.offUnits = this.unitsRect(this.size, this.offset);
  this.cursor3D = this.p3d(0,0,0);
}
Piksel.utils = {
  propList: function(obj) {
    var list = [];
    for ( var prop in obj )
      if ( obj.hasOwnProperty(prop) )
        list.push(prop);
    return list;
  },
  extend: function(target, source) {
    var plist = Piksel.utils.propList(source);
    for ( var n in plist ) {
      var prop = plist[n];
      target[prop] = ( source[prop] instanceof Object )
        ? Piksel.utils.extend({}, source[prop])
        : source[prop];
    }
    return target;
  }
};
Piksel.defaultOptions = {
  cell: 4,
  zoom: 4,
  fill: {
    def: '#000000',
    li: '#B0B0B8',
    xa: '#00BB00',
    xb: '#00DD00',
    xxya: '#00BB5D',
    xxyb: '#00DD6E',
    xya: '#00BBBB',
    xyb: '#00DDDD',
    xyya: '#005DBB',
    xyyb: '#006EDD',
    ya: '#0000BB',
    yb: '#0000DD',
    yyza: '#5D00BB',
    yyzb: '#6E00DD',
    yza: '#BB00BB',
    yzb: '#DD00DD',
    yzza: '#BB005D',
    yzzb: '#DD006E',
    za: '#BB0000',
    zb: '#DD0000',
    zzxa: '#BB5D00',
    zzxb: '#DD6E00',
    zxa: '#BBBB00',
    zxb: '#DDDD00',
    zxxa: '#5DBB00',
    zxxb: '#6EDD00',
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
    this.piksel.offset.x + (this.y-this.x)*this.piksel.doub,
    this.piksel.offset.y + this.z*this.piksel.doub - (this.x+this.y)*this.piksel.unit
  );
};
Piksel.point3D.prototype.placeTriangle = function(i) {
  return this.to2D().placeTriangle(i);
};

Piksel.prototype.p2d = function(x, y) {
  return new Piksel.point2D(this, x, y);
};
Piksel.prototype.p3d = function(x, y, z) {
  return new Piksel.point3D(this, x, y, z);
};

Piksel.prototype.unitsRect = function(size, offset) {
  return {
    left  : Math.ceil(offset.x/this.doub),
    right : Math.ceil((size.x-offset.x)/this.doub),
    top   : Math.ceil(offset.y/this.unit),
    bottom: Math.ceil((size.y-offset.y)/this.unit)
  };
};
Piksel.prototype._initFillHelpers = function() {
  function setFill(color) {
    this.ct.fillStyle = color;
    return this;
  }
  var self = this,
    plist = Piksel.utils.propList(this.fill);
  for ( var n in plist ) {
    var prop = plist[n],
      color = this.fill[prop];
    this.fill[prop] = (function(color) {
      return function() {
        return setFill.call(self, color);
      };
    })(color);
    this.fill[prop].value = color;
  }
  this.fill.set = function(color) {
    return setFill.call(self, color);
  };
};
Piksel.prototype.fillTriangleP2D = function(p2d, ltr) {
  for ( var i = 0; i < this.cell; i += 1 ) {
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
    p3d.placeTriangle(pos),
    Boolean(pos%2)
  );
};
Piksel.diag = {
  FRONT: 0x8,
  REAR: 0,
  UP: 0x4,
  DOWN: 0,
  AXIS_X: 0x3,
  AXIS_Y: 0x2,
  AXIS_Z: 0x1,
  X_REAR_DOWN: 0x3,
  Y_REAR_DOWN: 0x2,
  Z_REAR_DOWN: 0x1,
  X_REAR_UP: 0x7,
  Y_REAR_UP: 0x6,
  Z_REAR_UP: 0x5,
  X_FRONT_DOWN: 0xB,
  Y_FRONT_DOWN: 0xA,
  Z_FRONT_DOWN: 0x9,
  X_FRONT_UP: 0xF,
  Y_FRONT_UP: 0xE,
  Z_FRONT_UP: 0xD
};
Piksel.prototype.fillDiagonalXYP2D = function(p2d, diag) {
  if ( !(diag & Piksel.diag.AXIS_Y) )
    throw new Error('Diagonal must be AXIS_X or AXIS_Y');
  var p = {
    up: Boolean(diag & Piksel.diag.UP),
    down: null,
    front: Boolean(diag & Piksel.diag.FRONT),
    rear: null,
    axisX: Boolean(diag & Piksel.diag.AXIS_Z), // Z because 01(Z) & 10(Y) == 0(false)
    axisY: null,
    left: null
  };
  p.down = !p.up;
  p.rear = !p.front;
  p.axisY = !p.axisX;
  p.left = (p.axisX && p.rear) || (p.axisY && p.front);
  p2d = this.p2d(
    p2d.x - (p.left ? this.doub : 0),
    p2d.y - (p.left ? this.unit : (p.rear ? this.doub : 0)) );
  for (var i = 0; i < this.cell; i++) {
    var height = (p.axisX ? this.cell-i-1 : i)*2+1,
      rect = {
        x: p2d.x+i*2*this.zoom,
        y: p2d.y+((p.axisX ? -i : i)+(p.up ? 0 : height))*this.zoom,
        w: this.zoom,
        h: (p.up ? height : this.cell*2-height)*this.zoom
      };
    this.ct.fillRect( rect.x, rect.y, rect.w, rect.h );
    this.ct.fillRect( rect.x+this.zoom, rect.y+(p.axisX ? -this.zoom : this.zoom), rect.w, rect.h );
  }
  return this;
};
Piksel.prototype.fillDiagonalZP2D = function(p2d, diag) {
  if ( !(diag & Piksel.diag.AXIS_Z) )
    throw new Error('Diagonal must be AXIS_Z');
  var p = {
    up: Boolean(diag & Piksel.diag.UP),
    down: null,
    front: Boolean(diag & Piksel.diag.FRONT),
    rear: null
  };
  p.down = !p.up;
  p.rear = !p.front;
  p2d = this.p2d(
    p2d.x - this.doub,
    p2d.y + (p.front ? -this.unit : this.unit) );
  for (var i = 0; i < this.cell; i++) {
    this.ct.fillRect(
      p2d.x + (i*2+1)*this.zoom,
      p2d.y + (p.up ? (-1-i)*this.zoom : i*this.zoom),
      ((this.cell-i)*4-2)*this.zoom,
      this.zoom
    );
  }
  return this;
};
Piksel.prototype.fillDiagonalP2D = function(p2d, diag) {
  if ( diag & Piksel.diag.AXIS_Y )
    return this.fillDiagonalXYP2D(p2d, diag);
  else if ( diag & Piksel.diag.AXIS_Z )
    return this.fillDiagonalZP2D(p2d, diag);
  else throw new Error('Diagonal: Axis not found');
};
Piksel.prototype.fillDiagonal = function(p3d, diag) {
  return this.fillDiagonalP2D(p3d.to2D(), diag);
};
Piksel.prototype.fillFaceX = function(p3d) {
  return this
    .fill.xa()
    .fillTriangle(p3d, 2)
    .fill.xb()
    .fillTriangle(p3d, 3)
    .fill.def();
};
Piksel.prototype.fillFaceY = function(p3d) {
  return this
    .fill.ya()
    .fillTriangle(p3d, 4)
    .fill.yb()
    .fillTriangle(p3d, 5)
    .fill.def();
};
Piksel.prototype.fillFaceZ = function(p3d) {
  return this
    .fill.za()
    .fillTriangle(p3d, 6)
    .fill.zb()
    .fillTriangle(p3d, 1)
    .fill.def();
};
Piksel.prototype.fillCube = function(p3d) {
  return this
    .fillFaceX(p3d)
    .fillFaceY(p3d)
    .fillFaceZ(p3d);
};
Piksel.prototype.fillBackground = function() {
  return this.fillRect(this.offset, this.offUnits);
};
Piksel.prototype.fillRect = function(offset, units) {
  for ( var row = 0; row < (units.top+units.bottom+1); row++ ) {
    for ( var col = 0; col < (units.left+units.right); col++ ) {
      var p2d = this.p2d(
        offset.x+(col-units.left)*this.doub,
        offset.y+(row-units.top)*this.unit );
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
Piksel.prototype._lineOblique = function(p2d, len, up, width) {
  if (up) {
    p2d = this.p2d(
      p2d.x - len*this.zoom*2,
      p2d.y + len*this.zoom );
  }
  this.ct.fillRect(
    p2d.x,
    p2d.y-this.zoom,
    this.zoom,
    width*this.zoom
  );
  for ( var i = 1; i < len; i++ ) {
    this.ct.fillRect(
      p2d.x+(2*i-1)*this.zoom,
      p2d.y+(up?-i-1:i-1)*this.zoom,
      2*this.zoom,
      width*this.zoom
    );
  }
  this.ct.fillRect(
    p2d.x+(2*len-1)*this.zoom,
    p2d.y+(up?-len-1:len-1)*this.zoom,
    this.zoom,
    width*this.zoom
  );
  return this;
};
Piksel.prototype._lineVertical = function(p2d, len, width) {
  // Line start at bottom
  this.ct.fillRect(
    p2d.x-1*this.zoom,
    p2d.y-(2*len*this.zoom),
    width*this.zoom,
    2*len*this.zoom
  );
  return this;
};
Piksel.prototype.lineXArbitraryP2D = function(p2d, len) {
  return this._lineOblique(p2d, len, false, 2);
};
Piksel.prototype.lineYArbitraryP2D = function(p2d, len) {
  return this._lineOblique(p2d, len, true, 2);
};
Piksel.prototype.lineZArbitraryP2D = function(p2d, len) {
  return this._lineVertical(p2d, len, 2);
};
Piksel.prototype.lineXP2D = function(p2d, len) {
  return this.lineXArbitraryP2D(p2d, len*this.cell);
};
Piksel.prototype.lineYP2D = function(p2d, len) {
  return this.lineYArbitraryP2D(p2d, len*this.cell);
};
Piksel.prototype.lineZP2D = function(p2d, len) {
  return this.lineZArbitraryP2D(p2d, len*this.cell);
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
Piksel.prototype.lineBackground = function() {
  return this.lineRect(this.offset, this.offUnits);
};
Piksel.prototype.lineRect = function(offset, units) {
  var cols = units.left+units.right+1,
    rows = Math.ceil((units.top+units.bottom)/2),
    bound = {
      left: offset.x-units.left*this.doub,
      right: offset.x+units.right*this.doub,
      top: offset.y-units.top*this.unit,
      bottom: offset.y+units.bottom*this.unit
    },
    even = {
      col   : null,
      left  : units.left   % 2 === 0,
      top   : units.top    % 2 === 0,
      right : units.right  % 2 === 0,
      bottom: units.bottom % 2 === 0,
      horizontal: (units.left+units.right) % 2 === 0,
      vertical  : (units.top+units.bottom) % 2 === 0
    }, p2dx, p2dy, p2dz, xUpper, yUpper, zUpper, zLower;
  this.fill.li();
  for ( var col = 0; col < cols; col++ ) {
    even.col = (col-units.left) % 2 === 0;
    zLower = (even.bottom ? !even.col : even.col);
    zUpper = (even.top ? !even.col : even.col);
    p2dz = this.p2d(
      bound.left + col*this.doub,
      bound.bottom+(zLower ? this.unit : 0));
    this.lineZP2D(p2dz, rows+(even.vertical && zLower ? 1 : 0));
    if (zUpper && col != 0 && col != cols-1) {
      p2dz = this.p2d(
        p2dz.x, bound.top - this.unit );
      this.lineXP2D(p2dz, Math.min(cols-col-1, 2*rows+(even.vertical ? 2 : 1)));
      this.lineYP2D(p2dz, Math.min(col, 2*rows+(even.vertical ? 2 : 1)));
    }
  }
  for ( var row = 0; row <= rows; row++ ) {
    xUpper = even.top ? !even.left  : even.left;
    yUpper = even.top ? !even.right : even.right;
    p2dx = this.p2d(
      bound.left, bound.top + row*this.doub - (xUpper ? this.unit : 0) );
    p2dy = this.p2d(
      bound.right, bound.top + row*this.doub - (yUpper ? this.unit : 0) );
    this.lineXP2D(p2dx, Math.min(cols-1,
      2*(rows-row)
      + (even.vertical ? 1 : 0)
      + (xUpper ? 1 : 0)));
    this.lineYP2D(p2dy, Math.min(cols-1,
      2*(rows-row)
      + (even.vertical ? 1 : 0)
      + (yUpper ? 1 : 0)));
  }
  this.fill.def();
  return this;
};
