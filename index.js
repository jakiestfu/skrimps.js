(function() {

  // Shim with setTimeout fallback
  window.requestAnimationFrame = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(f) {
      window.setTimeout(f, 1e3 / 60)
    }
  }();

  function num_between(n1, n2) {
    return Math.random() * (n2 - n1) + n1;
  }

  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');

  var W = canvas.width = window.innerWidth;
  var H = canvas.height = window.innerHeight;

  var gravity = 0.3;
  var skrimp_count = 1;

  var image = new Image();
  image.src = 'http://i.imgur.com/odq0tWh.png';

  function Skreeyump(opts) {
    this.radius = num_between(10, 30);
    this.x = opts.x;
    this.y = opts.y;
    this.show = true;
    this.vx = num_between(-5, 5);
    this.vy = num_between(-14, -7) //Math.random() * -14 - 7;

    this.draw = function() {
      ctx.drawImage(image, this.x, this.y, this.radius, this.radius);
    };
  }

  var skrimps = [];
  var isComplete = false;
  var skrimper;

  function renderSkrimps() {

    if (!isComplete) {
      skrimper = requestAnimationFrame(renderSkrimps);
    }
    // Clearing screen to prevent trails
    ctx.clearRect(0, 0, W, H);

    // Update values
    var shownSkrimps = false;
    skrimps.forEach(function(skrimp) {

      skrimp.vy += gravity;

      skrimp.x += skrimp.vx;
      skrimp.y += skrimp.vy;

      // Reset position/velocity
      if (
        skrimp.x > W ||
        skrimp.x < -(skrimp.radius) ||
        skrimp.y > H
      ) {
        skrimp.show = false;
      } else {
        shownSkrimps = true;
      }
      if (skrimp.show) skrimp.draw();
    });
    if (!shownSkrimps) {
      cancelAnimationFrame(skrimper);
    }
  }

  function skrimpBlast(e) {
    var x = e.clientX;
    var y = e.clientY;

    for (var i = 0; i < skrimp_count; i++) {
      var skrimp = new Skreeyump({
        x: x,
        y: y
      });
      skrimps.push(skrimp);
    }
    cancelAnimationFrame(skrimper);
    renderSkrimps();
  }

  var mousedown = false;
  $(document)
    .on('mousedown', function(e) {
      mousedown = true;
      skrimpBlast(e);
    })
    .on('mousemove', function(e) {
      if (mousedown) {
          skrimpBlast(e);
      }
    })
    .on('mouseup', function(e) {
      mousedown = false;
    });

}());
