import deck from "./deck.js";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/*
   used to return a set of 5 unique numbers
   between 0 and 51
*/
let getRandomSet = function( nbr, max, uniq )
{
    let nbrs = uniq ? new Set() : [];
    let add = e => uniq ? nbrs.add( e ) : nbrs.push( e );
    let l = () => uniq ? nbrs.size : nbrs.length;

    while( l() < nbr )
    {
        add( getRandomInt( max ) );
    }

    return nbrs;
};

/* remove the last character in card string (i.e "5S", "10C" .. ) to get rank */
function getrank( card )
{
  return deck[card].slice( 0, -1 );
}

/* lookup table used to decide if a card is higher than another */
const rank = ["A","K","Q","J","10","9","8","7","6","5","4","3","2"];


/* compare two card deck entries */
function compare( a, b  )
{
    // deck[a] and deck[b] contains
    // a string made up of rank followed by suit (S,C,H,D) 
    // removing suit to compare it by looking up the position
    // of the card's rank in the rank array 
    let ar = getrank(a ); // deck[a].slice( 0, -1 );
    let br = getrank( b); // deck[b].slice( 0, -1 );

    return rank.indexOf(ar)-rank.indexOf(br);
}

function getsuit( card )
{
    // last character in string
    return deck[card].at(-1);
}


function getsortedhistogram( hand )
{
    let cardranks = hand.map( getrank );
    //console.log( cardranks );
    let histogram = new Map();

    for( let i = 0; i < cardranks.length; i++ )
    {
        let currentcard = cardranks[i];

        if( ! histogram.has( currentcard ) )
        { 
            let samecards = cardranks.filter( (x) => currentcard === x );
            histogram.set( cardranks[i], samecards.length );
        }
    }
    


    // Converts histogram map to array of (key,value)-pairs using spread, 
    // then sort the pairs according to the value, and creates a new map 
    // out of this array
    let sortedhistogram = new Map([...histogram]
                            .sort( ( [ , a_v], [ , b_v] ) => b_v - a_v ));
      
    return( sortedhistogram );
}

function is_straight( hand )
{
    let first = getrank( hand[0] );
    let last = getrank( hand[4] );
    
    let firstint = 13 -rank.indexOf(first);
    let lastint = 13 - rank.indexOf(last);

    if( ( firstint - lastint ) === 4 )
    {
        return true;
    }
    else if( first === "A" )
    {
        // Check for "wheel"
        let second = getrank( hand[1] );
        let secondint = 13 - rank.indexOf(second);

        // console.log( "wheel: "+secondint +" "+ lastint )

        if( ( secondint - lastint ) === 3 )
        {
            return true;
        }
    } 

}

function is_flush( hand )
{
    let a = hand.map( getsuit );
    // console.log(a);
    return ( a[0] == a[1] ) && ( a[1] == a[2] ) 
        && ( a[2] == a[3] ) && ( a[3] == a[4] );
}

function findhands( hand )
{
    // console.log("findhands");
    /*   
    Algorithm

    First take a histogram of the card ranks. 
    That is, for each rank in the hand, count how often it appears. 
    
    Sort the histogram by the count backwards (high values first).
    If the histogram counts are 4 and 1, then the hand is quads.
    
    If the histogram counts are 3 and a 2, then the hand is a boat.
    
    If the histogram counts are 3, 1 and 1, then the hand is a set.
    
    If the histogram counts are 2, 2 and 1, then the hand is two pair.
    
    If the histogram has 4 ranks in it, then the hand is one pair.
    
    Next, check to see if the hand is a flush. You do this by iterating 
    through the cards to see if the suit of a card is the same as its neighbor.
    If not, then the hand is not a flush. Don't return a result yet, 
    just note whether or not it's a flush.
    
    Next, check for straights. Do this by sorting the list of cards. 
    Then subtract the rank of the bottom card from the top card. 
    If you get 4, it's a straight. At this point, you must also check 
    either for the wheel or for broadway, depending on whether your sort 
    puts the ace at the top or bottom. I would expect most folks to put 
    the ace at the top of the sort, since it is usually a high card. 
    So to check for the wheel, check to see if the top card is an ace 
    and the 2nd to top card is a 5. If so, then it is the wheel.
    
    If the hand is a straight and a flush, it's a straight-flush. 
    Otherwise if it's one or the other, you can return that.

    
    If we haven't matched the hand by now, it's High Card.
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

let hand = Array.from( getRandomSet( 5, 52, true ) );

let fusk1 = [0,1,2,3,4];
let fusk2 = [0,1,2,4,5];
let fusk3 = [1,4,8,12,16];

// hand = fusk3;
let sortedhand = hand.sort(compare);

let handstr = findhands( sortedhand );

// special case for A5432, "wheel", looks nicer to put 
// A last
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

let result = "<h1>&nbsp;-- poker hello.</h1>";

// let fusk = [4,8,12,16,0]; // 2C,3C,4C,5C,AC
// sorted = [0,4,8,12,16];

result += '<img src="cards/' + deck[ sortedhand[0] ] + '"/>';
result += '<img src="cards/' + deck[ sortedhand[1] ] + '"/>';
result += '<img src="cards/' + deck[ sortedhand[2] ] + '"/>';
result += '<img src="cards/' + deck[ sortedhand[3] ] + '"/>';
result += '<img src="cards/' + deck[ sortedhand[4] ] + '"/>';
result += '</p>';

if( handstr !== "")
{
    result += '<h2>&nbsp;&nbsp;----------- '+handstr+' -----------</h2>'
}

// console.log( "isfl2: " + isflush( fusk ));

// console.log(result);

document.getElementById("main_body").innerHTML = result;

// console.log( hand );

// console.log( cards );

