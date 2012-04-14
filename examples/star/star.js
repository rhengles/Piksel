(function() {
  var px = new Piksel(
    document.getElementsByTagName('canvas')[0],
    {cell: 8, zoom: 5, fill: {oa: '#C8C8D0', ob: '#E8E8F0'}}
  );

  var p1 = px.p3d(-1,0,0),
    p2   = px.p3d(0,-1,0),
    p3   = px.p3d(0,0,-1),
    p1n  = px.p3d(1,0,0),
    p2n  = px.p3d(0,1,0),
    p3n  = px.p3d(0,0,1),
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
    .fillDiagonal(p1, Piksel.diag.X_FRONT_DOWN)
    .fill.zzxa()
    .fillDiagonal(p1, Piksel.diag.X_FRONT_UP)
    .fill.zxxb()
    .fillDiagonal(p3n, Piksel.diag.Z_REAR_UP)
    .fill.zxxa()
    .fillDiagonal(p3n, Piksel.diag.Z_REAR_DOWN)
    .fill.xxyb()
    .fillDiagonal(p2, Piksel.diag.Y_FRONT_DOWN)
    .fill.xxya()
    .fillDiagonal(p2, Piksel.diag.Y_FRONT_UP)
    .fill.xyyb()
    .fillDiagonal(p1n, Piksel.diag.X_REAR_DOWN)
    .fill.xyya()
    .fillDiagonal(p1n, Piksel.diag.X_REAR_UP)
    .fill.yyzb()
    .fillDiagonal(p3, Piksel.diag.Z_FRONT_UP)
    .fill.yyza()
    .fillDiagonal(p3, Piksel.diag.Z_FRONT_DOWN)
    .fill.yzzb()
    .fillDiagonal(p2n, Piksel.diag.Y_REAR_DOWN)
    .fill.yzza()
    .fillDiagonal(p2n, Piksel.diag.Y_REAR_UP)
    ;
})();