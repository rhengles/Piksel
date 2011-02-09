(function() {
  var px = new Piksel(
    document.getElementsByTagName('canvas')[0],
    {cell: 8, zoom: 2}
  );

  var p1 = px.point3D(0,0,0),
    p2 = px.point3D(0,0,1);

  px.fillBackground()

    .fillTriangle(p1, 1)
    .fillTriangle(p1, 3)
    .fillTriangle(p1, 5)

    .fillTriangle(p2, 2)
    .fillTriangle(p2, 4)
    .fillTriangle(p2, 6)

    .fillCube(px.point3D(3,0,0))

    .lineXArbitraryP2D(px.point3D(0,2,0).to2D(), px.cell)
    .lineYArbitraryP2D(px.point3D(0,2,-1).to2D(), px.cell)
    .lineZArbitraryP2D(px.point3D(0,2,0).to2D(), px.cell)

    .lineX(px.point3D(0,2,3), 2)
    .lineY(px.point3D(0,2,1), 2)
    .lineZ(px.point3D(0,2,3), 2);
})();