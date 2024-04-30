//início do código do jogo
//Variáveis Globais

//Personagem
var trex, trex_running, trex_collided;

//Fundo
var ground, invisibleGround, groundImage;

//Nuvens
var cloudsGroup, cloudImage;

//Obstáculos
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

//Fim de jogo 
var gameOverImg,gameOver;
var restartImg,restart;

//Contagem
var count;

//Sons
var jumpSound, dieSound, checkPointSound;

//Estado do jogo
var PLAY=1;
var END=0;
var gameState = PLAY;

//Área do jogo
var canvas;

//Função de pré-carregamento
function preload(){ 
  //carregamento da animação do dinossauro
  trex_running=loadAnimation("trex1.png","trex2.png","trex3.png"); 
  //carregamento das imagens 
  //dinossauro
  trexCollide = loadImage("trexCollide.png");
  //fundo
  groundImage = loadImage("ground1.png");
  //nuvem
  cloudImage = loadImage("cloud.png");
  //obstáculos
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  //reinício
  restartImg=loadImage("restart.png");
  //fim de jogo
  gameOverImg=loadImage("gameOver.png");
  //carregamento de sons
  //pulo
  jumpSound=loadSound("jump.mp3");
  //morte
  dieSound=loadSound("die.mp3");
  //som do ponto de verificação
  checkPointSound=loadSound("checkPoint.mp3");
}

function setup() {
  //Criação do canvas
  canvas = createCanvas(1000, 300);
  //Posicionar o canvas no elemento HTML com as coordenadas x e y
  canvas.position(150,130)
  //Criação do perssonagem
  trex = createSprite(50,220,80,150);
  ground = createSprite(300,220,400,20);
  invisibleGround = createSprite(200,230,400,10);
  gameOver = createSprite(520,80);
  restart = createSprite(520,120);
  //criando um grupo de personagens
  CloudsGroup = new Group();
  ObstaclesGroup = new Group();
  
  //Adicionando animação ao personagem
  trex.addAnimation("running", trex_running);
  ground.addImage("ground",groundImage);
  gameOver.addImage("gameOver",gameOverImg);
  restart.addImage("restart",restartImg);


  //Definindo tamanho do personagem
  trex.scale = 0.5;
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
 //definindo posição em x do fundo e indicando que será igual a sua própria largura dividida por por 2
  ground.x = ground.width /2;

  //definindo a velocidade em x do fundo como um valor negativo pois será movido para a esquerda
  ground.velocityX = -2;
  
  //definindo visibilidade 

  //fundo invisivel como não visível
  invisibleGround.visible = false;
  //fim de jogo como não visível
  gameOver.visible = false;
  //reiniciar  como não visível
  restart.visible = false;
  // definindo variável de contagem como 0
  count = 0;
}
//função de continuidade
function draw() {
  //cor de fundo do canvas
  background(rgb(255, 255, 255));
  //texto de contagem que ficará visível na tela
  // cor do preenchimento do texto
  fill(rgb(90, 90, 90));
  //negrito
  textStyle(BOLD);
  //tamanho do texto
  textSize(20)
  //concatenação (junção de texto com variável), seguindo das posições x e y
  text("SCORE: "+ count, 450, 50);
  //condicionais if
  //=== siguinifica que a comparação é feita tendo em vista o tipo de váriavel
  //a ser comparada, string com string ou número com número
  if(gameState === PLAY){
    //a velocidade do fundo será negativa(para a esquerda) 6 um numero 
    //constante e a multiplicação ocorre pois define o aumento da velocidade do jogo
    ground.velocityX = -(6 + 3*count/100);
    //Contagem de pontos, Math(código matemático) round(arredondaar)  
    //Word.frameRate/60(velocidade do mundo por minuto.)
    count = count + Math.round(World.frameRate/60);
    // verificar se o contador for maior que 0 e se o resto da divisão de count por 100 é igual a zero.
    if (count>0 && count%100 === 0){
    //o som do ponto sera tocado
      checkPointSound.play();
    }
    //se a posição em x do fundo for menor que 0
    if (ground.x < 0){
    //a posição do fundo em x será a metade de sua largura
      ground.x = ground.width/2;
    }
    //keyDown é uma função predefinida para clicar em alguma tecla, neste caso a tecla de spaço, pode 
    //usar qualquer tecla do teclado.
    //se você clicar na tecla espaço e a posição do trex em y for maior ou igual a 160
    if(keyDown("space") && trex.y >= 160){
      //a velocidade em y do trex será para esquerda com o valor de -12
      trex.velocityY = -12 ;
      //irá tocar o som de pulo
      jumpSound.play();  
    }
    //para fazer o pulo iremos adicionar um efeito de queda que chamamos de gravidade
    // como para haver o pulo temos que ter uma velocidade necativa será adicionado a essa velocidade
    //velocidade positiva.
    trex.velocityY = trex.velocityY + 0.8;
    //chamando a função de nuvens para executar
    createClouds();
    //chamando a função de obstaculos para executar
    createObstacles();
    
    //Se obst´sculos tocarem no trex 
    if(ObstaclesGroup.isTouching(trex)){
      //estado do jogo troca para END;
      gameState = END;
      //toca o som de fim de jogo
      dieSound.play();
    }
  }
  //se a condição a cima não for executado mas se o gameState for === a END
  else if(gameState === END) {
    //tornar visivel a imagem de gameOver e o restart
    gameOver.visible = true;
    restart.visible = true;
    //se você clicar no restart
    if(mousePressedOver(restart)) {
      //chamar a função de reset para executar, e reiniciará o jogo
      reset();
    }
    //definindo as velocidades do fundo, trex, obstáculos e nuvens
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //mudar a imagem do trex
    trex.addImage("trexCollide",trexCollide);
    
    //definir a vida dos objetos para que eles não sejam destruídos
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
  }
  //é como se fosse a plataforma onde o trex pisa, é um sprite invisivel que colide com o personagem
  //trex mantendo-o na superficie
  trex.collide(invisibleGround);
  //mostrar os personagens
  drawSprites();
}
//função que cria os obstáculos
function createObstacles() {
  //se o se o resto da divisão de frameCount por 60 for igual a zero
  if(frameCount % 60 === 0) {
    //criar obstáculos
    var obstacle = createSprite(1000,200,10,40);
    //definir velocidade com aaceleração
    obstacle.velocityX = -(6+ 3*count/100);
    
    //criando obstáculos com imagens aleátorias entre 1 e 6
    var rand = Math.round(random(1,6));
    //controla o fluxo de criação dos obstáculos na variável rand
    switch(rand) {
      //cada case indica que se o rand for o valor do case ele vai executa-lo
      // ou seja se for 1 ele ira executar o case 1, se for dois ou próximo e assim por diante.
      case 1: obstacle.addImage(obstacle1);
      //dá uma pausa
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //define o tamanho e o tempo de vida do obstáculo          
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //adiciona o obstáculo ao grupo
    ObstaclesGroup.add(obstacle);
  }
}
//função que cria as nuvens
function createClouds() {
  ////se o se o resto da divisão de frameCount por 60 for igual a zero
  if (frameCount % 60 === 0) {
    //cria as nuvens
    var cloud = createSprite(1000,200,10,40);
    //define uma posição em y aleátoria entre 80 e 120
    cloud.y = Math.round(random(80,120));
    //define a imagem da nuvem
    cloud.addImage(cloudImage);
    //define o tamanho
    cloud.scale = 0.5;
    //define a velocidade em x para a esquerda
    cloud.velocityX = -4;
    //define o tempo de vida
    cloud.lifetime = 350;
    //modifica a profundidade da nuvem
    cloud.depth = trex.depth;
    trex.depth = trex.depth + random(0.5,2);
    //adiciona a nuvem ao grupo
    CloudsGroup.add(cloud);
  }
}
//cria a função reset
function reset(){
  //define o estado para play
  gameState = PLAY;
  //tira a visibilidade do game over e do restart
  gameOver.visible = false;
  restart.visible = false;
  //destroi cada um dos obstaculos e nuvens
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  //atualiza a imagem do trex para a animação
  trex.addAnimation("trex",trex_running);
  //o contador volta a ser 0
  count = 0;
}
