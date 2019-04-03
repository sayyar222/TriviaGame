$(document).ready(function(){
  
    // event listeners
    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click' , '.option', trivia.guessChecker);
    
  })
  
  var trivia = {
    // trivia properties
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId : '',
    // questions options and answers data
    questions: {
      q1: "", // enter questions between single quotes
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      q6: "",
      q7: ""
    },
    options: {
      q1: ['', '', '', ''],
      q2: ['', '', '', ''],
      q3: ['', '', '', ''],
      q4: ['', '', '', ''],
      q5: ['','','',''],
      q6: ['','','',''],
      q7: ['', '', '','']
    },
    answers: {
      q1: '',
      q2: '',
      q3: '',
      q4: '',
      q5: '',
      q6: '',
      q7: ''
    },
    
    //  to start game
    startGame: function(){
      // restarting  results
      trivia.currentSet = 0;
      trivia.correct = 0;
      trivia.incorrect = 0;
      trivia.unanswered = 0;
      clearInterval(trivia.timerId);
      
      // show game 
      $('#game').show();
      
      //  empty results
      $('#results').html('');
      
      // show timer
      $('#timer').text(trivia.timer);
      
      // take away start button
      $('#start').hide();
  
      $('#remaining-time').show();
      
      // ask 1st question
      trivia.nextQuestion();
      
    },
    //  to loop thru and display questions/options 
    nextQuestion : function(){
      
      // set timer to 20s per question
      trivia.timer = 10;
       $('#timer').removeClass('last-seconds');
      $('#timer').text(trivia.timer);
      
      // to prevent timer from going faster
      if(!trivia.timerOn){
        trivia.timerId = setInterval(trivia.timerRunning, 1000);
      }
      
      // gets all questions then indexes current questions
      var questionContent = Object.values(trivia.questions)[trivia.currentSet];
      $('#question').text(questionContent);
      
      // an array of all user options for the current question
      var questionOptions = Object.values(trivia.options)[trivia.currentSet];
      
      // creates all the guess options in the html
      $.each(questionOptions, function(index, key){
        $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
      })
      
    },
    // to decrement counter and count the unanswered if time runs out
    timerRunning : function(){
      // if timer still has time left and there are still questions left 
      if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
        $('#timer').text(trivia.timer);
        trivia.timer--;
          if(trivia.timer === 4){
            $('#timer').addClass('last-seconds');
          }
      }
      // time has run out -- increment unanswered -- this will run result
      else if(trivia.timer === -1){
        trivia.unanswered++;
        trivia.result = false;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
      }
      // if all  questions have been shown end game -- show results
      else if(trivia.currentSet === Object.keys(trivia.questions).length){
        
        // adds results of game (correct, incorrect, unanswered) to the page
        $('#results')
          .html('<h3>Thank you for playing!</h3>'+
          '<p>Correct: '+ trivia.correct +'</p>'+
          '<p>Incorrect: '+ trivia.incorrect +'</p>'+
          '<p>Unaswered: '+ trivia.unanswered +'</p>'+
          '<p>Please play again!</p>');
        
        // hide game section
        $('#game').hide();
        
        // show start button to start new game
        $('#start').show();
      }
      
    },
    // to evaluate the option clicked
    guessChecker : function() {
      
      // timer ID for gameResult setTimeout
      var resultId;
      
      // the answer to the current question being asked
      var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
      
      // if the text of the option picked matches the answer of the current question, increment correct
      if($(this).text() === currentAnswer){
        // turn button green for correct
        $(this).addClass('btn-success').removeClass('btn-info');
        
        trivia.correct++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Correct Answer!</h3>');
      }
      // else the user picked the wrong option, increment incorrect
      else{
        // turn button clicked red for incorrect
        $(this).addClass('btn-danger').removeClass('btn-info');
        
        trivia.incorrect++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Better luck next time! '+ currentAnswer +'</h3>');
      }
      
    },
    // method to remove previous question results and options
    guessResult : function(){
      
      // increment to next question set
      trivia.currentSet++;
      
      // remove the options and results
      $('.option').remove();
      $('#results h3').remove();
      
      // begin next question
      trivia.nextQuestion();
       
    }
  
  }