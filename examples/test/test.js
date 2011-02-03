(function() {
  var px = new Piksel(
    document.getElementsByTagName('canvas')[0],
    {cell: 8, zoom: 2}
  );
  /*console.log(px.coord(0,0,0));
  console.log(px.coord(0,0,1));
  console.log(px.coord(0,1,0));
  console.log(px.coord(1,0,0));
  console.log(px.coord(1,1,1));*/
  
  /*px.fillTriangle(px.coord(0,0,0), true);
  px.fillTriangle(px.coord(0,0,0), false);
  px.fillTriangle(px.coord(1,0,0), true);
  px.fillTriangle(px.coord(1,0,0), false);
  px.fillTriangle(px.coord(0,1,0), true);
  px.fillTriangle(px.coord(0,1,0), false);
  px.fillTriangle(px.coord(-1,0,0), true);
  px.fillTriangle(px.coord(-1,0,0), false);
  px.fillTriangle(px.coord(0,-1,0), true);
  px.fillTriangle(px.coord(0,-1,0), false);*/

  /*px.ct.fillStyle = '#0c0';
  px.fillFace('x', px.dim(0,0,1), {y: 2, z: 2});
  px.ct.fillStyle = '#00c';
  px.fillFace('y', px.dim(0,0,1), {z: 2, x: 3});
  px.ct.fillStyle = '#c00';
  px.fillFace('z', px.dim(0,0,0), {y: 2, x: 3});*/

  var p1 = px.point3D(0,0,0),
    p2 = px.point3D(0,0,1);

  px.fillTriangle(p1, 1)
    .fillTriangle(p1, 3)
    .fillTriangle(p1, 5)

    .fillTriangle(p2, 2)
    .fillTriangle(p2, 4)
    .fillTriangle(p2, 6)

    .fillCube(px.point3D(3,0,0));
})();