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


function getRandomInt( max ) {
    return Math.floor(Math.random() * max);
}

/*
   used to return a set of 5 unique numbers
   between 0 and 51
*/
let getRandomSet = function( count, max )
{
    let numbers = new Set();

    while( numbers.size < count )
    {
       numbers.add( getRandomInt( max ) );
    }

    return numbers;
};

/* remove the last character in card string (i.e "5S", "10C" .. ) to get rank */
function getrank( card )
{
  return deck[card].slice( 0, -1 );
}

/* lookup table used to decide if a card is higher than another */
const rank = ["A","K","Q","J","10","9","8","7","6","5","4","3","2"];


/* compare two card deck entries */
function compare( a, b )
{
    // deck[a] and deck[b] contains
    // a string made up of rank followed by suit (S,C,H,D) 
    // removing suit to compare it by looking up the position
    // of the card's rank in the rank array 
    let ar = getrank(a ); 
    let br = getrank( b);

    return rank.indexOf(ar)-rank.indexOf(br);
}

/* last character in card is the suit/color */
function getsuit( card )
{
    // last character in string
    return deck[card].at(-1);
}

/* a sorted histogram is returned from the hand */
function getsortedhistogram( hand )
{
    let cardranks = hand.map( getrank );
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
    for ( let card of cardranks ) 
    {
        if ( ! histogram.has(card) ) 
        {
            const frequency = cardranks.filter( x => x === card ).length;
            histogram.set( card, frequency );
        }
    }

    // Converts histogram map to array of (key,value)-pairs using spread, 
    // then sort the pairs according to the value, and creates a new map 
    // out of this array
    // let sortedhistogram = new Map([...histogram]
    //                        .sort( ( [ , a_v], [ , b_v] ) => b_v - a_v ));

    // rewritten by Claude.ai
    let sortedhistogram = new Map(
        Array.from( histogram ).sort( ( a, b ) => b[1] - a[1] )
    );
                            
    return( sortedhistogram );
}

/* detects if the hand is a straight, see explanation of the
   algorithm in findhands() */
function is_straight( hand )
{
    let first = getrank( hand[0] );
    let last = getrank( hand[4] );
    
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
        let second = getrank( hand[1] );
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
function is_flush( hand )
{
    let a = hand.map( getsuit );
    // console.log(a);
    return ( a[0] == a[1] ) && ( a[1] == a[2] ) 
        && ( a[2] == a[3] ) && ( a[3] == a[4] );
}

/* detects winning hands and returns the enthusiastic name for it */
function findhands( hand )
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

    let histogram = getsortedhistogram( hand );

    console.table( [...histogram] );


    console.log("hl: "+histogram.size);
    let values = [...histogram.values()];

    let flush =  is_flush( hand );

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
    else if( is_straight( hand ) )
    {
        // "Broadway"(AKQJ10) & "Wheel" (A5432)
        if( flush && getrank(hand[0]) === "A" ) 
        {
            if( getrank(hand[1]) === "K" )
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

let hand = Array.from( getRandomSet( 5, 52 ) );

let fusk1 = [0,1,2,3,4];
let fusk2 = [0,1,2,4,5];
let fusk3 = [1,4,8,12,16];

// hand = fusk3;
let sortedhand = hand.sort(compare);

let handstr = findhands( sortedhand );

// special case for A5432, "wheel", looks nicer to put 
// A last in the displayed hand
if( handstr === "STRAIGHT!" || handstr === "STRAIGHT FLUSH!" )
{
    //console.log("test for wheel");
    if( getrank( sortedhand[1] ) === "5" ) 
    {
        // re-sort, p
        //console.log("re-sort");
        let shifted = sortedhand.shift();
        sortedhand.push(shifted);
    }
}

// console.log("card: "+card);
// console.log( hand );

let result = '';

result += '<h1>&nbsp;-- poker hello. --</h1>';
result += '<h3>&nbsp; press reload for new hand.</h3><br>';
// let fusk = [4,8,12,16,0]; // 2C,3C,4C,5C,AC
// sorted = [0,4,8,12,16];

result += '<img src="cards/' + deck[ sortedhand[0] ] + '"/>';
result += '<img src="cards/' + deck[ sortedhand[1] ] + '"/>';
result += '<img src="cards/' + deck[ sortedhand[2] ] + '"/>';
result += '<img src="cards/' + deck[ sortedhand[3] ] + '"/>';
result += '<img src="cards/' + deck[ sortedhand[4] ] + '"/>';
result += '</p>';

result += '<h2>';
if( handstr !== "")
{
    result += '-- '+handstr+' --';   
}
else
{
    result += '&nbsp;'
}
result += '</h2>';

// console.log(result);

document.getElementById("main_body").innerHTML = result;


