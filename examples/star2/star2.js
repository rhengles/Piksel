(function() {
  var px = new Piksel(
    document.getElementsByTagName('canvas')[0],
    {cell: 10, zoom: 4, fill: {oa: '#C8C8D0', ob: '#E8E8F0'}}
  );

  var p1 = px.p3d(-1,0,0),
    p2   = px.p3d(0,-1,0),
    p3   = px.p3d(0,0,-1),
    p1n  = px.p3d(1,0,0),
    p2n  = px.p3d(0,1,0),
    p3n  = px.p3d(0,0,1),
    p4   = px.p3d(-2,0,0),
    p5   = px.p3d(0,-2,0),
    p6   = px.p3d(0,0,-2),
    p4n  = px.p3d(2,0,0),
    p5n  = px.p3d(0,2,0),
    p6n  = px.p3d(0,0,2),
    pt1  = px.p3d(-1,1,0),
    pt2  = px.p3d(-1,0,1),
    pt3  = px.p3d(0,-1,1),
    pt4  = px.p3d(1,-1,0),
    pt5  = px.p3d(1,0,-1),
    pt6  = px.p3d(0,1,-1),
    bgUnits = Piksel.utils.extend({}, px.offUnits);

  bgUnits.top    -= 2;
  bgUnits.bottom -= 2;

  px.fillRect(px.offset, bgUnits)

    //.lineBackground()
    .lineRect(px.offset, bgUnits)

    .fill.zb()
    .fillDiagonal(p1, Piksel.diag.Z_FRONT_UP)
    .fill.za()
    .fillDiagonal(p1, Piksel.diag.Z_FRONT_DOWN)
    .fill.zxb()
    .fillDiagonal(p1, Piksel.diag.Y_FRONT_DOWN)
    .fill.zxa()
    .fillDiagonal(p1, Piksel.diag.Y_FRONT_UP)

    .fill.xb()
    .fillDiagonal(p2, Piksel.diag.X_FRONT_DOWN)
    .fill.xa()
    .fillDiagonal(p2, Piksel.diag.X_FRONT_UP)
    .fill.xyb()
    .fillDiagonal(p2, Piksel.diag.Z_FRONT_UP)
    .fill.xya()
    .fillDiagonal(p2, Piksel.diag.Z_FRONT_DOWN)

    .fill.yb()
    .fillDiagonal(p3, Piksel.diag.Y_FRONT_DOWN)
    .fill.ya()
    .fillDiagonal(p3, Piksel.diag.Y_FRONT_UP)
    .fill.yzb()
    .fillDiagonal(p3, Piksel.diag.X_FRONT_DOWN)
    .fill.yza()
    .fillDiagonal(p3, Piksel.diag.X_FRONT_UP)

    .fill.zzxb()
    .fillDiagonal(p4, Piksel.diag.X_REAR_DOWN)
    //.fill.zzxa()
    .fillDiagonal(p4, Piksel.diag.X_FRONT_UP)
    .fill.zxxb()
    .fillDiagonal(p6n, Piksel.diag.Z_REAR_UP)
    //.fill.zxxa()
    .fillDiagonal(p6n, Piksel.diag.Z_FRONT_DOWN)
    .fill.xxyb()
    .fillDiagonal(p5, Piksel.diag.Y_REAR_DOWN)
    //.fill.xxya()
    .fillDiagonal(p5, Piksel.diag.Y_FRONT_UP)
    .fill.xyyb()
    .fillDiagonal(p4n, Piksel.diag.X_REAR_DOWN)
    //.fill.xyya()
    .fillDiagonal(p4n, Piksel.diag.X_FRONT_UP)
    .fill.yyzb()
    .fillDiagonal(p6, Piksel.diag.Z_REAR_UP)
    //.fill.yyza()
    .fillDiagonal(p6, Piksel.diag.Z_FRONT_DOWN)
    .fill.yzzb()
    .fillDiagonal(p5n, Piksel.diag.Y_REAR_DOWN)
    //.fill.yzza()
    .fillDiagonal(p5n, Piksel.diag.Y_FRONT_UP)

    .fill.yzza()

    .fillTriangle(pt1, 1)
    .fill.zb()
    .fillTriangle(pt1, 2)
    .fill.zzxa()
    .fillTriangle(pt1, 3)

    .fillTriangle(pt2, 2)
    .fill.zxb()
    .fillTriangle(pt2, 3)
    .fill.zxxa()
    .fillTriangle(pt2, 4)

    .fillTriangle(pt3, 3)
    .fill.xb()
    .fillTriangle(pt3, 4)
    .fill.xxya()
    .fillTriangle(pt3, 5)

    .fillTriangle(pt4, 4)
    .fill.xyb()
    .fillTriangle(pt4, 5)
    .fill.xyya()
    .fillTriangle(pt4, 6)

    .fillTriangle(pt5, 5)
    .fill.yb()
    .fillTriangle(pt5, 6)
    .fill.yyza()
    .fillTriangle(pt5, 1)

    .fillTriangle(pt6, 6)
    .fill.yzb()
    .fillTriangle(pt6, 1)
    .fill.yzza()
    .fillTriangle(pt6, 2)
    ;
})();