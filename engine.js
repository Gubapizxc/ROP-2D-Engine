	//player related objects
	var PlayerObj = createObject(16,16,10,16,"player", "transparent");
	createObject(16,16,0,0,"playerHurt", "transparent", "bloodOverlay");
	makeChildOf("playerHurt", "player");
	toggleAndMove("playerHurt", true, 0,0);
	createObject(16,16,26,16,"playerAttack", "transparent", "attackSprite");
	changeOpacityTo("playerHurt", 0);
	
	alternateControls = {};
	
	let touchControls = document.getElementById("touchControls");
	
	// level design
	createObject(16,16,130,20,"dirtPlatform1", "transparent", ["dirtPlatform", "playing"]);
	createObject(13,10,160,45,"dirtPlatform2", "transparent", "nn");
	createObject(16,10,180,50,"dirtPlatform3", "transparent", "nn");
	createObject(16,125,196,144,"wall1", "transparent", "nn");
	createObject(16,16,114,80,"dirtPlatform4", "transparent", ["dirtPlatform", "playing"]);
	createObject(16,16,80,90,"dirtPlatform4", "transparent", ["dirtPlatform", "playing"]);
	createObject(16,16,64,90,"dirtPlatform4", "transparent", ["dirtPlatform", "playing"]);
	createObject(16,16,48,90,"dirtPlatform4", "transparent", ["dirtPlatform", "playing"]);
	createObject(16,16,16,120,"dirtPlatform4", "transparent", ["dirtPlatform", "playing"]);
	createObject(16,16,196,16,"breakableObstacle", "transparent", "brokenDoor");
	
	//enemies and npcs
	createObject(16,16,130,64,"enemyBasic3", "transparent", ["enemy", "bloodbutterfly", "playing", "minRange0", "maxRange160"]);
	createObject(16,16,130,14,"enemyBasic2", "transparent", ["enemy", "slug", "playing", "minRange50", "maxRange200"]);
	createObject(16,16,130,140,"enemyBasic2.0", "transparent", ["enemy", "bloodbutterfly", "playing"]);
	createObject(16,16,187,140,"enemyVBasic2", "transparent", ["enemy", "centipede", "playing", "rotated270", "minRange20", "maxRange60"]);
	createObject(16,16,114,96,"enemyBasic1", "transparent", ["enemy", "wallEye", "playing"]);
	
	
	var availableSounds = {
		playerAttack: new Audio('Assets/shot.mp3'),
		playerJump: new Audio('Assets/jump.mp3'),
		playerHurt: new Audio('Assets/hurt.mp3'),
		playerKill: new Audio('Assets/kill.mp3'),
		breakObstacle: new Audio('Assets/breakObstacle.mp3'),
		voice1: new Audio('Assets/v1.mp3'),
		voice2: new Audio('Assets/v2.mp3'),
		voice3: new Audio('Assets/v3.mp3'),
		voice4: new Audio('Assets/v4.mp3'),
		voice5: new Audio('Assets/v5.mp3'),
		death: new Audio('Assets/death.mp3'),
		poing: new Audio('Assets/poing.mp3')
	};
	
	var availablePortraits = {
		placeholder: "Assets/dialogPortraitPlaceholder.png",
		placeholder1: "Assets/dialogPortraitPlaceholder1.png",
		placeholder2: "Assets/dialogPortraitPlaceholder2.png",
		lenaHappyDown: "Assets/PortraitLenaHappyDown.png",
		lenaStumpedDown: "Assets/PortraitLenaStumpedDown.png",
		lenaSeriousUp: "Assets/PortraitLenaSeriousUp.png",
	}
	
	var dialogQueue = [{title: "Paulina", message:"Wow, those dialog boxes are pretty cool huh?", portrait: "lenaHappyDown", pitch: 1},
					   {title: "Paulina", message:"And you can advance them too??", portrait: "lenaStumpedDown", pitch: 1},
					   {title: "K.B", message:"Yes, pretty cool, a shame I haven't been drawn yet huh...", portrait: "placeholder1", pitch: 0.7 , sfx: "poing"},
					   {title: "Paulina", message:"welp, heads up!", portrait: "lenaSeriousUp", pitch: 1}];
	var dialogPause = 0;
	var currentAnimations = [];
	
	var PlayerHeight = parseInt(document.getElementById("player").style.height.split("px").join(""),10);
	var PlayerWidth = parseInt(document.getElementById("player").style.width.split("px").join(""),10);
	var foldHeight = 144;
	var foldWidth = 256;
	var charSpeed = 3;
	var gravityPower = 1;
	var playerVerticalSpeed = 0;
	var playerJumpPower = -6;
	var playerAirMoveMultiplier = 2;
	var isPlayerFacingRight = true;
	
	var currentDialogWordCounter = 0;
	
	var mobileControlCounter = 0;
	
	var currentFoldScale = 1;
	
	var dialogStandardPause = 5;
	
	var currentFoldMargin = 0;
	
	var playerHealth = 20;
	var playerMaxHealth = playerHealth;
	
	var currentlyStandingBlock = null;
	
	var isGrounded = false;
	var canMove = true;
    var canShoot = true;
	
	var isGameOver = false;
	var isRedirecting = false;
	var ReturnScreen = "https://gustavo-batista.online/apps/ropEngine/engine.html";
	var scoreCounters = {
						shots: 0,
						kills: 0,
						breakables: 0,
						jumps: 0, 
						x: 0,
						y: 0,
						seconds: 0,
						damageTaken: 0,
						dialogsRead: 0
						};
	
	var firingTimer = 35;
	var firingTime = 0;
	
	var keys = [];
	var MaxTicks = 60;
	var TicksThisSecond = 0;
	var t=setInterval(clearTicks,1000);
	var gameloop=setInterval(Update,20);
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const urlScale = urlParams.get('scale');
	const urlMargin = urlParams.get('margin');
	
	AnimationClassTo("player", "animationPlayerLookRight");
	toggleAndMove("playerAttack", false, 0, 0);
	
	RunOnStart();
	
	function toggleAndMove(id, isActive, x, y){
		let ob = document.getElementById(id);
		if(isActive){ ob.style.display = "block";}
		else{  ob.style.display = "none"; RemovePlaying(id);}
		 ob.style.top = y + "";
		 ob.style.left = x + "";
	}
	
	function createObject(width, height,posX, posY, name, color, className){
		if(color == null || color == undefined) color = "white";
		let classNameString = "";
		if(className != undefined){
			if(Array.isArray(className)){
				classNameString = `class="`+ className.join(" ") +`"`;
			}else{
				classNameString = `class="`+ className +`"`;
			}
			
		}
		let obj = `<obj `+ classNameString +` id="`+ name +`" style="margin:0px;padding:0px;width:`+ width +`px;height:`+ height +`px;top:`+ (144-posY) +`px;left:`+ posX +`px;background-color:`+ color +`;position:absolute;display:block;"></obj>`;
		document.getElementById("fold").innerHTML += obj;
		
		return document.getElementById(name);
	}
	
	function flipObj(id){
		let obj = document.getElementById(id);
		obj.classList.add("flipped");
	}
	function unflipObj(id){
		let obj = document.getElementById(id);
		obj.classList.remove("flipped");
	}
	
	function scaleFold(up){
		let fold = document.getElementById("fold");
		let step = 0.05;
		if(up){
			currentFoldScale += step;
		}else{
			currentFoldScale -= step;
		}
		fold.style.transform = "scale("+ currentFoldScale +")";
		document.getElementById("zoomPercent").innerHTML = Math.round((currentFoldScale * 100)) + "%";
	}
	
	function marginFold(up){
		let controls = document.getElementById("touchControls");
		let step = 10;
		if(up){
			currentFoldMargin += step;
		}else{
			currentFoldMargin -= step;
		}
		controls.style.marginTop = Math.round(currentFoldMargin) +"px";
		document.getElementById("marginGame").innerHTML = Math.round(currentFoldMargin ) + "px";
	}
	
	function handleAlternateControls(){
		alternateControls["action"] = (keys[32] || (mobileControlCounter > 0 && alternateControls["action"]));
		alternateControls["up"] = (keys[87] || keys[38] || (mobileControlCounter > 0 && alternateControls["up"]));
		alternateControls["left"] = (keys[65] || keys[37] || (mobileControlCounter > 0 && alternateControls["left"]));
		alternateControls["right"] = (keys[68] || keys[39] || (mobileControlCounter > 0 && alternateControls["right"]));
		
		if(keys[32] || keys[87] || keys[65] || keys[68] || keys[38] || keys[37] ||  keys[39]){
			touchControls.style.opacity = "0.03"
		}

		if(mobileControlCounter > 0){
			mobileControlCounter --;
		}
	}
	
	function buttonFunction(action, delay){
		alternateControls[action] = true; 
		mobileControlCounter = delay;
	}
	
	function checkGoals(){
	
	}
	
	function RunOnStart(){
		const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
		const butLeft = document.getElementById("buttonLeft");
		const butRight = document.getElementById("buttonRight");
		const butUp = document.getElementById("buttonUp");
		const butAction = document.getElementById("buttonAction");
		
		const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

		if (isFirefox) {
		  currentFoldScale = 4;
		}
	    if(vw < 1024){
			currentFoldScale = currentFoldScale*0.3;
			currentFoldMargin = -350;
		}
		if(urlScale != null){
			currentFoldScale = parseInt(urlScale, 10)/100;
		}
		if(urlMargin != null){
			currentFoldMargin = parseInt(urlMargin, 10);
		}
		
		let fold = document.getElementById("fold");
		fold.style.transform = "scale("+ currentFoldScale +")";
		document.getElementById("zoomPercent").innerHTML = (currentFoldScale * 100) + "%";
		
		let controls = document.getElementById("touchControls");
		controls.style.marginTop = Math.round(currentFoldMargin) +"px";
		document.getElementById("marginGame").innerHTML = Math.round(currentFoldMargin ) + "px";
		
		butLeft.addEventListener("click", function() {
			buttonFunction('left', 5);
		});
		butRight.addEventListener("click", function() {
			buttonFunction('right', 5);
		});
		butUp.addEventListener("click", function() {
			buttonFunction('up', 5);
		});
		butAction.addEventListener("click", function() {
			buttonFunction('action', 5);
		});
		
		
		
		butLeft.addEventListener("touchstart", function() {
			buttonFunction('left', 1000000);
		});
		butRight.addEventListener("touchstart", function() {
			buttonFunction('right', 1000000);
		});
		butUp.addEventListener("touchstart", function() {
			buttonFunction('up', 1000000);
		});
		butAction.addEventListener("touchstart", function() {
			buttonFunction('action', 1000000);
		});
		
		butLeft.addEventListener("touchmove", function() {
			buttonFunction('left', 1000000);
		});
		butRight.addEventListener("touchmove", function() {
			buttonFunction('right', 1000000);
		});
		butUp.addEventListener("touchmove", function() {
			buttonFunction('up', 1000000);
		});
		butAction.addEventListener("touchmove", function() {
			buttonFunction('action', 1000000);
		});
		
		
		butLeft.addEventListener("touchend", function() {
			buttonFunction('left', 0);
		});
		butRight.addEventListener("touchend", function() {
			buttonFunction('right', 0);
		});
		butUp.addEventListener("touchend", function() {
			buttonFunction('up', 0);
		});
		butAction.addEventListener("touchend", function() {
			buttonFunction('action', 0);
		});
	
		
		
	}

	function Update(){
		if(TicksThisSecond < MaxTicks){
			handleAlternateControls();
			if(!handlingDialog() && !isGameOver){
				ApplyGravityToPlayer();
				HandlePlayerMovement();
				CheckAttackTiming();
				HandleEnemyActions();
				checkGoals();
			}else if(isGameOver){
				AnimationClassTo("overlay", "gameOver");
				if(alternateControls["action"] && !isRedirecting){
					isRedirecting = true;
					window.location.href = ReturnScreen + "?scale=" + Math.round(currentFoldScale*100) + "&margin=" + Math.round(currentFoldMargin);
				}
			}
			TicksThisSecond++;
		}
	}
	
	function handlingDialog(){
		let dialogBox = document.getElementById("boxMessage");
		let dialogPortrait = document.getElementById("dialogPortrait");
		if(dialogQueue.length > 0 || dialogPause > 0){
			toggleAndMove("boxMessage", true, 0, 0);
			toggleAndMove("dialogPortrait", true, 0, 0);
			let title = document.getElementById("boxTitle");
			let message = document.getElementById("boxText");
			let textToUse = (dialogQueue.length > 0) ? dialogQueue[0].message.split(" ") : [];
			dialogPause--;
			if(dialogPause <= 0)currentDialogWordCounter++;
			let wordSlice = (currentDialogWordCounter < textToUse.length) ? currentDialogWordCounter : textToUse.length;
			if(currentDialogWordCounter < textToUse.length && dialogPause <= 0){
				dialogPause = dialogStandardPause;
			}
			if(alternateControls["action"] && dialogPause <= 0){
				if(currentDialogWordCounter < textToUse.length){
					currentDialogWordCounter = textToUse.length;
				}else{
					currentDialogWordCounter = 0;
					dialogQueue.splice(0, 1);
					dialogPause = dialogStandardPause*4;
					scoreCounters["dialogsRead"]++;
					if(dialogQueue.length > 0 && dialogQueue[0] != null && dialogQueue[0] != undefined){
						if(dialogQueue[0].sfx != null && dialogQueue[0].sfx != undefined && availableSounds[dialogQueue[0].sfx] != undefined){
							availableSounds[dialogQueue[0].sfx].play();
						}
					}
					if(dialogQueue.length > 0 && dialogQueue[0].sfx == undefined){
						let voiceUsed = getRandomInt(6)
						if(voiceUsed == 0) voiceUsed = 3;
						availableSounds["voice" + voiceUsed].playbackRate = dialogQueue[0].pitch;
						availableSounds["voice" + voiceUsed].preservesPitch = false;
						availableSounds["voice" + voiceUsed].play();
						
					}
				}
			   
			}else if(alternateControls["action"] && dialogPause <= dialogStandardPause){
				if(currentDialogWordCounter < textToUse.length){
					currentDialogWordCounter = textToUse.length;
				}
			}				
			if(dialogQueue == null || dialogQueue == undefined || dialogQueue.length < 1) return true;
			title.innerHTML = dialogQueue[0].title;
			message.innerHTML = textToUse.slice(0, wordSlice).join(" ");
			dialogPortrait.style.backgroundImage = "url("+ availablePortraits[dialogQueue[0].portrait] +")";
			return true;
		}else{
			currentDialogWordCounter = 0;
			toggleAndMove("boxMessage", false, 0, 0);
			toggleAndMove("dialogPortrait", false, 0, 0);
			return false;
		}
	}
	
	function ClearAudioCache(){
		for (const sound in availableSounds) {
			sound.onended = function() {};
		}
	}
	
	function AnimationClassTo(id, className){
		document.getElementById(id).className = className;
	}
	
	function addClassTo(id, className){
		document.getElementById(id).classList.add(className);
	}
	function removeClassFrom(id, className){
		document.getElementById(id).classList.remove(className);
	}
	function makeChildOf(id, parent){
		document.getElementById(parent).appendChild(document.getElementById(id));
	}
	function ApplyGravityToPlayer(){
		if(!isGrounded){
			playerVerticalSpeed += gravityPower; 
		}else{
			playerVerticalSpeed = 0;
		}
	}


	function HandleEnemyActions(){
		let objects = document.getElementsByTagName("obj");
		for(let i = 0; i < objects.length; i++){
			if(objects[i].id.includes("enemy")){
				if(objects[i].id.includes("enemyBasic")){
					basicEnemyAI(objects[i].id);
				} else if(objects[i].id.includes("enemyVBasic")){
					basicEnemyVerticalAI(objects[i].id);
				}
				
			}
			continue;
		}
	}
	
	function basicEnemyAI(id){
					let enemy = document.getElementById(id);
					let enemyBasicRange = parseInt(enemy.id.split("enemyBasic").join(""), 10);
					if(enemyBasicRange <= 1) return;
					let maxRange = Array.from(enemy.classList).filter(word => word.includes("maxRange"));
					maxRange = (maxRange == undefined || maxRange.length < 1) ? [(foldWidth + "")] : [maxRange[0].split("maxRange").join("")];
					let minRange = Array.from(enemy.classList).filter(word => word.includes("minRange"));
					minRange = (minRange == undefined || minRange.length < 1) ? ["0"] : [minRange[0].split("minRange").join("")];
					let fWidth = foldWidth;
					let leftMargin = parseFloat(enemy.style.left.split("px").join(""),10);
					let objWidth = parseFloat(enemy.style.width.split("px").join(""),10);
					let movementAmount = getRandomInt(enemyBasicRange);
					let wasNegative = enemy.classList.contains("wasNegative");
					let isNegative = wasNegative;
					let deadZoneStart = 10;
					let deadZoneEnd = 90;
					let chanceToBeChange = (leftMargin + objWidth)/fWidth * 100;
					if((chanceToBeChange > deadZoneStart && chanceToBeChange < deadZoneEnd)){
						if(wasNegative){
							isNegative = true;
						}else{
							isNegative = false;
						}
					}else{
						isNegative = (getRandomInt(101) < chanceToBeChange);
					}
					if(isNegative != wasNegative){ enemy.classList.toggle("wasNegative"); }
					
					if(leftMargin + objWidth > parseFloat(maxRange[0], 10)){ enemy.classList.remove("wasNegative"); isNegative = true; enemy.classList.add("wasNegative");}
					
					if(leftMargin < parseFloat(minRange[0], 10)){ enemy.classList.remove("wasNegative"); isNegative = false; }
					
					if(!isNegative) flipObj(enemy.id);
					else unflipObj(enemy.id);
					leftMargin +=  movementAmount * ((isNegative) ? -1 : 1); 
					if(leftMargin < 0) enemy.style.left = 0;
					if(leftMargin + objWidth > fWidth) leftMargin = fWidth - objWidth;
					
					enemy.style.left = leftMargin + "px";
	}
	
	function basicEnemyVerticalAI(id){
					let enemy = document.getElementById(id);
					let enemyBasicRange = parseInt(enemy.id.split("enemyVBasic").join(""), 10);
					if(enemyBasicRange <= 1) return;
					let maxRange = Array.from(enemy.classList).filter(word => word.includes("maxRange"));
					maxRange = (maxRange == undefined || maxRange.length < 1) ? [(foldWidth + "")] : [maxRange[0].split("maxRange").join("")];
					let minRange = Array.from(enemy.classList).filter(word => word.includes("minRange"));
					minRange = (minRange == undefined || minRange.length < 1) ? ["0"] : [minRange[0].split("minRange").join("")];
					let fHeight = foldHeight;
					let topMargin = parseFloat(enemy.style.top.split("px").join(""),10);
					let objHeight = parseFloat(enemy.style.height.split("px").join(""),10);
					let movementAmount = getRandomInt(enemyBasicRange);
					let wasNegative = enemy.classList.contains("wasNegative");
					let isNegative = wasNegative;
					let deadZoneStart = 10;
					let deadZoneEnd = 90;
					let chanceToBeChange = (topMargin + objHeight)/fHeight * 100;
					if((chanceToBeChange > deadZoneStart && chanceToBeChange < deadZoneEnd) || topMargin < parseFloat(minRange[0], 10) || topMargin > parseFloat(maxRange[0],10)){
						if(wasNegative){
							isNegative = true;
						}else{
							isNegative = false;
						}
					}else{
						isNegative = (getRandomInt(101) < chanceToBeChange);
					}
					if(isNegative != wasNegative){ enemy.classList.toggle("wasNegative"); }
					
					if(topMargin < parseFloat(minRange[0], 10)){enemy.classList.remove("wasNegative"); isNegative = false;}
					
					if(topMargin > parseFloat(maxRange[0], 10)){enemy.classList.remove("wasNegative"); isNegative = true; enemy.classList.add("wasNegative");  }
					
					if(!isNegative) flipObj(enemy.id);
					else unflipObj(enemy.id);
					topMargin +=  movementAmount * ((isNegative) ? -1 : 1); 
					if(topMargin < 0) enemy.style.top = 0;
					if(topMargin + objHeight > fHeight) topMargin = fHeight - objHeight;
					
					enemy.style.top = topMargin + "px";
	}
	
	
	
	function HandlePlayerMovement(){
		    let player = document.getElementById("player");
			let TopValue = parseInt(player.style.top.split("px").join(""),10);
			let LeftValue = parseInt(player.style.left.split("px").join(""),10);
			
		if(canMove){
			
		  if (alternateControls["up"] && isGrounded) {
			playerVerticalSpeed += playerJumpPower;
			isGrounded = false;
			currentlyStandingBlock = null;
			availableSounds["playerJump"].play();
			scoreCounters["jumps"]++;
		  }
		  if (alternateControls["left"]) {
		    AnimationClassTo("player", "animationPlayerLookLeft");
			isPlayerFacingRight = false;
			flipObj("playerHurt");
			AddPlaying("player");
			LeftValue -= charSpeed * ((isGrounded) ? 1 : playerAirMoveMultiplier );
		  }else if(alternateControls["right"]) {
		    AnimationClassTo("player", "animationPlayerLookRight");
			isPlayerFacingRight = true;
			unflipObj("playerHurt");
			AddPlaying("player");
			LeftValue += charSpeed * ((isGrounded) ? 1 : playerAirMoveMultiplier );
		  }else if(!alternateControls["right"] && !alternateControls["left"]){
			RemovePlaying("player");
		  }
		  scoreCounters["x"] = LeftValue;
		  scoreCounters["y"] = TopValue;
		  if(alternateControls["action"] && canShoot){
		    scoreCounters["shots"]++;
			ClearAudioCache();
			if(isPlayerFacingRight){
				toggleAndMove("playerAttack", true, LeftValue + PlayerWidth, TopValue);
				unflipObj("playerAttack");
				AddPlaying("playerAttack");
				availableSounds["playerAttack"].play();
			}else{
				toggleAndMove("playerAttack", true, LeftValue - PlayerWidth, TopValue);
				flipObj("playerAttack");
				AddPlaying("playerAttack");
				availableSounds["playerAttack"].play();
			}
			canShoot = false;
		  }
		  
		  
			
		}
			
		  if(!isGrounded) addClassTo("player", "onAir");
		  else removeClassFrom("player", "onAir");
			
		  TopValue += playerVerticalSpeed;
		  if(TopValue < 0){ TopValue = 0; }
		  if(TopValue + PlayerHeight > foldHeight){ 
		  TopValue = foldHeight - PlayerHeight; 
		  isGrounded = true;
		  currentlyStandingBlock = null;
		  }
		  if(LeftValue < 0){ LeftValue = 0; }
		  if(LeftValue + PlayerWidth > foldWidth){ LeftValue = foldWidth - PlayerWidth;}
			player.style.top = TopValue+"px";
			player.style.left = LeftValue+"px";
			DetectPlayerColision();
	}
	
	function changeOpacityTo(id, op){
		document.getElementById(id).style.opacity = op + "";
	}
	
	function getRandomInt(max) {
	  return Math.floor(Math.random() * max);
	}
	
	function AddPlaying(id){
		document.getElementById(id).classList.add("playing");
	}
	
	function RemovePlaying(id){
		document.getElementById(id).classList.remove("playing");
	}
	
	function CheckAttackTiming(){
		if(isActive("playerAttack")){
			firingTime++;
			if(firingTime >= firingTimer){
				toggleAndMove("playerAttack", false, 0, 0);
				firingTime = 0;
				canShoot = true;
			}else{
				let objects = document.getElementsByTagName("obj");
				for(let i = 0; i < objects.length; i++){
					if(objects[i].id.includes("enemy")){
						if(objects[i].id.includes("enemyBasic") || objects[i].id.includes("enemyVBasic") && !objects[i].id.includes("breakable")){
							let hasHit = simpleCheckifIntersect(objects[i].id, "playerAttack");
							if(hasHit){
								availableSounds['playerKill'].play();
								toggleAndMove(objects[i].id, false, 0, 0);
								scoreCounters["kills"]++;
							};
						}
					}else if(objects[i].id.includes("breakable")){
						let hasHit = simpleCheckifIntersect(objects[i].id, "playerAttack");
							if(hasHit){
								availableSounds['breakObstacle'].play();
								toggleAndMove(objects[i].id, false, 0, 0);
								scoreCounters["breakables"]++;
							};
					}
					continue;
				}
			}
		}
	}
	
	function DetectPlayerColision(){
		let objects = document.getElementsByTagName("obj");
		let player = document.getElementById("player");
		
		
		let TopValue = parseFloat(player.style.top.split("px").join(""),10);
		let LeftValue = parseFloat(player.style.left.split("px").join(""),10);
		
		
		
		
		let plyrX = LeftValue;
		let plyrY = TopValue;
		
		
		
		for(let i = 0; i < objects.length; i++){
			if(!objects[i].id.includes("player") && !objects[i].id.includes("enemy")){
				var objX = parseFloat(objects[i].style.left.split("px").join(""),10);
				var objY = parseFloat(objects[i].style.top.split("px").join(""),10);
				var objH = parseFloat(objects[i].style.height.split("px").join(""),10)-1;
				var objW = parseFloat(objects[i].style.width.split("px").join(""),10);
				
				   if (
					    objects[i] != currentlyStandingBlock && 
						plyrX < objX + objW &&
						plyrX + PlayerWidth > objX &&
						plyrY < objY + objH &&
						PlayerHeight + plyrY > objY
					  ){
						
						 var hasColidedWall = false; 
						
						
						if(plyrX+(PlayerWidth/2) >= objX + (objW/2)){
							if(objects[i].id.includes("wall")){  LeftValue = objX + objW; hasColidedWall = true; }
							LeftValue += 1;
						}else{
							if(objects[i].id.includes("wall")){  LeftValue = objX - PlayerWidth; hasColidedWall = true; }
							LeftValue -= 1;
						}
						
						if(plyrY - (PlayerHeight) >= objY){
							if(objects[i].id.includes("wall") && !hasColidedWall ){  TopValue = objY + objH; playerVerticalSpeed = 0;  }
						}else{
							//TopValue -= 1;
							if(isGrounded == false){
								isGrounded = true;
								currentlyStandingBlock = objects[i];
								continue;
							}
							
						}
					    
						player.style.top = TopValue+"px";
						player.style.left = LeftValue+"px";
						canMove = false;
				  }else{ canMove = true;
				  
						if(currentlyStandingBlock != null && isOverCurrentBlock()){
							player.style.top =  getHeightToBeOnCurrentBlock() + "";
							continue;
							}
						
				  }
			}else if(objects[i].id.includes("enemy")){
					var objX = parseFloat(objects[i].style.left.split("px").join(""),10);
					var objY = parseFloat(objects[i].style.top.split("px").join(""),10);
					var objH = parseFloat(objects[i].style.height.split("px").join(""),10);
					var objW = parseFloat(objects[i].style.width.split("px").join(""),10);
				 if (
						plyrX < objX + objW &&
						plyrX + PlayerWidth > objX &&
						plyrY < objY + objH &&
						PlayerHeight + plyrY > objY &&
						isActive(objects[i].id)
					  ){
							playerHealth--;
							scoreCounters["damageTaken"]++;
							
							if(playerHealth < 0){ 
								playerHealth = 0;
								isGameOver = true;
								availableSounds['death'].play();
							}else{
								availableSounds['playerHurt'].play();
							}
							playerVerticalSpeed = -6;
							changeOpacityTo("playerHurt", ((playerHealth-playerMaxHealth)*-1)/playerMaxHealth);
					  }
			}
			continue;
		}
		if(currentlyStandingBlock != null){
			if (!isOverCurrentBlock()){
			isGrounded = false;
		}
		}

	}
	
	function getHeightToBeOnCurrentBlock(){
		return  (parseFloat(currentlyStandingBlock.style.top.split("px").join(""),10) - (parseFloat(currentlyStandingBlock.style.height.split("px").join(""),10)));
	}
	
	function isSunkOnCurrentBlock(){
		return (TopValue - (PlayerHeight/2) < parseFloat(currentlyStandingBlock.style.top.split("px").join(""),10) - (parseFloat(currentlyStandingBlock.style.height.split("px").join(""),10)-1/2))
	}
	
	function simpleCheckifIntersect(id1, id2){
			let obj1 = document.getElementById(id1);
		    let obj2 = document.getElementById(id2);
			if(!isActive(obj1.id) || !isActive(obj2.id)) return false;
			
			var obj1X = parseFloat(obj1.style.left.split("px").join(""),10);
			var obj1Y = parseFloat(obj1.style.top.split("px").join(""),10);
			var obj1H = parseFloat(obj1.style.height.split("px").join(""),10)-1;
			var obj1W = parseFloat(obj1.style.width.split("px").join(""),10);
			
			var obj2X = parseFloat(obj2.style.left.split("px").join(""),10);
			var obj2Y = parseFloat(obj2.style.top.split("px").join(""),10);
			var obj2H = parseFloat(obj2.style.height.split("px").join(""),10)-1;
			var obj2W = parseFloat(obj2.style.width.split("px").join(""),10);
			
			
		 return (
					obj1X < obj2X + obj2W &&
						obj1X + obj1W > obj2X &&
						obj1Y < obj2Y + obj2H &&
						obj1H + obj1Y > obj2Y
				);
	}


	function isOverCurrentBlock(){
		return (parseFloat(player.style.left.split("px").join(""),10) < parseFloat(currentlyStandingBlock.style.left.split("px").join(""),10) + parseFloat(currentlyStandingBlock.style.width.split("px").join(""),10) &&
			parseFloat(player.style.left.split("px").join(""),10) + PlayerWidth > parseFloat(currentlyStandingBlock.style.left.split("px").join(""),10));
	}
	
	
	function isActive(id){
		return (document.getElementById(id) != undefined && document.getElementById(id) != null && document.getElementById(id).style.display != "none");
	}
	
	
	
	document.addEventListener("keyup", function (e) {
        keys[e.keyCode]=false;
        stop();
    }, false);
	document.addEventListener("keydown", function(event) {
		  keys = (keys || []);
		  keys[event.keyCode]=true;
		   if((event.keyCode == 32 || event.keyCode == 87 || event.keyCode == 65 || event.keyCode == 68 || event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40) && event.target == document.body) {
			event.preventDefault();
		   }
	});


	function clearTicks(){
		scoreCounters["seconds"]++;
		if(isRedirecting){
			window.location.href = ReturnScreen + "?scale=" + Math.round(currentFoldScale*100) + "&margin=" + Math.round(currentFoldMargin);
		}
		TicksThisSecond = 0;
	}
 	