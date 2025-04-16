// 1) Implementar um heptágono regular rodando na tela com 
// pelo menos duas interatividades:
// a) botão
// b) menu
// c) teclado
// d) slider
// e) reshape
// OBS: Como gerar os pontos? 

"use strict";

var gl;
var points = [];
var theta = 0;           
var speed = 0.01;        
var rotating = true; 
var thetaLoc;            


init();

function init()
{
    var canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    //inicializaçao
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    //gerando os 7 pontos em círculo
    //OBS: Como gerar os pontos? pergunta da ativ 
    // os pontos sao gerados a partir do raio *cos(angulo) e  
    //raio *sen(angulo), que seria x e y
    var r = 0.7; //escolhi 0.7 para deixar o tamanho do heptagono menor no canva
    //quanto maior o raio dentro de -1 e 1 maior o objeto
    var i, x, y, angulo;
    var n = 7; //numero de lados do heptagono, quanto maior os lados mais parecido com um circulo
    for(i = 0; i< n; i++){
        angulo = 2 * Math.PI * i / n; 
        x = r * Math.cos(angulo);
        y = r * Math.sin(angulo);
        points.push(vec2(x, y));
    }
    
    //eenviando os pontos para o buffer
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW)
    
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "theta");

    //slider controla a velocidade do heptagono
    document.getElementById("slider").oninput = function () {
        speed = parseFloat(this.value);
    };

    //botao alterna entre pausar e iniciar a rotaçao
    document.getElementById("pausarRotacao").onclick = function () {
        rotating = !rotating;
        this.textContent = rotating ? "Pausar" : "Iniciar";
    };

    render();
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (rotating){
        theta += speed; //caso esteja rondando, atualiza o angulo
    } 
    gl.uniform1f(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length);
    requestAnimationFrame(render);
}


