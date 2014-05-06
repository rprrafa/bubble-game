	var canvas = document.getElementById('myCanvas');
	width = canvas.width;
	height = canvas.height;
	contexto = canvas.getContext('2d');
	
	// crescimento da bolha
	FPS = 50;
	
	bolhas = [];
	var bgSound = document.getElementById('bgsound');
	var blopSound = document.getElementById('blop');
	var score = document.getElementById('myScore');
	var objNivel = document.getElementById("nivel");
	var objBestScore= document.getElementById("bestScore");
	
	var melhorScore = 0;
	
	_ANDAMENTO = false; //variavel controla andamento do jogo;
	_posX=0; //posicao X cursor
	_posY=0; //posicao Y cursor
			
			
	//Selecionar background
	function selectBg(x){
		var str='bg-' + x + ".png";
		document.body.style.backgroundImage = "url(imagens/"+str+")";
		//console.log("url('imagens/"+str+"') no-repeat;");
	}
	
	//Redimencionar imagem de plano de fundo
	function Resize(){
		canvas.width = document.body.scrollWidth-400;
		width = document.body.scrollWidth-400;
	}
	
	//armazenar coordenadas do mouse no momento to click
	function posCursor(evt){
		_posX = evt.x;
		_posY = evt.y;
	}
	
	function setCursorPoints(x, y, valor){
		var pontos = document.getElementById('points');
		pontos.style.left=(_posX-5)+"px";
		pontos.style.top=(_posY-30)+"px";
		pontos.className="visible";
		pontos.innerHTML="<h2>+"+valor+"</h2>";		
		setTimeout(function(){
			pontos.className="hidden";
			}, 30);
	}
	
	//Verifica posição do canvas que usuário clicou
	//Remove bolhas
	canvas.onclick = function(evt){
		var x = evt.offsetX, y = evt.offsetY;
		
		for(var i=0; i<bolhas.length;i++){
			if (dist({x:x,y:y},bolhas[i])<bolhas[i].r){
					if (_ANDAMENTO){
						blopSound.pause();
						blopSound.currentTime=0;
						blopSound.play();
						score.value = (parseInt(score.value) + bolhas[i].r); 
						bolhas.splice(i, 1); // remover objeto da lista
						setCursorPoints(x, y, bolhas[i].r);
					}
				break;
				}
				
		}
	}
	
	function randHex(){
		return "0123456789abcdf"[(Math.floor(Math.random()*15))];
	}
	
	//Desenha uma bolha no canvas 
	//Parametros posicoes x e y do eixo, raio da bolha, cor da bolha em hexadecimal
	function desenhaBolha(x, y, r, cor){
		contexto.fillStyle = cor;
		contexto.beginPath();
		contexto.arc(x, y, r, 0, Math.PI*2, true);
		contexto.fill();
		
		contexto.strokeStyle = "#aaa";
		contexto.beginPath();
		contexto.arc(x, y, r, 0, Math.PI*2, true);
		contexto.stroke();
		
		contexto.fillStyle = "rgba(255,255,255,0.4)";
		contexto.beginPath();
		contexto.arc(x-(r*0.5),y-(r*0.5), r*0.2, 0, Math.PI*2, true);
		contexto.fill();
	}
	
	//Atualiza canvas com array de bolhas
	function desenhar(){
		contexto.clearRect(0, 0, width, height);
		for(var i=0;i<bolhas.length;i++){
			desenhaBolha(bolhas[i].x,bolhas[i].y, bolhas[i].r, bolhas[i].cor);
		}
	}
	
	//distancia Euclidiana
	function dist(a, b){
		return Math.sqrt(((a.x-b.x)*(a.x-b.x)) + ((a.y-b.y)*(a.y-b.y)));
	}
	
	
	function NovoJogo(e){
		var cont = 3;
		
		//quantidade de bolhas adicionadas no jogo por segundo
		ADD = 1/objNivel.value;
		
		_ANDAMENTO = true;
			
		score.value = "0";
		
		e.disabled=true;
		objNivel.disabled=true;
		blopSound.src="sons/blop.mp3";
		
		objBestScore.innerHTML = "<h3>Melhor Score: "+melhorScore;
		
		var contagem = setInterval(function(){
			blopSound.play();
			contexto.clearRect(0, 0, width, height);
			contexto.font = '36px "Tahoma"';
			contexto.fillStyle="gray";
			contexto.fillText(cont, width/2, height/2);
			cont--;
			if(cont==-1) {
				clearInterval(contagem);
				blopSound.src="sons/slap.mp3";
				iniciar();
				cont = 3;
			}
		},1000);
	
	}
	
	function iniciar(){
		bolhas = [
			{x: 325, y: 325, r:5, cor:"#"+randHex()+randHex()+randHex()},
			{x: 205, y: 125, r:5, cor:"#"+randHex()+randHex()+randHex()}
		];
		
		var gameTimer = setInterval(function(){
		//Aumentar tamanho das Bolhas
		bolhas = bolhas.map(function(bolha){
					bolha.r+=1;
					return bolha;
					});
					
		//Detectar colisões
		for(var a=0;a<bolhas.length;a++){
			for(var b=0;b<bolhas.length;b++){
				if (a!=b && dist(bolhas[a], bolhas[b]) <= (bolhas[a].r+bolhas[b].r) || ((bolhas[a].r*2>width+bolhas[a].x) ||(bolhas[b].r*2>width+bolhas[b].x))){
					//FIM DE JOGO
					_ANDAMENTO = false;
					clearInterval(addTimer);
					clearInterval(gameTimer);
					
					blopSound.src="sons/fail.mp3";
					blopSound.play();
					setTimeout(function(){
						document.getElementById("novoJogo").disabled=false;
						objNivel.disabled=false;
					}, 4000);
					bgSound.pause();
					
					//limpar array
					bolhas.splice(0,bolhas.length)
					console.log("GAME OVER!");
					
					contexto.beginPath();
					contexto.fillStyle="#aaa";
					contexto.fillText("Game Over!",(width/2)-50,height/2);
					
					//Armazenar maior score do usuário
					if (score.value!="0"){
						if (parseInt(score.value)>=melhorScore){
								melhorScore = score.value;
								objBestScore.innerHTML = "<h3>Melhor Score: "+melhorScore+"<sup> <small>NEW</small></sup></h3>";
							}else{
								objBestScore.innerHTML = "<h3>Melhor Score: "+melhorScore+"<br><h4>Não foi dessa vez! :(</h4>";
							}
						}

					break;
				}
			}
			if (!_ANDAMENTO)
				break;
		}
		
			//desenhar bolhas
			if(_ANDAMENTO)
				desenhar();
		}, 1000/FPS);
		
		
		var addTimer = setInterval(function addBolha(){
			var novaBolha = { 	
				x: Math.random()*width,
				y: Math.random()*height,
				r: 0,
				cor: "#"+randHex()+randHex()+randHex()
				};
			//Verifica se as bolhas não serão sobrepostas
			for (var i=0;i<bolhas.length;i++){
				if(dist(bolhas[i],novaBolha)< (50+(bolhas[i].r*2))){
					return addBolha();
				}
			}
			
			bolhas.push(novaBolha);
		}, 1000*ADD);
		if(objNivel.value=="1")
			bgSound.src = "sons/bgsound.wav";
		else
			bgSound.src = "sons/bgsound-2.wav";
			
		bgSound.loop = true;
		bgSound.play();
		
	}