// https://p5js.org/examples/simulate-particle-system.html

var sketchConfig = {
    shape: 'circle',
    color: { r: 127, g: 127, b: 127 }
};

var p5 = this;

var SHAPE_FUNC = {
    circle: function(x, y) { p5.ellipse(x, y, 12, 12); },
    rect: function(x, y) { p5.rect(x, y, 12, 12); },
    cross: function(x, y) {
        p5.line(x-6, y-6, x+6, y+6);
        p5.line(x+6, y-6, x-6, y+6);
    },
    diamond: function(x, y) {
        p5.quad(x, y-6, x+6, y, x, y+6, x-6, y);
    }
}

var particleSystem = this;

function setup() {
    p5.createCanvas(400, 400).parent('p5-canvas');
    particleSystem = new ParticleSystem(createVector(p5.width/2, 50));
    updateWithConfig(sketchConfig);
}

function draw() {
    p5.background(51);
    particleSystem.run();
}

function updateWithConfig(conf) {
    particleSystem.addParticle(conf);
}

// A simple Particle class
var Particle = function(position, config) {
    this.acceleration = p5.createVector(0, 0.05);
    this.velocity = p5.createVector(p5.random(-1, 1), p5.random(-1, 0));
    this.position = position.copy();
    this.lifespan = 255.0;
    this.color = config.color || { r: 127, g: 127, b: 127 };
    this.shape = config.shape || 'circle';
};

Particle.prototype.run = function() {
    this.update();
    this.display();
};

// Method to update position
Particle.prototype.update = function(){
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function() {
    var fillColor = p5.color(this.color.r, this.color.g, this.color.b, this.lifespan);
    var strokeColor = p5.lerpColor(fillColor, p5.color(255, this.lifespan), 0.5);
    p5.stroke(strokeColor);
    p5.strokeWeight(2);
    p5.fill(fillColor);
    //p5.ellipse(this.position.x, this.position.y, 12, 12);
    SHAPE_FUNC[this.shape](this.position.x, this.position.y);
};

// Is the particle still useful?
Particle.prototype.isDead = function(){
    if (this.lifespan < 0) {
        return true;
    } else {
        return false;
    }
};

var ParticleSystem = function(position) {
    this.origin = position.copy();
    this.particles = [];
};

ParticleSystem.prototype.addParticle = function(config) {
    this.particles.push(new Particle(this.origin, config));
};

ParticleSystem.prototype.run = function() {
    for (var i = this.particles.length-1; i >= 0; i--) {
        var p = this.particles[i];
        p.run();
        if (p.isDead()) {
            this.particles.splice(i, 1);
        }
    }
};