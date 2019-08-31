//===========================
// Namespacing
//===========================
const myApp = {};
myApp.author = null;
myApp.usedQuotes = [];
myApp.score = 0;
myApp.correctAnswers = 0;
myApp.questionMax = 10;
myApp.questionCount = 0;

//===========================
// Init Function
//===========================
myApp.init = function() {
  myApp.setup();
  myApp.getQuote();
  myApp.userInput();
  myApp.playAgain();
};

//===========================
// Setup Function
//===========================
myApp.setup = function() {
  $(".content").show();
  $(".results").hide();
  $(".guess")
    .children("span")
    .removeClass("subtractScore")
    .removeClass("addScore")
    .text("");
  $(".playAgain").addClass("hidden");
  myApp.usedQuotes = [];
  myApp.score = 0;
  myApp.displayScore();
  myApp.correctAnswers = 0;
  myApp.questionCount = 0;
};

//===========================
// Get Quote Function
//===========================
myApp.getQuote = function() {
  const author = ["kanye", "trump"];
  // Randomly select between Kanye and Trump
  myApp.author = author[Math.floor(Math.random() * 2)];
  myApp.getPromise();
}; //end of getQuote

//===========================
// Get Promise Function
//===========================
myApp.getPromise = function() {
  let newPromise = null;
  if (myApp.author === "kanye") {
    newPromise = myApp.getKanye();
  } else {
    newPromise = myApp.getTrump();
  }
  myApp.evalPromise(newPromise);
};

//===========================
// Kanye API Call
//===========================
myApp.getKanye = function() {
  return $.ajax({
    url: "https://api.kanye.rest",
    method: "GET",
    dataType: "json"
  });
};

//===========================
// Trump API Call
//===========================
myApp.getTrump = function() {
  //using hackeryou proxy due to CORS error
  return $.ajax({
    url: "https://proxy.hackeryou.com",
    method: "GET",
    dataType: "json",
    data: {
      reqUrl: "https://api.tronalddump.io/random/quote",
      xmlToJSON: false,
      useCache: false
    }
  });
};

//===========================
// Evaluate Promise Function
//===========================
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
      if (newQuote === item) {
        uniqueQuote = false;
      }
    });

    // Check length of quote because we don't wanna break container
    const tooLong = newQuote.split(" ").length;

    if (uniqueQuote && tooLong <= 28) {
      myApp.usedQuotes.push(newQuote);
      myApp.questionCount++;
      myApp.displayQuote(newQuote);
    } else {
      myApp.getPromise();
    }
  });
};

//===========================
// Display Quote Function
//===========================
myApp.displayQuote = function(fakeNews) {
  $("h3").html(`${fakeNews}`);
};

//===========================
// User Input Function
//===========================
myApp.userInput = function() {
  $(".guess").on("click", function() {
    const selectedGuess = $(this).attr("id");
    myApp.checkInput(selectedGuess);

    // Button Debouncing
    $(".guess").attr("disabled", "disabled")
    setTimeout(function(){ 
      $(".guess").removeAttr("disabled")
    }, 1000);
  });
};

//===========================
// Check Input Function
//===========================
myApp.checkInput = function(selectedGuess) {
  if (selectedGuess === myApp.author) {
    myApp.score += 10;
    myApp.correctAnswers++;
    $(`.${selectedGuess}`)
      .children('span')
      .addClass('addScore')
      .text('+10');
    $(`.${selectedGuess}Image`)
      .children()
      .addClass('animated bounce');
  } else {
    myApp.score -= 10;
    $(`.${selectedGuess}`)
      .children('span')
      .addClass('subtractScore')
      .text('-10');
    $(`.${selectedGuess}Image`)
      .children()
      .addClass('animated shake');
  }

  //If statement to end game once max questions are reached
  myApp.displayScore();
  if (myApp.questionCount === myApp.questionMax) {
    myApp.endGame();
  } else {
    myApp.getQuote();
  }
  setTimeout(function(){ 
    $('.guess')
      .children('span')
      .removeClass('subtractScore')
      .removeClass('addScore')
      .text('');
    $('.headShots')
      .children()
      .removeClass('animated')
      .removeClass('bounce')
      .removeClass('shake');
  }, 1500);
};

//===========================
// Display Score Function
//===========================
myApp.displayScore = function() {
  $(".currentScore").html(myApp.score);
};

//===========================
// End Game Function
//===========================
myApp.endGame = function() {
  $(".correctAnswers").text(
    `You got ${myApp.correctAnswers}/${myApp.questionMax} questions correct!`
  );
  $(".content").hide(1000, "swing");
  $(".results").show(1000, "swing");
  $(".playAgain").removeClass("hidden");
};

//===========================
// Let's Play Again
//===========================
myApp.playAgain = function() {
  $(".playAgain").on("click", function() {
    myApp.setup();
    myApp.getQuote();
  });
};

//===========================
// Document Ready!
//===========================
$(function() {
  myApp.init();
});
