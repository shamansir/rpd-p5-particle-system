// https://p5js.org/examples/simulate-particle-system.html

var config = {

};

️var system;

var p5 = this;

function setup() {
    p5.createCanvas(720, 400);
    system = new ParticleSystem(createVector(p5.width/2, 50));
}

function draw() {
    p.background(51);
    system.addParticle();
    system.run();
}

// A simple Particle class
var Particle = function(position) {
    this.acceleration = p5.createVector(0, 0.05);
    this.velocity = p5.createVector(p5.random(-1, 1), p5.random(-1, 0));
    this.position = position.copy();
    this.lifespan = 255.0;
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
    p5.stroke(200, this.lifespan);
    p5.strokeWeight(2);
    p5.fill(127, this.lifespan);
    p5.ellipse(this.position.x, this.position.y, 12, 12);
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

ParticleSystem.prototype.addParticle = function() {
    this.particles.push(new Particle(this.origin));
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