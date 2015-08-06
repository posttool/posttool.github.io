xmenu = function(g2d)
{
    var S = 100, OX = 590, OY = 420,
    mouseX = 0, mouseY = 0,
    renderBox = 1, renderBoxAt = 1;
    
    
    var projector = new THREE.Projector();
    var camera = new THREE.Camera( 11, 1, 1, 10000 );
    camera.position.z = 1000;

    var scene = new THREE.Scene();
    var geometry = new THREE.Geometry();
    for ( var i = 0; i < 16; i ++ ) 
    {
        geometry.vertices.push( new THREE.Vertex( new THREE.Vector3(get_r(),get_r(),get_r()) )  );
    }
    var line = new THREE.Line( geometry );
    scene.addObject( line );

    return {
        camera: camera,
        animate: animate,
        move: function(node)
        { 
            mouseX = Math.random()*2*Math.PI - Math.PI; 
            mouseY = Math.random()*2*Math.PI - Math.PI; 
        }
    }
    
    function get_r()
    {
        return (Math.random() * 2 - 1)*1500;
    }
    
    function get_yr()
    {
        var y = Math.random() < .5 ? 120 : -100;
        y += (Math.random() * 2 - 1)*10;
        return y;
    }
    function get_cr(){
        return Math.floor(Math.random()*0xff);
    }
    
    function render_line( v1, v2 ) 
    {
        g2d.globalAlpha = .05;
        //setBlending( material.blending );
    
        g2d.beginPath();
        g2d.moveTo( v1.sx, v1.sy );
        g2d.lineTo( v2.sx, v2.sy );
        g2d.closePath();
    
        g2d.lineWidth = 1;
        g2d.lineCap = "square";
        g2d.lineJoin = "miter";
        g2d.strokeStyle = "white";
        g2d.stroke();
    }
    
    function get_box(p)
    {
        var v1 = { x: Math.min(p.v1.sx,p.v2.sx), y: Math.min(p.v1.sy,p.v2.sy) }, 
            v2 = { x: Math.max(p.v1.sx,p.v2.sx), y: Math.max(p.v1.sy,p.v2.sy) };
        
        var x = v1.x;
        var y = v1.y;
        var w = v2.x - x;
        var h = v2.y - y;
        
        return {x:x,y:y,w:w,h:h};
    }
    
    function render_box(p,color,alpha)
    {
        var b = get_box(p);
        g2d.globalAlpha = alpha * renderBoxAt;
        g2d.fillStyle = color;
        g2d.fillRect(b.x, b.y, b.w, b.h);
        renderBoxAt += (renderBox - renderBoxAt)*.1;
    }
    
    function render() 
    {
        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y += ( - mouseY + 200 - camera.position.y ) * .05;
        line.rotation.y += ( mouseX  - line.rotation.y ) * .005;
        
        var renderList = projector.projectScene( scene, camera, false );
        for (var e = 0, el = renderList.length; e < el; e++ ) 
        {
            var element = renderList[ e ];
            element.v1.sx = element.v1.positionScreen.x*S+OX;
            element.v1.sy = element.v1.positionScreen.y*S+OY;
            element.v2.sx = element.v2.positionScreen.x*S+OX;
            element.v2.sy = element.v2.positionScreen.y*S+OY;
        }
        for (var e = 0; e < renderList.length; e++ ) 
        {
            var el = renderList[ e ];
        
            render_line( el.v1, el.v2);
            for (var e0 = 0; e0 < e; e0++)
            {
                var e1 = renderList[ e0 ];
                render_line( el.v1, e1.v2);
            }
            if (Math.random()<.5)
                render_box(renderList[e], "#ffffff", .02);
            else{
                var ccc = Math.floor(camera.position.z*.02);
                render_box(renderList[e], "rgb("+ccc+","+ccc+","+ccc+")", .02);
            }
            
        }
        g2d.globalAlpha = 1;
    }

    function animate() 
    {
        requestAnimationFrame( animate );
        render();
    }
    
    
}