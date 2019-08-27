//global App object
const myApp = {};

//Global Variables
myApp.author = null;
myApp.score = 0;
myApp.usedQuotes = [];

//function to pick between Kanye and Trump
myApp.getQuote = function() {
  const author = ["Kanye", "Trump"];
  let runLoop = true;
  let newQuote = "";
  while (runLoop) {
    // console.log('hi in the while');
    myApp.author = author[Math.floor(Math.random() * 2)];
    // myApp.author = "Trump";
    console.log(myApp.author);
    if (myApp.author === "Kanye") {
      $.ajax({
        url: "https://api.kanye.rest",
        method: "GET",
        dataType: "json"
      }).then(function(result) {
        newQuote = result.quote;
        console.log(newQuote);
      });
    } else {
      //using hackeryou proxy due to CORS error
      $.ajax({
        url: "http://proxy.hackeryou.com",
        method: "GET",
        dataType: "json",
        data: {
          reqUrl: "https://api.tronalddump.io/random/quote",
          xmlToJSON: false,
          useCache: false
        }
      }).then(function(result) {
        newQuote = result.value;
        console.log(newQuote);
      });
    } //end of ajax calls
    let uniqueQuote = true;
    console.log('after if', newQuote);
    myApp.usedQuotes.forEach(function(item) {
      if (newQuote === myApp.usedQuotes[item]) {
        uniqueQuote = false;
      } 
    });
    if (uniqueQuote) {
      myApp.usedQuotes.push(newQuote)
      runLoop = false;
    }
  } // end of while loop
  // myApp.displayQuote(newQuote);
  console.log('new quote is:', newQuote);

}; //end of getQuote

//init function
myApp.init = function() {
  console.log("hello");
  myApp.getQuote();
  // myApp.userInput();
};

//document ready
$(function() {
  myApp.init();
});
