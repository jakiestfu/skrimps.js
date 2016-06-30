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

  var canvas = $('<canvas class="skrimp-canvas" />').css({
    position: 'fixed',
    pointerEvents: 'none',
    top: 0, right: 0,
    bottom: 0, left: 0,
    zIndex: 9999999
  }).appendTo('body')[0];
  var ctx = canvas.getContext('2d');

  var W = canvas.width = window.innerWidth;
  var H = canvas.height = window.innerHeight;

  var gravity = 0.3;
  var skrimp_count = 50;

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
		skrimper = requestAnimationFrame(renderSkrimps);
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
      //cancelAnimationFrame(skrimper);
    }
  }

  function skrimpBlast(data) {
    for (var i = 0; i < skrimp_count; i++) {
      var skrimp = new Skreeyump({
        x: data.x,
        y: data.y
      });
      skrimps.push(skrimp);
    }
  }

  window.skrimpReady = window.skrimpReady || [];
  window.skrimpBlast = skrimpBlast;

  renderSkrimps();
  var mousedown = false;
  $(document)
    .on('mousedown', function(e) {
      mousedown = true;
      skrimpBlast({
        x: e.clientX,
        y: e.clientY
      });
    })
    .on('mousemove', function(e) {
      if (mousedown) {
        skrimpBlast({
          x: e.clientX,
          y: e.clientY
        });
      }
    })
    .on('mouseup', function(e) {
      mousedown = false;
    });
  $.each(window.skrimpReady || [], function (i, fn) {
    return fn();
  });

}());
