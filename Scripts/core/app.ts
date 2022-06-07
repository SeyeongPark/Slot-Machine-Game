/*File name : app.ts
  Author's name : Seyeong Park
  Web site name : SY's Slot Machine
  File description: This is main TypeScript file for slot machine*/

(function(){
    let playerMoney = 5000;
    let winnings = 0;
    let jackpot = 777;
    let playerBet = 0;

    // Function scoped Variables
    let stage: createjs.Stage;
    let assets: createjs.LoadQueue;
    let slotMachineBackground: Core.GameObject;
    let spinButton: UIObjects.Button;
    let bet1Button: UIObjects.Button;
    let bet10Button: UIObjects.Button;
    let bet100Button: UIObjects.Button;
    let betMaxButton: UIObjects.Button;
    let resetButton: UIObjects.Button;
    let stopButton: UIObjects.Button;
    let reloadButton: UIObjects.Button;
    let jackPotLabel: UIObjects.Label;
    let creditLabel: UIObjects.Label;
    let winningsLabel: UIObjects.Label;
    let betLabel: UIObjects.Label;
    let leftReel: Core.GameObject;
    let middleReel: Core.GameObject;
    let rightReel: Core.GameObject;
    let betLine: Core.GameObject;
    let resultLabel: UIObjects.Label;   
    let InfoReloadLabel:  UIObjects.Label;  

    // symbol tallies
    let grapes = 0;
    let bananas = 0;
    let oranges = 0;
    let bells = 0;
    let sevens = 0;
    let pys = 0;
    let htmls = 0;
    let jss = 0;

    let manifest: Core.Item[] = [
        {id:"background", src:"./Assets/images/background.png"},
        {id:"banana", src:"./Assets/images/banana.gif"},
        {id:"bell", src:"./Assets/images/bell.gif"},
        {id:"bet_line", src:"./Assets/images/bet_line.gif"},
        {id:"bet1Button", src:"./Assets/images/bet1Button.png"},
        {id:"bet10Button", src:"./Assets/images/bet10Button.png"},
        {id:"bet100Button", src:"./Assets/images/bet100Button.png"},
        {id:"betMaxButton", src:"./Assets/images/betMaxButton.png"},
        {id:"grapes", src:"./Assets/images/grapes.gif"},
        {id:"orange", src:"./Assets/images/orange.gif"},
        {id:"seven", src:"./Assets/images/seven.gif"},
        {id:"pyth", src:"./Assets/images/pyth.gif"},
        {id:"htmlfi", src:"./Assets/images/htmlfi.gif"},
        {id:"jscri", src:"./Assets/images/jscri.gif"},
        {id: "resetButton", src: "./Assets/images/resetButton.png" },
        {id: "stopButton", src: "./Assets/images/stopIcon.png" },
        {id: "spinButton", src:"./Assets/images/spinButton.png"},
        {id: "reloadButton", src: "./Assets/images/reload.png" },
        {id: "coin", src: "./Assets/sound/coin.mp3" },
        {id: "spin", src: "./Assets/sound/spin.mp3" },
        {id: "checking", src: "./Assets/sound/checking.mp3" },
    ];   

        /* Utility function to reset all fruit tallies */
    function resetReelTally():void {
        grapes = 0;
        bananas = 0;
        oranges = 0;
        bells = 0;
        sevens = 0;
        pys = 0;
        htmls = 0;
        jss = 0;
        }
        /* Utility function to reset the player stats */
        function resetAll():void {
        playerMoney = this.playerMoney;
        winnings = 0;
        jackpot = this.jackpot;
        playerBet = 0;
        }

    /* Utility function to show a win message and increase player money */
    function showWinMessage(object):void {
        playerMoney += winnings;
        resultLabel.text="You Won: $ " + winnings;
        if(winnings == 0){
            console.log("     Sorry, you lose. Try again");
        }
        if(object == "sevens"){
            console.log("******************************");
            console.log("*** Jacktop! You won $ " + jackpot + " ***");
            console.log("*** ( Betting * 50 + 777 ) ***");
            console.log("******************************");
        }
        else{
            console.log("You won $ " + winnings + ' from 3 ' + object );
        }
        creditLabel.text=playerMoney.toString();

        createjs.Sound.play("checking");
        winningsLabel.text=winnings.toString();
        resetReelTally();
    }
    /* Utility function to show a lose message and increase player money */
    function showLossMessage():void {
        playerMoney -= playerBet;
        resultLabel.text=("You Lost, Try again");
        console.log("You lost $ "+playerBet);
        creditLabel.text=playerMoney.toString();

        resetReelTally();
    }    
    
    // This function triggers first and "Preloads" all the assets
    function Preload()
    {
        assets = new createjs.LoadQueue();
        assets.installPlugin(createjs.Sound);
        assets.on("complete", Start);

        assets.loadManifest(manifest);
    }

    // This function triggers after everything has been preloaded
    // This function is used for config and initialization
    function Start():void
    {
        console.log("App Started...");
        console.log("-----------Good luck-----------");
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;
        stage = new createjs.Stage(canvas);
        createjs.Ticker.framerate = 60; // 60 FPS or 16.667 ms
        createjs.Ticker.on("tick", Update);

        stage.enableMouseOver(20);

        Config.Globals.AssetManifest = assets;

        Main();
    }

    // called every frame
    function Update():void
    {
        stage.update();
    }

    /* Utility function to check if a value falls within a range of bounds */
    function checkRange(value:number, lowerBounds:number, upperBounds:number):number | boolean {
        if (value >= lowerBounds && value <= upperBounds)
        {
            return value;
        }
        else {
            return !value;
        }
    }

    /* When this function is called it determines the betLine results.
    e.g. Bar - Orange - Banana */
    function Reels():string[] {
        let betLine = [" ", " ", " "];
        let outCome = [0, 0, 0];

        for (let spin = 0; spin < 3; spin++) {
            outCome[spin] = Math.floor((Math.random() * 100)+1);
            switch (outCome[spin]) {
                case checkRange(outCome[spin], 0, 20): // 20% probability
                    betLine[spin] = "grapes";
                    grapes++;
                    break;
                case checkRange(outCome[spin], 21, 40): // 20% probability
                    betLine[spin] = "banana";
                    bananas++;
                    break;
                case checkRange(outCome[spin], 41, 60): // 20% probability
                    betLine[spin] = "orange";
                    oranges++;
                    break;
            
                case checkRange(outCome[spin], 61, 67): //  7% probability
                    betLine[spin] = "bell";
                    bells++;
                    break;
                case checkRange(outCome[spin], 68, 70): //  3% probability
                    betLine[spin] = "seven";
                    sevens++;
                    break;
                    
                //additional Reels
                case checkRange(outCome[spin], 71, 80): // 10% probability
                    betLine[spin] = "pyth";
                    pys++;
                    break;
                case checkRange(outCome[spin], 81, 90): // 10% probability
                    betLine[spin] = "htmlfi";
                    htmls++;
                    break;
                case checkRange(outCome[spin], 91, 100): // 10% probability
                    betLine[spin] = "jscri";
                    jss++;
                    break;
            }
        }
        return betLine;
    }

    /* This function calculates the player's winnings, if any */
    function determineWinnings() {
        let object;
            if (grapes == 3) {
                winnings = playerBet * 10;
                object = 'grapes';
            }
            else if (bananas == 3) {
                winnings = playerBet * 10;
                object = 'bananas';
            }
            else if (oranges == 3) {
                winnings = playerBet * 10;
                object = 'oranges';
            }
            else if (bells == 3) {
                winnings = playerBet * 20;
                object = 'bells';
            }
            else if (sevens == 3) {
                winnings = playerBet * 50 + 777;
                object = 'sevens';
            }
            else if (pys == 3) {
                winnings = playerBet * 30;
                object = 'Pythons';
            }
            else if (htmls == 3) {
                winnings = playerBet * 30;
                object = 'HTMLs';
            }
            else if (jss == 3) {
                winnings = playerBet * 30;
                object = 'JSs';
            }
            else {
                playerMoney -= playerBet;
            }
            showWinMessage(object);
    }

    function buildInterface():void
    {
        // Slot Machine Background
        slotMachineBackground = new Core.GameObject("background", Config.Screen.CENTER_X, Config.Screen.CENTER_Y, true);
        stage.addChild(slotMachineBackground);

        // Buttons
        spinButton = new UIObjects.Button("spinButton", Config.Screen.CENTER_X + 135, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(spinButton);
        bet1Button = new UIObjects.Button("bet1Button", Config.Screen.CENTER_X - 135, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(bet1Button);
        bet10Button = new UIObjects.Button("bet10Button", Config.Screen.CENTER_X - 67, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(bet10Button);
        bet100Button = new UIObjects.Button("bet100Button", Config.Screen.CENTER_X, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(bet100Button);
        betMaxButton = new UIObjects.Button("betMaxButton", Config.Screen.CENTER_X + 67, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(betMaxButton);
        resetButton = new UIObjects.Button("resetButton", Config.Screen.CENTER_X -250, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(resetButton);
        stopButton = new UIObjects.Button("stopButton", Config.Screen.CENTER_X -250, Config.Screen.CENTER_Y +70, true);
        stage.addChild(stopButton);
        reloadButton = new UIObjects.Button("reloadButton", Config.Screen.CENTER_X -250, Config.Screen.CENTER_Y -30, true);
        stage.addChild(reloadButton);

        // Labels
        resultLabel = new UIObjects.Label("Click SPIN button" , "40px", "cursive", "#D4AF37", Config.Screen.CENTER_X, Config.Screen.CENTER_Y - 310, true);
        stage.addChild(resultLabel);   

        jackPotLabel = new UIObjects.Label("777", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X+1, Config.Screen.CENTER_Y - 172, true);
        stage.addChild(jackPotLabel);

        creditLabel = new UIObjects.Label(playerMoney.toString(), "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X - 94, Config.Screen.CENTER_Y + 108, true);
        stage.addChild(creditLabel);

        winningsLabel = new UIObjects.Label("-", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X + 94, Config.Screen.CENTER_Y + 108, true);
        stage.addChild(winningsLabel);

        betLabel = new UIObjects.Label("-", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X-14, Config.Screen.CENTER_Y + 108, true);
        stage.addChild(betLabel);

        // Reel GameObjects
        leftReel = new Core.GameObject("orange", Config.Screen.CENTER_X - 86, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(leftReel);

        middleReel = new Core.GameObject("seven", Config.Screen.CENTER_X, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(middleReel);

        rightReel = new Core.GameObject("pyth", Config.Screen.CENTER_X + 78, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(rightReel);

        // Bet Line
        betLine = new Core.GameObject("bet_line", Config.Screen.CENTER_X, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(betLine);
    }

    function interfaceLogic():void
    {
        spinButton.on("click", ()=>{
            // play sound after it is clikcked
            createjs.Sound.play("spin");
            // clear winnings variable
            winnings=0;
            // clear the winningLabel
            winningsLabel.text="-";

            // reel test
            let reels = Reels();

            // example of how to replace the images in the reels
            leftReel.image = assets.getResult(reels[0]) as HTMLImageElement;
            middleReel.image = assets.getResult(reels[1]) as HTMLImageElement;
            rightReel.image = assets.getResult(reels[2]) as HTMLImageElement;

            if (playerMoney == 0)
            {
                if (confirm("You ran out of Money! \nDo you want to play again?")) {                    
                resetAll();
                resetReelTally();  
                console.log("----------------------------");
                }
            }
            else if ( playerBet <= playerMoney ) {                 
                reels; 
                determineWinnings();
            }
            else if ( playerBet > playerMoney) {
                if (confirm("You don't have enough Money to place that bet. \nDo you want to play again?")) {
                    resetAll();      
                    resetReelTally();              
                    console.log("----------------------------");
                }
            }
            else if (playerMoney >= jackpot) {
                confirm("Congratulations, you won $" + jackpot + " Jackpot!!")
            }

        });

        bet1Button.on("click", ()=>{
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            console.log("$$$       You bet $ 1      $$$");
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            playerBet += 1;   
            betLabel.text=playerBet.toString(); 
            
             // play sound after it is clikcked           
            createjs.Sound.play("coin");         
        });

        bet10Button.on("click", ()=>{
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            console.log("$$$       You bet $ 10     $$$");
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");      
            playerBet += 10;      
            betLabel.text=playerBet.toString(); 
            // play sound after it is clikcked           
            createjs.Sound.play("coin");    
        });

        bet100Button.on("click", ()=>{
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            console.log("$$$       You bet $ 100    $$$");
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\n");
            playerBet += 100;    
            betLabel.text=playerBet.toString();
            // play sound after it is clikcked
            createjs.Sound.play("coin");     
        });

        betMaxButton.on("click", ()=>{

           let result = confirm("Are you sure you bet your all money?");
                if(result)
                {
                    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                    console.log("$$$ You bet your all money $$$");
                    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\n");
                    playerBet = playerMoney;   
                    betLabel.text=playerBet.toString();
                    // play sound after it is clikcked
                    createjs.Sound.play("coin");     
                }
        });

        resetButton.on("click", () => {    
            resetAll();
            console.log("----------------------------");
            console.log("            RESET           ");
            console.log("----------------------------");
             
        }); 
        stopButton.on("click", () => {    

            let isStop =  confirm("Are you sure you stop this game?");
            // If user click confirm, the buttons will disapear
            if(isStop)
            {
                console.log("----------------------------");
                console.log("            STOP            ");
                console.log("----------------------------");
                console.log(" Your Credits are : $ "+playerMoney);
                console.log(" Your Bet was     : $ "+playerBet);

                spinButton.on("click", ()=>{
                    alert("You stopped the game")
                });                
                bet1Button.on("click", ()=>{
                    alert("You stopped the game")
                });
                bet10Button.on("click", ()=>{
                    alert("You stopped the game")
                });
                bet100Button.on("click", ()=>{
                    alert("You stopped the game")
                });
                betMaxButton.on("click", ()=>{
                    alert("You stopped the game")
                });
                slotMachineBackground = new Core.GameObject("background", Config.Screen.CENTER_X, Config.Screen.CENTER_Y, true);
                stage.addChild(slotMachineBackground);

                InfoReloadLabel = new UIObjects.Label("**** You can restart this game if you click 'reload' button ****", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X, Config.Screen.CENTER_Y -260, true);
                stage.addChild(InfoReloadLabel);
            }
            else
            {
            }
        }); 
        reloadButton.on("click", ()=>{
            location.reload();
            location.href = location.href;
            history.go(0);
        });
   
    }

    // app logic goes here
    function Main():void
    {
        buildInterface();
        interfaceLogic();
    }

    window.addEventListener("load", Preload);
})();