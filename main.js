// Create our 'main' state that will contain the game
var mainState = {
    preload: function() {
        game.load.audio('jump', 'assets/jump.wav');
        // Load the bird sprite
        game.load.image('bird', 'assets/bird.png');
        game.load.image('pipe', 'assets/pipe.png');
        game.load.image('cerveira', 'assets/cerveira.png');
        game.load.image('neves', 'assets/neves.png');
        game.load.image('paco', 'assets/paco.png');
        game.load.image('limi', 'assets/limi.png');
        game.load.image('barca', 'assets/barca.png');
    },

    create: function() {
        // Change the background color of the game to blue
        game.stage.backgroundColor = '#71c5cf';

        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the bird at the position x=100 and y=245
        this.bird = game.add.sprite(100, 245, 'bird');

        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);

        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        
        game.input.onDown.add(this.jump, this)
        
        // Create an empty group
        this.pipes = game.add.group();
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
        // Move the anchor to the left and downward
        this.bird.anchor.setTo(-0.2, 0.5);
        this.jumpSound = game.add.audio('jump');
    },
    addOnePipe: function(x, y, pipe) {
        // Create a pipe at the position x and y
        var pipe = game.add.sprite(x, y, pipe);

        // Add the pipe to our previously created group
        this.pipes.add(pipe);

        // Enable physics on the pipe 
        game.physics.arcade.enable(pipe);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;

        // Automatically kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    addRowOfPipes: function() {
        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;

        // Add the 6 pipes 
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i <= 10; i++)
            if (i != hole && i != hole + 1){
                if(i%8 == 0)
                    this.addOnePipe(600, i * 60 + 10, 'paco');
                else if(i%5 == 0)
                    this.addOnePipe(600, i * 60 + 10, 'neves');
                else if(i%4 == 0)
                    this.addOnePipe(600, i * 60 + 10, 'limi');
                else if(i%3 == 0)
                    this.addOnePipe(600, i * 60 + 10, 'barca');
                else
                    this.addOnePipe(600, i * 60 + 10, 'cerveira');
            
                
            }
        this.score += 1;
        this.labelScore.text = this.score;
    },
    update: function() {
        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        if (this.bird.y < 0 || this.bird.y > 635)
            this.restartGame();
        game.physics.arcade.overlap(
            this.bird, this.pipes, this.hitPipe, null, this);
        if (this.bird.angle < 20)
            this.bird.angle += 1;
    },
    hitPipe: function() {
        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if (this.bird.alive == false)
            return;

        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p) {
            p.body.velocity.x = 0;
        }, this);
    },
    // Make the bird jump 
    jump: function() {
        if (this.bird.alive == false)
            return;
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;
        // Create an animation on the bird
        var animation = game.add.tween(this.bird);

        // Change the angle of the bird to -20° in 100 milliseconds
        animation.to({ angle: -20 }, 100);

        // And start the animation
        animation.start();
        this.jumpSound.play();
    },

    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    }
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(600, 635);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');