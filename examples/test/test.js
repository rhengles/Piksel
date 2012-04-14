(function() {
  var px = new Piksel(
    document.getElementsByTagName('canvas')[0],
    {cell: 8, zoom: 5, fill: {oa: '#C8C8D0', ob: '#E8E8F0'}}
  );

  var p1 = px.p3d(0,0,-2),
    p2 = px.p3d(0,0,2),
    p1_2d = p1.to2D(),
    p2_2d = p2.to2D(),
    fillUnits = Piksel.utils.extend({}, px.offUnits),
    lineUnits = Piksel.utils.extend({}, px.offUnits);

  fillUnits.top    -= 2;
  fillUnits.bottom -= 2;
  lineUnits.top    -= 2;
  lineUnits.bottom -= 2;
  //lineUnits.left   -= 1;
  //lineUnits.right  -= 1;

  px.fillRect(px.offset, fillUnits)

    //.lineBackground()
    .lineRect(px.offset, lineUnits)

    .fillCube(px.p3d(0,0,0))

    .fill.xa()
    .fillDiagonal(p1, Piksel.diag.AXIS_X | Piksel.diag.FRONT)
    .fill.xb()
    .fillDiagonal(p1, Piksel.diag.AXIS_X | Piksel.diag.FRONT | Piksel.diag.UP)
    .fill.ya()
    .fillDiagonal(p1, Piksel.diag.AXIS_Y | Piksel.diag.FRONT)
    .fill.yb()
    .fillDiagonal(p1, Piksel.diag.AXIS_Y | Piksel.diag.FRONT | Piksel.diag.UP)
    .fill.za()
    .fillDiagonal(p1, Piksel.diag.AXIS_Z | Piksel.diag.FRONT | Piksel.diag.UP)
    .fill.zb()
    .fillDiagonal(p1, Piksel.diag.AXIS_Z | Piksel.diag.FRONT)

    .fill.yza()
    .fillDiagonal(p2, Piksel.diag.AXIS_X)
    .fill.yzb()
    .fillDiagonal(p2, Piksel.diag.AXIS_X | Piksel.diag.UP)
    .fill.zxa()
    .fillDiagonal(p2, Piksel.diag.AXIS_Y)
    .fill.zxb()
    .fillDiagonal(p2, Piksel.diag.AXIS_Y | Piksel.diag.UP)
    .fill.xya()
    .fillDiagonal(p2, Piksel.diag.AXIS_Z | Piksel.diag.UP)
    .fill.xyb()
    .fillDiagonal(p2, Piksel.diag.AXIS_Z)
/*
    .fillTriangle(p1, 1)
    .fillTriangle(p1, 3)
    .fillTriangle(p1, 5)

    .fillTriangle(p2, 2)
    .fillTriangle(p2, 4)
    .fillTriangle(p2, 6)
*/
    .fill.xb()
    .lineXArbitraryP2D(px.p3d(3,-1,-2).to2D(), 2*px.cell)
    .fill.yb()
    .lineYArbitraryP2D(px.p3d(3,1,0).to2D(), 2*px.cell)
    .fill.zb()
    .lineZArbitraryP2D(px.p3d(3,-1,0).to2D(), 2*px.cell)

    .fillFaceX(px.p3d(0,2,1))
    .fillFaceX(px.p3d(0,2,2))
    .fillFaceY(px.p3d(0,5,3))
    .fillFaceY(px.p3d(1,5,3))
    .fillFaceZ(px.p3d(-1,3,3))
    .fillFaceZ(px.p3d(-1,2,3))

    .fillFaceX(px.p3d(-1,-4,-1))
    .fillFaceX(px.p3d(0,-4,0))
    .fillFaceY(px.p3d(1,-3,1))
    .fillFaceY(px.p3d(2,-2,1))
    .fillFaceZ(px.p3d(0,-3,0))
    .fillFaceZ(px.p3d(0,-4,-1))

    //.fill.xa()
    .lineX(px.p3d(0,3,1), 2)
    //.fill.ya()
    .lineY(px.p3d(-1,4,3), 2)
    //.fill.za()
    .lineZ(px.p3d(0,2,3), 2)

    //.fill.xb()
    .lineX(px.p3d(0,3,2), 2)
    //.fill.yb()
    .lineY(px.p3d(0,4,3), 2)
    //.fill.zb()
    .lineZ(px.p3d(0,3,3), 2)

    //.fill.xa()
    .lineX(px.p3d(0,2,3), 1)
    //.fill.ya()
    .lineY(px.p3d(0,3,1), 1)
    //.fill.za()
    .lineZ(px.p3d(-1,4,3), 1);
})();