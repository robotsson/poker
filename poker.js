import deck from "./deck.js";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let getRandomSet = function( nbr, max, uniq )
{
    let nbrs = uniq ? new Set() : [];
    let add = e => uniq ? nbrs.add(e) : nbrs.push(e);
    let l = () => uniq ? nbrs.size : nbrs.length;

    while( l() < nbr )
    {
        add( getRandomInt(max) );
    }

    return nbrs;
};

function hand(cards)
{

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

    Tillägg: AKQJ10 royal straight
    Tillägg: AKQJ10 i samma färg royal straight flush
    
    If we haven't matched the hand by now, it's High Card.
    */
}

let cards = Array.from( getRandomSet(5, 52, true));

hand(cards);

// console.log("card: "+card);
console.log(cards);

let result = "<h1>poker hello.</h1>";
result += '<img src="cards/big/' + deck[ cards[0] ] + '"/>';
result += '<img src="cards/big/' + deck[ cards[1] ] + '"/>';
result += '<img src="cards/big/' + deck[ cards[2] ] + '"/>';
result += '<img src="cards/big/' + deck[ cards[3] ] + '"/>';
result += '<img src="cards/big/' + deck[ cards[4] ] + '"/>';

console.log(result);

document.getElementById("main_body").innerHTML = result;

console.log(cards);

// console.log( cards );

