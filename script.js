window.addEventListener('load', function(){

  const canvas = this.document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = 'white';
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'black';
  ctx.font = '40px Bangers';
  ctx.textAlign = 'center';

  ///////PLAYERR//////
  class Player{
    constructor(game){
      this.game = game;
      this.collisionX = this.game.width*0.5;
      this.collisionY = this.game.height*0.5;
      this.collisionRadius = 25;
      this.speedX = 0;
      this.speedY = 0;
      this.dx = 0;
      this.dy =0;

      this.speedModifier = 5;
      this.spriteWidth = 255;
      this.spriteHeight = 255;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX;
      this.spriteY ;
      this.frameX =0;
      this.frameY =5;

      this.image = document.getElementById('bull');


    }

    restart(){

      this.collisionX = this.game.width*0.5;
      this.collisionY = this.game.height*0.5;

      this.spriteX = this.collisionX - this.width*0.5;
      this.spriteY = this.collisionY - this.height*0.5 - 100;

    }

    draw(context){

      context.drawImage(this.image,this.frameX*this.spriteWidth,this.frameY*this.spriteHeight,this.spriteWidth,this.spriteHeight, this.spriteX,this.spriteY,
      this.width, this.height);
      
      if(this.game.debug){
      context.beginPath();
      context.arc(
        this.collisionX ,
        this.collisionY,
        this.collisionRadius,
      0,
        Math.PI*2
      );

        context.save();//creatses a snapshot of current canvas
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();//restoring all setngs of canvas that assosiate with save
        context.stroke();

        context.beginPath();
        context.moveTo(this.collisionX, this.collisionY);
        context.lineTo(this.game.mouse.x, this.game.mouse.y);
        context.stroke();
      }

    }


    update(){

      this.dx = this.game.mouse.x - this.collisionX;
      this.dy = this.game.mouse.y - this.collisionY;

      //Sprite animation 
      const angle = Math.atan2(this.dy, this.dx);//remmember that returns in radians
       if (angle < -2.74 || angle >2.74) this.frameY = 6;
      else if (angle < -1.96) this.frameY = 7;

      else if (angle < -1.17) this.frameY = 0;
      else if (angle < -0.39) this.frameY = 1;
      else if (angle < 0.39) this.frameY = 2;
      else if (angle < 1.17) this.frameY = 3;
      else if (angle < 1.96) this.frameY = 4;
      else if (angle < 2.74) this.frameY = 5;
      







      
      const distance = Math.hypot(this.dy,this.dx);
      
      if(distance > this.speedModifier){

        this.speedX = this.dx/distance || 0;
        this.speedY = this.dy/distance || 0;


      }else{
        this.speedX =0;
        this.speedY = 0;
      }
     

      this.collisionX += this.speedX * this.speedModifier;
      this.collisionY += this.speedY *this.speedModifier;

      this.spriteX = this.collisionX - this.width*0.5;
      this.spriteY = this.collisionY - this.height*0.5 - 100;

      //horizontal boundaries
      if(this.collisionX < this.collisionRadius)
        this.collisionX = this.collisionRadius;
      else if(this.collisionX > this.game.width - this.collisionRadius)
        this.collisionX = this.game.width - this.collisionRadius;

      //vertical boundaries
      if(this.collisionY < this.collisionRadius+this.game.topMargin)
        this.collisionY = this.collisionRadius+this.game.topMargin;
      else if(this.collisionY > this.game.height - this.collisionRadius)
        this.collisionY = this.game.height - this.collisionRadius;


      //collision with obstacles
      this.game.obstacles.forEach(obstacle =>{
        // [(distance<sumOfRadii),distance, sumOfRadii, dx,dy]
        
      let [collision,distance, sumOfRadii, dx,dy] = this.game.checkCollision(this, obstacle);

      if(collision){
        const unit_x = dx / distance;
        const unit_y = dy / distance;

        //repeal for x and y
        this.collisionX = obstacle.collisionX+
      (sumOfRadii +1)*unit_x;

      this.collisionY = obstacle.collisionY+
      (sumOfRadii +1)*unit_y;

      }

      });


    }

  }


  /////// OBSTACLES //////////////////

  class Obstacle{
    constructor(game){
      this.game = game;
      this.collisionX = Math.random() * this.game.width;
      this.collisionY =  Math.random()*this.game.height;
      this.collisionRadius = 50;

      this.image = document.getElementById('obstacles');
      this.spriteWidth = 250;
      this.spriteHeight = 250;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX = this.collisionX - this.width*0.5;
      this.spriteY = this.collisionY - this.height*0.5 - 70;
      this.frameX = Math.floor(Math.random() *4);
      this.frameY = Math.floor(Math.random() *3);


    }
    draw(context){

      context.drawImage(this.image,
        this.frameX*this.spriteWidth,
        this.frameY*this.spriteHeight,
        this.spriteWidth,this.spriteHeight,
        this.spriteX, this.spriteY, 
        this.width,this.height);

        if(this.game.debug){

          context.beginPath();
          context.arc(
            this.collisionX ,
            this.collisionY,
            this.collisionRadius,0,Math.PI*2);
            context.save();//creatses a snapshot of current canvas
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();//restoring all setngs of canvas that assosiate with save
            context.stroke();

        }

    }

    update(){

    }

  }

///EGG class

class Egg{
  constructor(game){

    this.game = game;
    this.collisionRadius = 40;
    this.margin = this.collisionRadius*2;
    this.collisionX = this.margin + (Math.random()*(this.game.width - this.margin*2));
    this.collisionY = this.game.topMargin+(Math.random()*(this.game.height - this.game.topMargin - this.margin));

    this.collisionRadius = 40;
    this.image = document.getElementById('egg');

    this.spriteWidth =  110;
    this.spriteHeight = 135;

    this.width = this.spriteWidth;
    this.height = this.spriteHeight;

    this.spriteX ;
    this.spriteY;

    this.hatchTimer = 0;
    this.hatchInterval = 7000;
    this.markedforDeletion = false;



  }
  ///draw egg

  draw(context){
    context.drawImage(this.image, this.spriteX,
      this.spriteY);

      if(this.game.debug){

        context.beginPath();
        context.arc(
          this.collisionX ,
          this.collisionY,
          this.collisionRadius,0,Math.PI*2);
          context.save();//creatses a snapshot of current canvas
          context.globalAlpha = 0.5;
          context.fill();
          context.restore();//restoring all setngs of canvas that assosiate with save
          context.stroke();
          const displayTimer = (this.hatchTimer*0.001).toFixed(0);
          context.fillText(displayTimer,
          this.collisionX,this.collisionY - this.collisionRadius*2.5);
          

      }
    }
      update(deltaTime){

        this.spriteX = this.collisionX - this.width * 0.5;
        this.spriteY = this.collisionY - this.height * 0.5 - 35;

        let collisionObjects = [this.game.player,
          ...this.game.obstacles, ...this.game.enemies
        ,, ...this.game.hatchlinks];
//...spread operator
//allows us to quickly expand elements in
//an array into another array


////collisions
          collisionObjects.forEach(object =>{
            let [collision,distance, sumOfRadii, dx,dy] = this.game.checkCollision(this,object);
            if(collision){
              const unit_x = dx/distance;
              const unit_y = dy / distance;
              
              this.collisionX = object.collisionX+(sumOfRadii+1)*unit_x;
              this.collisionY = object.collisionY +(sumOfRadii+1) *unit_y;


            }


         });
          //hatching
          if(this.hatchTimer > this.hatchInterval
            || this.collisionY <this.game.topMargin)
            
            {
            this.game.hatchlinks.push(new Larva(
            this.game, this.collisionX,this.collisionY));

            this.markedforDeletion = true;
            this.game.removeGameObjects();
            

          }else{
            this.hatchTimer += deltaTime;
          }




      }

  }


  class Larva{
  
    constructor(game,x,y){

      this.game = game;
      this.collisionX = x;
      this.collisionY = y;
      this.collisionRadius = 30;

      this.image = document.getElementById('larva');
      this.spritewidth = 150;
      this.spriteHeight = 150;

      this.width = this.spritewidth;
      this.height = this.spriteHeight;
      this.spriteX;
      this.spriteY;
      this.speedY = 1 + Math.random();
      this.frameX = 0;
      this.frameY = Math.floor(Math.random()*2);




    }
    draw(context){
      context.drawImage(this.image,this.frameX*this.spritewidth
        ,this.frameY * this.spriteHeight,this.spritewidth,this.spriteHeight,this.spriteX,
        this.spriteY, this.width, this.height);
        if(this.game.debug){

          context.beginPath();
          context.arc(
            this.collisionX ,
            this.collisionY,
            this.collisionRadius,0,Math.PI*2);
            context.save();//creatses a snapshot of current canvas
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();//restoring all setngs of canvas that assosiate with save
            context.stroke();
  
        }



    }
    update(){
      this.collisionY -= this.speedY;
      this.spriteX = this.collisionX  - this.width*0.5;
      this.spriteY = this.collisionY  - this.height*0.5 -50;

        //moves to safety
        if(this.collisionY < this.game.topMargin){
          this.markedforDeletion = true;
          this.game.removeGameObjects();
         if(!this.game.gameOver) this.game.score++;
          for(let i =0;i < 7;i++){
          this.game.particles.push(new Firefly(this.game,this.collisionX,
            this.collisionY,'yellow'));
          }
        }

        //collisions with gameobjects
        let collisionObjects = [this.game.player,
          ...this.game.obstacles];
          collisionObjects.forEach(object =>{
            let [collision,distance, sumOfRadii, dx,dy] = this.game.checkCollision(this,object);
            if(collision){
              const unit_x = dx/distance;
              const unit_y = dy / distance;
              
              this.collisionX = object.collisionX+(sumOfRadii+1)*unit_x;
              this.collisionY = object.collisionY +(sumOfRadii+1) *unit_y;


            }
            
            

         });

         //collision with enemies
         this.game.enemies.forEach(enemy => {

            if(this.game.checkCollision(this,enemy)[0]
                && !this.game.gameOver){

              this.markedforDeletion = true;
              this.game.removeGameObjects();
              this.game.lostHatchlinks++;

              for(let i =0;i < 7;i++){
                this.game.particles.push(new Spark(this.game,this.collisionX,
                  this.collisionY,'blue'));
                }

              

            }
         });



    }
  }

class Enemy{

    constructor(game){
      this.game = game;
      this.collisionRadius = 30;
      
      this.speedX = Math.random()*3+0.5;
      this.image = document.getElementById('toads');
      this.spriteWidth =140;
      this.spriteHeight = 260;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.collisionX = this.game.width + this.width+Math.random()*this.game.width*0.5;
      this.collisionY = this.game.topMargin+(Math.random() * (this.game.height - this.game.topMargin));
      this.spriteX;
      this.spriteY;

      this.frameX = 0;
      this.frameY= Math.floor(Math.random()*4);



   

    }
    draw(context){
      context.drawImage(this.image,this.frameX*this.spriteWidth,this.frameY*
        this.spriteHeight,this.spriteWidth,
        this.spriteHeight,
         this.spriteX,
         this.spriteY, this.width,this.height);

      if(this.game.debug){

        context.beginPath();
        context.arc(
          this.collisionX ,
          this.collisionY,
          this.collisionRadius,0,Math.PI*2);
          context.save();//creatses a snapshot of current canvas
          context.globalAlpha = 0.5;
          context.fill();
          context.restore();//restoring all setngs of canvas that assosiate with save
          context.stroke();

      }
    }

    update(){
      this.spriteX = this.collisionX - this.width*0.5;
      this.spriteY = this.collisionY - this.height*0.5 +40;
      this.collisionX -=this.speedX;
      
      
      if(this.spriteX + this.width < 0 && !this.game.gameOver)
      
        {

      this.collisionX = this.game.width + this.width+
      Math.random()*this.game.width*0.5;
      this.collisionY = this.game.topMargin+(Math.random() * (this.game.height - this.game.topMargin));
      this.frameY= Math.floor(Math.random()*4);

    
       }

    let collisionObjects = [this.game.player,
      ...this.game.obstacles];
//...spread operator
//allows us to quickly expand elements in
//an array into another array

      collisionObjects.forEach(object =>{
        let [collision,distance, sumOfRadii, dx,dy] = this.game.checkCollision(this,object);
        if(collision){
          const unit_x = dx/distance;
          const unit_y = dy / distance;
          
          this.collisionX = object.collisionX+(sumOfRadii+1)*unit_x;
          this.collisionY = object.collisionY +(sumOfRadii+1) *unit_y;


        }


      });



  }

}
  
class Particle{
  constructor(game,x,y,color){
    this.game = game;
    this.collisionX = x;
    this.collisionY = y;
    this.color = color;
    this.radius = Math.floor(Math.random()*1+5);
    this.speedX = Math.random()*6 -3;
    this.speedY = Math.random()*2 + 0.5;
    this.angle = 0;
    this.va = Math.random()*0.1 + 0.01;
    this.markedforDeletion = false;


  }
  draw(context){
    context.save();
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.collisionX,this.collisionY,
    this.radius, 0 , Math.PI*2);
    context.fill();
    context.stroke();
    context.restore();

  }

}

class Firefly extends Particle{

  update(){
    this.angle +=this.va;
    this.collisionX +=Math.cos(this.angle)*this.speedX;
    this.collisionY -=this.speedY;

    if(this.collisionY < 0-this.radius){
      this.markedforDeletion = true;
      this.game.removeGameObjects();
    }
  }
}

class Spark extends Particle{
  update(){
    this.angle +=this.va*0.5;
    this.collisionX -=Math.cos(this.angle)*this.speedX;
    this.collisionY -=Math.sin(this.angle)*this.speedY;

    if(this.radius > 0.1) this.radius -= 0.05;
    if(this.radius< 0.2){
      this.markedforDeletion = true;
      this.game.removeGameObjects();
    }

  }
}



  ////GAME/////////
  class Game{
    constructor(canvas){
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.debug = true;

        this.topMargin = 260;
        this.player = new Player(this);
        this.fps = 75;
        this.timer =0;
        this.interval = 1000/this.fps;
        this.eggTimer =0;
        this.eggInterval = 100;
        //obstacl
        this.numberOfObstacles = 50;
        this.maxEggs = 4;
        this.obstacles = new Player(this);


        this.obstacles = [];
        this.eggs = [];
        this.enemies = [];
        this.hatchlinks = [];
        this.particles =[];
        this.gameObjects = [];
        this.score = 0;
        this.winningScore = 3;
        this.gameOver = false;
        this.lostHatchlinks = 0;
        

        //////
        
        this.mouse = {
          x:this.width*0.5,
          y:this.height*0.5,
          pressed: false
        }

        //event listeners
        canvas.addEventListener('mousedown',e  => {
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
          this.mouse.pressed = true;
        });
        
        canvas.addEventListener('mouseup',e => {
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
          this.mouse.pressed = false;
        });

        canvas.addEventListener('mousemove',e => {
          
          if(this.mouse.pressed){
          
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
        }
          
        });


        //debuging with d key
        window.addEventListener('keydown', e=>{

          if (e.key == 'd') this.debug = !this.debug;
          else if (e.key == 'R' || e.key =='r') this.restart();

        

        });


    }
    render(context,deltaTime){
     
      if (this.timer > this.interval) {
        context.clearRect(0, 0, this.width, this.height);
    


        this.gameObjects = [this.player,...this.eggs, ...this.obstacles,
          ...this.enemies,...this.hatchlinks,...this.particles ];

                      //sort by vertical position
        this.gameObjects.sort((a,b) => {
          return a.collisionY - b.collisionY;
        });

        this.gameObjects.forEach(
          object =>{
             object.draw(context);
             object.update(deltaTime);
            });

  //  this.obstacles.forEach(obstacle => obstacle.draw(context));



  //       // Draw player first, then eggs
  //       this.player.draw(context);
  //       this.player.update();
    
    
        this.timer = 0;
      }
      this.timer +=deltaTime;

      // this.obstacles.forEach(obstacle =>obstacle.draw(context));
        
      //add eggs periodically
    if(this.eggTimer > this.eggInterval 
      && this.eggs.length < this.maxEggs 
      && !this.gameOver){
      this.addEgg();
      this.eggTimer =0;
      console.log(this.eggs);
    }else{
      this.eggTimer += deltaTime;
    }

    //draw status text
    context.save();
    context.textAlign ='left';
    context.fillText('Score: '+ this.score , 25,50);
    if(this.debug){
      context.fillText('Lost: '+this.lostHatchlinks,25,100);

    }
    context.restore();

    //winning and loosing

    if(this.score >=this.winningScore){
      this.gameOver = true;

      context.save();
      context.fillStyle = 'rgba(0,0,0,0.5)';
      context.fillRect(0,0,this.width,this.height);
      context.fillStyle =  'white';
      context.textAlign = 'center';
      context.shadowOffsetX =4;
      context.shadowOffsetY =4; 
      context.shadowColor = 'black';

      let message1;
      let message2;
      if(this.lostHatchlinks <=5){
        message1 = 'You have won this time!';
        message2 = 'You bullied the bullies';
        //win
      }else//lose
      {
        message1 = 'OOOOOpppppsss this time((';
        message2 = 'You have been bullied'+this.lostHatchlinks+ 
        "hatchlinks, do not a pushover";
      }
      context.font = '130px Bangers';
      context.fillText(message1, this.width*0.5,
        this.height*0.5-20);
      context.font = '40px Bangers';
      context.fillText(message2, this.width*0.5,
        this.height*0.5+30);
      context.fillText('Final score' + this.score+
        '. Press R to budheads again=)',this.width*0.5,
        this.height*0.5+80);
      
      


      context.restore();
    }
   

  }





    checkCollision(a,b){

      const dx = a.collisionX - b.collisionX;
      const dy = a.collisionY - b.collisionY;
      const distance = Math.hypot(dy,dx);

      const sumOfRadii = a.collisionRadius + b.collisionRadius;
      return[(distance<sumOfRadii),distance, sumOfRadii, dx,dy];


    }


    ///add egg method
    addEgg(){
      this.eggs.push(new Egg(this));

    }


    addEnemy(){
      this.enemies.push(new Enemy(this));

    }
    removeGameObjects(){
      this.eggs = this.eggs.filter(object => !object.markedforDeletion );
      this.hatchlinks= this.hatchlinks.filter(object => !object.markedforDeletion );
      this.particles= this.particles.filter(object => !object.markedforDeletion );

     
    }

    restart(){
      this.player.restart();
      this.obstacles = [];
      this.eggs = [];
      this.enemies = [];
      this.hatchlinks = [];
      this.particles =[];

      this.mouse = {
        x:this.width*0.5,
        y:this.height*0.5,
        pressed: false
      }
      this.score = 0;
      this.lostHatchlinks = 0;
      this.gameOver = false;

      this.init();

    }
//init methid
    init(){

      for(let i=0; i < 3; i++){
        this.addEnemy();
        

      }

      let attempts = 0;
      while(this.obstacles.length <this.numberOfObstacles
        && attempts < 500){

          let testObstacle = new Obstacle(this);
          let overlap = false;
          this.obstacles.forEach(obstacle =>{
              const dx = testObstacle.collisionX - obstacle.collisionX;
              const dy = testObstacle.collisionY - obstacle.collisionY;
              const distance = Math.hypot(dy,dx);


              //extra space between obstacles,
              //so the game characters easly go around
              const distBuffer = 150;

              const sumOfRadii = testObstacle.collisionRadius+
              obstacle.collisionRadius+distBuffer;

              if(distance <sumOfRadii){

                overlap = true;

              }
          });
          const margin = testObstacle.collisionRadius*3;
          
          if(!overlap && testObstacle.spriteX >0 &&
            testObstacle.spriteX < this.width - testObstacle.width
            && testObstacle.collisionY > this.topMargin+margin
          && testObstacle.collisionY < this.height-margin )
         
          {
            this.obstacles.push(testObstacle);
          }
          attempts++;

      }
      
    }

  }


  ////////////////////////
  const game = new Game(canvas);
  game.init();
  
  let lastTime = 0;
  //////ANIMATION/////
  function animate(timeStamp){
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    
      //claude changed
      game.render(ctx,deltaTime);
      requestAnimationFrame(animate);
  }
  animate(0);


});