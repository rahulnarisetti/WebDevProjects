/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

// document.querySelector('#current-'+activePlayer).textContent=dice;



// var x=document.querySelector('#score-'+activePlayer).textContent;
// console.log(x);
// //document.querySelector('#current-0').innerHTML='<b>'+x+'</b>'



var scores,roundScore,activePlayer,gameplay,rollmemory,checking, zle;

function init()
{
    scores=[0,0];
    roundScore=0;
    activePlayer=0;
    gameplay=true;
    rollmemory=0;
    checking=true;

    //set scores to zero
document.getElementById('score-0').textContent='0';
document.getElementById('score-1').textContent='0';
document.getElementById('current-0').textContent='0';
document.getElementById('current-1').textContent='0';

//hide dice
document.querySelector('.dice').style.display='none';

document.getElementById('name-0').textContent='Player 1';
document.getElementById('name-1').textContent='Player 2';

document.querySelector('.player-0-panel').classList.remove('winner');
document.querySelector('.player-1-panel').classList.remove('winner');
document.querySelector('.player-0-panel').classList.remove('active');
document.querySelector('.player-1-panel').classList.remove('active');
document.querySelector('.player-0-panel').classList.add('active');


}


function changePlayer()
{
    document.getElementById('current-0').textContent='0';
    document.getElementById('current-1').textContent='0';
    roundScore=0;

    activePlayer===0? activePlayer=1:activePlayer=0;

    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');

    document.querySelector('.dice').style.display='none'; 
}






init();


document.querySelector('.btn-roll').addEventListener('click',function(){
if (gameplay)
{   
    // random number generator on click
    var dice=Math.floor((Math.random()*6)+1);
    
    //show dice and change dice number on click
    var diceDOM=document.querySelector('.dice');
    diceDOM.style.display='block';  
    diceDOM.src='dice-'+dice+'.png';
    checking=rollmemory!==dice || rollmemory!==6;
    
    //to change to next player
if (checking)
{
    if (dice>1)
    {
        roundScore += dice;
        document.querySelector('#current-'+activePlayer).textContent=roundScore;
        rollmemory=dice;
    }
    else
    {
        
        changePlayer();
        document.querySelector('.dice').style.display='block'; 
        

    }
}

else
{
    rollmemory=0;
    document.getElementById('score-'+activePlayer).textContent='0';
    scores[activePlayer]=0;
    
    changePlayer();
    document.querySelector('.dice').style.display='block';
    

}
    

}
});


document.querySelector('.btn-hold').addEventListener('click', function(){
if (gameplay)
{
    // Add current score to global score
    scores[activePlayer] +=roundScore;

    //update score on UI
    document.getElementById('score-'+activePlayer).textContent=scores[activePlayer];

      //check for winner
      if (scores[activePlayer]>=zle)
      {
          document.getElementById('name-'+activePlayer).textContent='Winner!';
          document.querySelector('.dice').style.display='none';
          document.querySelector('.player-'+activePlayer+'-panel').classList.add('winner');
          document.querySelector('.player-'+activePlayer+'-panel').classList.remove('active');
          gameplay=false;

      }

      else
      {
        // change player
        changePlayer();
      }
    
}   
});

document.querySelector('.btn-new').addEventListener('click',init);

document.querySelector('.btn-holde').addEventListener('click',function(){

    zle=document.getElementById('enter-input-1').value;
    console.log(zle);
    
});

