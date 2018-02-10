class Vec{
    
    constructor(x =0, y =0)
    {
        this.x = x;
        this.y = y;
    }
    get len(){
        
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set len(value){
        
        const fact = value/ this.len;
        this.x *= fact;
        this.y *= fact;
    }
}
class Rect{
    
    constructor( x = 0,  y = 0){
        this.pos = new Vec(0, 0);
        this.size = new Vec(x , y);
    }
    
    get left()
    {
        return this.pos.x - this.size.x /2;
    }
     get right()
    {
        return this.pos.x + this.size.x /2;
    }
    get top() 
    {
        return this.pos.y - this.size.y /2;
    }
     get bottom()
    {
        return this.pos.y + this.size.y /2;
    }
}

class Ball extends Rect{
   
    constructor() {
        super(10,10);
        this.vel = new Vec;
    }
}

class Player extends Rect
{
    constructor()
    {
        super(20 , 100);
        this.vel = new Vec;
        this.score = 0;
    
    this._lastPos = new Vec;
    }
    update(dt)
    {
        this.vel.y = (this.pos.y - this._lastPos.y)/dt;
        
        this._lastPos.y = this.pos.y;
    }
}


class Pong {
    
    constructor(canvas) {
        
        this._canvas = canvas;
        this._context = canvas.getContext('2d');
        
        this.initialSpeed = 250;

        this.ball = new Ball;

        this.players = [ new Player,
                       new Player,        
        ];
        
        this.players[0].pos.x = 40;
         this.players[1].pos.x = this._canvas.width - 40;
        this.players.forEach(p =>   
            p.pos.y = this._canvas.height /2);
        
        
let lastTime = null;
this._callback = (millis) =>  {
    
    if(lastTime !== null){
        const diff = millis - lastTime;
        this.update(diff / 1000);
    }
    
    lastTime = millis;
    
    requestAnimationFrame(this._callback);
};


        
     this.CHAR_PIXEL = 10;
     this.CHARS = [  
            '111101101101111',
            '010010010010010',
            '111001111100111',
            '111001111001111',
            '101101111001001',
            '111100111001111',
            '111100111101111',
            '111001001001001',
            '111101111101111',
            '111101111001111',  
        ].map (str => {
         const canvas = document.createElement('canvas');
         canvas.height = this.CHAR_PIXEL * 5;
          canvas.width  = this.CHAR_PIXEL * 3;
         const context  = canvas.getContext('2d');
         context.fillStyle = '#fff';
         str.split('').forEach((fill, i) =>{
             if(fill === '1'){
         context.fillRect((i % 3)* this.CHAR_PIXEL,
                          (i/3 | 0 )  * this.CHAR_PIXEL,
                                  this.CHAR_PIXEL,
                                    this.CHAR_PIXEL);             
             }
         }); 
         return canvas;
         
     });
        
         this.reset();
}
   clear(){
       this._context.fillStyle =' #000';
       this._context.fillRect(0,0, this._canvas.width, this._canvas.height);
   }
    
    collide(player, ball)
    {
        if( player.left < ball.right && player.right > ball.left && 
          player.top < ball.bottom && player.bottom > ball.top){
            
            
            ball.vel.x = -ball.vel.x * 1.05;
            const len = ball.vel.len;
            ball.vel.y += player.vel.y * .2;
            
            ball.vel.len  = len;
            
        }
    }

    draw(){
        
        this.clear();
        
        
        this.drawRect(this.ball);
        
        this.players.forEach(player =>this.drawRect(player));
        
        this.drawScore();
    }
    
    drawRect(rect){
        
        this._context.fillStyle = '#fff';
this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
        
    }
    
    drawScore(){
        const align = this._canvas.width / 3;
        const CHAR_W = this.CHAR_PIXEL * 4;
        
        this.players.forEach((player , index) =>
        {
            const chars = player.score.toString().split('');
    const offSet= align*(index + 1) -(CHAR_W*chars.length/2 ) +  this.CHAR_PIXEL / 2 ;
            chars.forEach((char, pos) => {
                this._context.drawImage(this.CHARS[char| 0],offSet + pos * CHAR_W, 20);
            });
            
            
        });
    }
     play(){
        
        if(this.ball.vel.x === 0 && this.ball.vel.y === 0 ){
            this.ball.vel.x = 200 * (Math.random() > .5 ? 1 : -1);
            this.ball.vel.y = 200* (Math.random() *2 - 1);
            this.ball.vel.len = this.initialSpeed;
        }
        
    }


reset(){
    
    this.ball.vel.x = 0;
    this.ball.vel.y = 0; 
    
    
    this.ball.pos.x = this._canvas.width /2;
this.ball.pos.y = this._canvas.height /2; 
}

    start(){
        
        requestAnimationFrame(this._callback);
        
    }
   
update(dt)
    {
    this.ball.pos.x += this.ball.vel.x * dt;
  this.ball.pos.y += this.ball.vel.y * dt;
    
    if(this.ball.left < 0 || this.ball.right > this._canvas.width){
     
            // '|0' converts left part into integer
        this.players[this.ball.vel.x < 0 | 0].score++;
        this.reset();
 
    }
    if( this.ball.top < 0 ||  this.ball.bottom > this._canvas.height){
        this.ball.vel.y =  - this.ball.vel.y;
 
    }
    this.players[1].pos.y = this.ball.pos.y;
    
    this.players.forEach(player =>
                         {
     player.update(dt);
        
        this.collide(player, this.ball);
                         
               });
             this.draw();
}

}
    

const canvas = document.querySelector('#pong');
const pong = new Pong(canvas);


canvas.addEventListener('click' , () => pong.play());
 
canvas.addEventListener('mousemove' , event => {
    
    
    const scale  = event.offsetY / event.target.getBoundingClientRect().height;
    
    pong.players[0].pos.y = canvas.height * scale;
                        
});
pong.start();