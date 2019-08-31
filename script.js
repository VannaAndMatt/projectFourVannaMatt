//global App object
const myApp = {};

//Global Variables
myApp.author = null;
myApp.usedQuotes = [];
myApp.score = 0;
myApp.correctAnswers = 0;
myApp.questionMax = 10;
myApp.questionCount = 0;

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
      if (newQuote === item) {
        uniqueQuote = false;
      }
    });

    // Check length of quote because we don't wanna break container
    const tooLong = newQuote.split(" ").length;
    // console.log(tooLong);

    if (uniqueQuote && tooLong <= 28) {
      myApp.usedQuotes.push(newQuote);
      myApp.questionCount++;
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
    $(".guess")
      .attr("disabled", "disabled")
      .addClass("disabled");
    $(".next")
      .removeAttr("disabled")
      .removeClass("disabled");
    myApp.checkInput(selectedGuess);
  });
};

//function to check if guess is correct
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
  }
};

//display score dynamically function
myApp.displayScore = function() {
  $(".currentScore").html(myApp.score);
};

//function to call next question
myApp.nextQuestion = function() {
  $(".next").on("click", function() {
    myApp.getQuote();
    $('.guess')
      .removeAttr('disabled')
      .removeClass('disabled');
    $('.next')
      .attr('disabled', 'disabled')
      .addClass('disabled');
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
  });
};

// end game function
myApp.endGame = function() {
  $(".correctAnswers").text(
    `You got ${myApp.correctAnswers}/${myApp.questionMax} questions correct!`
  );
  $(".content").hide(1000, "swing");
  $(".results").show(1000, "swing");
  $(".playAgain").removeClass("hidden");
  $(".next").addClass("hidden");
};

// setup function
myApp.setup = function() {
  $(".content").show();
  $(".results").hide();
  $(".guess")
    .removeAttr("disabled")
    .removeClass("disabled");
  $(".guess")
    .children("span")
    .removeClass("subtractScore")
    .removeClass("addScore")
    .text("");
  $(".next")
    .attr("disabled", "disabled")
    .removeClass("hidden")
    .addClass("disabled");
  $(".playAgain").addClass("hidden");
  myApp.score = 0;
  myApp.usedQuotes = [];
  myApp.displayScore();
  myApp.correctAnswers = 0;
  myApp.questionCount = 0;
};

// play again function
myApp.playAgain = function() {
  $(".playAgain").on("click", function() {
    myApp.setup();
    myApp.getQuote();
  });
};

//init function
myApp.init = function() {
  myApp.setup();
  myApp.getQuote();
  myApp.userInput();
  myApp.nextQuestion();
  myApp.playAgain();
};

//document ready
$(function() {
  myApp.init();
});
