// import deck from "./deck.js";
const deck = [
    "AC","AD","AH","AS",
    "2C","2D","2H","2S",
    "3C","3D","3H","3S",
    "4C","4D","4H","4S",
    "5C","5D","5H","5S",
    "6C","6D","6H","6S",
    "7C","7D","7H","7S",
    "8C","8D","8H","8S",
    "9C","9D","9H","9S",
    "10C","10D","10H","10S",
    "JC","JD","JH","JS",
    "QC","QD","QH","QS",
    "KC","KD","KH","KS"
];

// game state Object
// 0 = no hands dealt, 1 = one hand, etc.
let gameState = { 
    "gameRound": 0,
    "currentHand": [],
    "remainingCards": new Set(deck)
}

function getRandomInt( max ) {
    return Math.floor(Math.random() * max);
}
/*
   used to return a set of 5 unique numbers
   between 0 and 51
*/
let getRandomSet = function( count, max )
{
    // console.log("getrandomset");
    // console.log(max);

    let numbers = new Set();

    while( numbers.size < count )
    {
       numbers.add( getRandomInt( max ) );
    }

    return numbers;
};

/* remove the last character in card string (i.e "5S", "10C" .. ) to get rank */
function getRank( card )
{
  return card.substring( 0, card.length-1 );
}

/* lookup table used to decide if a card is higher than another */
const rank = ["A","K","Q","J","10","9","8","7","6","5","4","3","2"];


/* compare two card deck entries */
function compareCards( a, b )
{
    // console.log("compare");
    // console.log(a);
    // console.log(b);
    // a and b contains
    // a string made up of rank followed by suit (S,C,H,D) 
    // removing suit to compare it by looking up the position
    // of the card's rank in the rank array 
    let ar = getRank(a ); 
    let br = getRank( b);

    return rank.indexOf(ar)-rank.indexOf(br);
}

/* last character in card is the suit/color */
function getSuit( card )
{
    // last character in string
    return card.at(-1);
}

/* a sorted histogram is returned from the hand */
function getSortedHistogram( hand )
{
    let cardRanks = hand.map( getRank );
    //console.log( cardranks );
    let histogram = new Map();

    // this loop creates and unsorted histogram from hand
    // for( let i = 0; i < cardranks.length; i++ )
    // {
    //     let currentcard = cardranks[i];

    //     if( ! histogram.has( currentcard ) )
    //     { 
    //         // counts how many of the current card is in the hand
    //         let samecards = cardranks.filter( (x) => currentcard === x );
    //         histogram.set( cardranks[i], samecards.length );
    //     }
    // }

    // rewritten by Claude.ai
    for ( let card of cardRanks ) 
    {
        if ( ! histogram.has(card) ) 
        {
            const frequency = cardRanks.filter( x => x === card ).length;
            histogram.set( card, frequency );
        }
    }

    // Converts histogram map to array of (key,value)-pairs using spread, 
    // then sort the pairs according to the value, and creates a new map 
    // out of this array
    // let sortedhistogram = new Map([...histogram]
    //                        .sort( ( [ , a_v], [ , b_v] ) => b_v - a_v ));

    // rewritten by Claude.ai
    let sortedHistogram = new Map(
        Array.from( histogram ).sort( ( a, b ) => b[1] - a[1] )
    );
                            
    return( sortedHistogram );
}

/* detects if the hand is a straight, see explanation of the
   algorithm in findhands() */
function isStraight( hand )
{
    let first = getRank( hand[0] );
    let last = getRank( hand[4] );
    
    // rank array A,K,...,5,4,3,2
    // A has index 0, 2 has index 13
    let firstint = 13 - rank.indexOf(first);
    let lastint = 13 - rank.indexOf(last);

    if( ( firstint - lastint ) === 4 )
    {
        return true;
    }
    else if( first === "A" )
    {
        // Check for "wheel"
        let second = getRank( hand[1] );
        if( second === "5" )
        {
            let secondint = 13 - rank.indexOf(second);
            // console.log( "wheel: "+secondint +" "+ lastint )

            if( ( secondint - lastint ) === 3 )
            {
                return true;
            }
        } 
    }   

}

/* detects if all the cards have the same suit / color */
function isFlush( hand )
{
    let a = hand.map( getSuit );
    // console.log(a);
    return ( a[0] == a[1] ) && ( a[1] == a[2] ) 
        && ( a[2] == a[3] ) && ( a[3] == a[4] );
}

/* detects winning hands and returns the enthusiastic name for it */
function findHands( hand )
{
    // console.log("findhands");
    /*   
        Histogram based algorithm found here:
        https://nsayer.blogspot.com/2007/07/algorithm-for-evaluating-poker-hands.html

        if the histogram contains..
        2 cards, frequency 4 and 1 => four of a kind
        2 cards, frequency 3 and 2 => full house
        3 cards, frequency 3, 1 and 1 => three of a kind
        3 cards, frequency 2, 2 and 1 => two pairs
        4 cards => one pair

        flush, just check the end character of every card.
    
        straights are checked by having a sorted list of cards,
        and subtracting rank of the lowest card from the highest,
        if the difference is 4, you have a straight

        special cases to detect if it's AKQJ10 or A5432 (broadway
        and wheel).

        if it's a straight and card 1 is A and card 2 is K, we have
        a royal flush if it's in the same suit(color).

        the wheel is detectected when card 1 is A, card 2 is 5 and 
        the difference between it and the lowest card is 3.   
    */

    let histogram = getSortedHistogram( hand );

    console.table( [...histogram] );


    // console.log("hl: "+histogram.size);
    let values = [...histogram.values()];

    let flush =  isFlush( hand );

    if( histogram.size === 2 )
    {  
        if( values[0] === 4 && values[1] === 1 )
        {
            return "FOUR OF A KIND!";
        }

        if( values[0] === 3 && values[1] === 2 )
        {
            return "FULL HOUSE!";
        }
       
       //console.log(kv);
    }
    else if( histogram.size === 3 )
    {
        if( values[0] === 3 && values[1] === 1 && values[2] === 1 )
        {
            return "THREE OF A KIND!";
        }
        
        if( values[0] === 2 && values[1] === 2 && values[2] === 1 )
        {
            return "TWO PAIRS!";
        }
    } 
    else if( histogram.size === 4 )
    {
        if( values[0] === 2 && values[1] === 1 && values[2] === 1 && values[3] === 1 )
        {
            return "PAIR!";
        }
    }
    else if( isStraight( hand ) )
    {
        // "Broadway"(AKQJ10) & "Wheel" (A5432)
        if( flush && getRank(hand[0]) === "A" ) 
        {
            if( getRank(hand[1]) === "K" )
            {
                return "ROYAL FLUSH!";
            }
        }
        return flush ? "STRAIGHT FLUSH!" : "STRAIGHT!";
    }
    else if( flush ) 
    {
        return "FLUSH!";
    }

    return "";
}

function showHand(sortedhand)
{
    let result = '';

    const card0 = '<img id="card0" src="cards/' + sortedhand[0] + '"/>';
    const card1 = '<img id="card1" src="cards/' + sortedhand[1] + '"/>';
    const card2 = '<img id="card2" src="cards/' + sortedhand[2] + '"/>';
    const card3 = '<img id="card3" src="cards/' + sortedhand[3] + '"/>';
    const card4 = '<img id="card4" src="cards/' + sortedhand[4] + '"/>';
    
    document.getElementById("card0").setAttribute("src", "cards/" + sortedhand[0] );
    document.getElementById("card1").setAttribute("src", "cards/" + sortedhand[1] );
    document.getElementById("card2").setAttribute("src", "cards/" + sortedhand[2] );
    document.getElementById("card3").setAttribute("src", "cards/" + sortedhand[3] );
    document.getElementById("card4").setAttribute("src", "cards/" + sortedhand[4] );

    setupClickHandlers();
}

function showResult(handstr)
{
    result = '';
    result += '<h2 id="handstr">';
    if( handstr !== "")
    {
        result += '-- '+handstr+' --';   
    }
    else
    {
        result += '&nbsp;'
    }
    result += '</h2>';

    document.getElementById("message").innerHTML = result;

}

function getFirstHand()
{   
    let handIndices = Array.from( getRandomSet( 5, 52 ) );

    // let fusk1 = [0,1,2,3,4];
    // let fusk2 = [0,1,2,4,5];
    // let fusk3 = [1,4,8,12,16];

    // create a hand, an array of five string out of the indices
    let hand = handIndices.map( index => deck[index] );

    console.log("getFirstHand");
    console.log(hand);

    // hand = fusk3;
    let sortedHand = hand.sort(compareCards);

    return sortedHand;
}

function showUserInfo(str)
{
    document.getElementById("userinfo").innerHTML = str; 
}

function FirstRound()
{
    let sortedHand = getFirstHand();

    let handStr = findHands( sortedHand );

    // special case for A5432, "wheel", looks nicer to put 
    // A last in the displayed hand
    if( handStr === "STRAIGHT!" || handStr === "STRAIGHT FLUSH!" )
    {
        //console.log("test for wheel");
        if( getRank( sortedHand[1] ) === "5" ) 
        {
        // re-sort, p
        //console.log("re-sort");
            let shifted = sortedHand.shift();
            sortedHand.push(shifted);
        }
    }

    // console.log("showhand");
    
    showHand(sortedHand);

    // console.log("card: "+card);
    // console.log( hand );

    showResult(handStr);

    showUserInfo("Round 1: Click on cards you want to discard!");

    // console.log("end first round");

    return sortedHand;

}  // End First Deal


function SecondRound( currentHand )
{
    console.log("2nd round begin");
    console.log(currentHand);

    keepCards = currentHand.filter( foldedCards );
    resetFoldedCards();

    // console.log("keepcards");
    // console.log(keepCards);

    let newCardIndices = Array.from( getRandomSet( 5-keepCards.length, gameState.remainingCards.size ) );
   
    const arrayFromSet = [...gameState.remainingCards];

    let newCards = newCardIndices.map( index => arrayFromSet[index] );
    newCards.forEach( card => gameState.remainingCards.delete(card) );

    newHand = keepCards.concat( newCards );
    newSortedHand = newHand.sort( compareCards );

    showHand( newSortedHand );

    let handStr = findHands( newSortedHand );

    // special case for A5432, "wheel", looks nicer to put 
    // A last in the displayed hand
    if( handStr === "STRAIGHT!" || handstr === "STRAIGHT FLUSH!" )
    {
        //console.log("test for wheel");
        if( getRank( newSortedHand[1] ) === "5" ) 
        {
        // re-sort, p
        //console.log("re-sort");
            let shifted = newSortedHand.shift();
            newSortedHand.push(shifted);
        }
    }

    showResult(handStr);  

    showUserInfo("Round 2: Click on cards you want to discard!");
    
    return newSortedHand;
}

function FinalHand( currentHand )
{
    console.log("final hand begin");
    console.log(currentHand); 

    keepCards = currentHand.filter( foldedCards );
    resetFoldedCards();

    //console.log("keepcards");
    //console.log(keepCards);

    let newCardIndices = Array.from( getRandomSet( 5-keepCards.length, gameState.remainingCards.size ) );
   
    const arrayFromSet = [...gameState.remainingCards];

    let newCards = newCardIndices.map( index => arrayFromSet[index] );
    // newCards.forEach( card => gameState.remainingCards.delete(card) );

    newHand = keepCards.concat( newCards );
    newSortedHand = newHand.sort( compareCards );

    showHand( newSortedHand );

    let handStr = findHands( newSortedHand );

    // special case for A5432, "wheel", looks nicer to put 
    // A last in the displayed hand
    if( handStr === "STRAIGHT!" || handstr === "STRAIGHT FLUSH!" )
    {
        //console.log("test for wheel");
        if( getRank( newSortedHand[1] ) === "5" ) 
        {
        // re-sort, p
        //console.log("re-sort");
            let shifted = newSortedHand.shift();
            newSortedHand.push(shifted);
        }
    }

    showResult(handStr);  

    showUserInfo("Press deal or fold to start another run!");

}

function foldedCards( card, index )
{
    element = document.getElementById("card"+index);
    if( element.getAttribute("class") === "folded")
    {
        return false;
    }
    return true;
}

function resetFoldedCards( )
{
    for( let i = 0; i < 5; i++ )
    {
        element = document.getElementById("card"+i);
        element.removeAttribute("class");
    }
}



function setupClickHandlers()
{
/*  
    document.getElementById("deal").onclick = function() { buttonClicked("deal") };
    document.getElementById("fold").onclick = function() { buttonClicked("fold") };
*/
    document.getElementById("card0").onclick = function() { cardClicked("card0") };
    document.getElementById("card1").onclick = function() { cardClicked("card1") };
    document.getElementById("card2").onclick = function() { cardClicked("card2") };
    document.getElementById("card3").onclick = function() { cardClicked("card3") };
    document.getElementById("card4").onclick = function() { cardClicked("card4") };
}

function cardClicked(str)
{
    // console.log("cardClicked");
    // console.log( gameState.gameRound );

    if( gameState.gameRound === 3 ) return;

    element = document.getElementById(str)

    if ( element.getAttribute("src") === "cards/B1") return;

    let keepattr = element.getAttribute("class");
    if( keepattr === null )
    {
        element.setAttribute("class", "folded"); 
    }
    else if( keepattr === "folded")
    {
        element.removeAttribute("class");
    }

 
    // console.log(element);
}

function gameStateMachine()
{

    if( gameState.gameRound === 0 )
    {
        gameState.currentHand = FirstRound();
        gameState.currentHand.forEach( card => gameState.remainingCards.delete( card ) );
        // console.log( gameState.remainingCards.size ); // 47 
        gameState.gameRound = 1;
    }
    else if( gameState.gameRound === 1 )
    {
        gameState.currentHand = SecondRound( gameState.currentHand );
        gameState.gameRound = 2;
    }
    else if( gameState.gameRound === 2 )
    {
        FinalHand( gameState.currentHand );
        // console.log("Nothing here");
        gameState.gameRound = 3;

    }  
    else  
    {
        location.href = location.href;        
    }
}

function buttonClicked(str) {
    // console.log(str);
    if( str==="fold" )
    {
        // quick and dirty
        location.href = location.href;
    }
    else if( str==="deal" ) 
    {
        gameStateMachine();  
    }
    
}

setupClickHandlers();


// console.log("end setup click");

// TODO 
/** disable DEAL button when 3rd round is over */
/** no folded card => pressing on deal should not work 
 * change the buttons 
 */
