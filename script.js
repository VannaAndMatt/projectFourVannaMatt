//global App object
const myApp = {};

//Global Variables
myApp.author = null;
myApp.score = 0;
myApp.usedQuotes = [];

//function to get Kanye, returns a promise
myApp.getKanye = function() {
  return $.ajax({
    url: "https://api.kanye.rest",
    method: "GET",
    dataType: "json"
  });
};

//function to get Trump, returns a promise
myApp.getTrump = function() {
  //using hackeryou proxy due to CORS error
  return $.ajax({
    url: "http://proxy.hackeryou.com",
    method: "GET",
    dataType: "json",
    data: {
      reqUrl: "https://api.tronalddump.io/random/quote",
      xmlToJSON: false,
      useCache: false
    }
  });
};

//function to pick between Kanye and Trump
myApp.getQuote = function() {
  const author = ["kanye", "trump"];
  // Randomly select between Kanye and Trump
  myApp.author = author[Math.floor(Math.random() * 2)];
  myApp.getPromise();
}; //end of getQuote

// function to get promises by AJAX calls
myApp.getPromise = function() {
  let newPromise = null;
  if (myApp.author === "kanye") {
    newPromise = myApp.getKanye();
  } else {
    newPromise = myApp.getTrump();
  }
  myApp.evalPromise(newPromise);
};

// function to evaluate promise
myApp.evalPromise = function(promise) {
  $.when(promise).then(newQuoteObj => {
    // Promise was fullfilled so let's populate our newQuote
    if (myApp.author === "kanye") {
      newQuote = newQuoteObj.quote;
    } else {
      newQuote = newQuoteObj.value;
    }

    let uniqueQuote = true;
    myApp.usedQuotes.forEach(function(item) {
      if (newQuote === myApp.usedQuotes[item]) {
        uniqueQuote = false;
      }
    });

    if (uniqueQuote) {
      myApp.usedQuotes.push(newQuote);
      myApp.displayQuote(newQuote);
    } else {
      myApp.getPromise();
    }
  }); // end of .then()
}; // end of evalPromise()

//Dynamically add quote to html function
myApp.displayQuote = function(fakeNews) {
  $("h3").html(`${fakeNews}`);
};

//function to map input to result function
myApp.userInput = function() {
  $(".guess").on("click", function() {
    const selectedGuess = $(this).attr("id");
    $(".guess").attr('disabled', 'disabled');
    myApp.checkInput(selectedGuess);
  });
};

//function to check if guess is correct
myApp.checkInput = function(selectedGuess) {
  if (selectedGuess === myApp.author) {
    myApp.score += 10;
  }
  console.log(myApp.score);
  myApp.displayScore();
};

//display score dynamically function
myApp.displayScore = function() {
  $(".currentScore").html(myApp.score);
};

//init function
myApp.init = function() {
  myApp.getQuote();
  myApp.userInput();
};

//document ready
$(function() {
  myApp.init();
});
