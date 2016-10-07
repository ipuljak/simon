$(document).ready(function() {

  // Initial bools
  var on = false;
  var strict = false;
  var lock = true;
  var userPushed = false;

  // Game object
  var game = {};
  game.init = function() {
    this.play;
    this.lock;
    this.limit = 10;
    this.index = 1;
    this.curPattern = 0;
    this.userInd = 0;
    this.userSelect;
    this.pattern = generateRandom();
    this.done = false;
  };

  // Corners and lights
  var lights = {
    "#topLeft": "green-light",
    "#topRight": "red-light",
    "#bottomLeft": "yellow-light",
    "#bottomRight": "blue-light"
  };

  var corners = ["#topLeft", "#topRight", "#bottomLeft", "#bottomRight"];
  var lightOns = ['green-light', 'red-light', 'yellow-light', 'blue-light'];

  // Sounds
  var green = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
  var red = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
  var yellow = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
  var blue = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");

  var sounds = [green, red, yellow, blue];

  // On switch
  $("#onSwitch").on("click", function() {
    toggleOn();
  });

  // Start button
  $("#start").on("click", function() {
    if (on) {
      startGame();
    }
  });

  // Strict button
  $("#strict").on("click", function() {
    if (on) {
      toggleStrict();
    }
  });

  // Corner mousedown
  $(".corner").on("mousedown", function() {
    if (!lock) {
      $(this).toggleClass(lights["#" + this.id]);
      sounds[corners.indexOf("#" + this.id)].play();

      game.userSelect = "#" + this.id;
      userPushed = true;
    }
  });

  // Body mouseup
  $("body").on("mouseup", function() {
    if (!lock && userPushed) {
      setTimeout(lightsOff, 500);
      userPushed = false;
      pushed();
    }
  });

  // Shut off all of the lights
  function lightsOff() {
    for (var i = 0; i < lightOns.length; i++) {
      $(".corner").each(function() {
        $(this).removeClass(lightOns[i]);
      });
    }
  }

  // Turn on all of the lights
  function lightsOn() {
    for (var i = 0; i < corners.length; i++) {
      $(corners[i]).addClass(lightOns[i]);
    }
  }

  // Kill all of the timers and lights, and set the locks
  function kill() {
    lightsOff();
    lock = true;
    clearInterval(game.play);
    clearTimeout(game.lock);
    $(".congrats").addClass("hidden");
    $("#counterText").text("--");
    $('.corner').each(function() {
      $(this).removeClass("clickable");
    });
  }

  // Toggle the strict function
  function toggleStrict() {
    strict = !strict;
    $("#strictLight").toggleClass("onLight");
  }

  // Turn the game on/off
  function toggleOn() {
    if (on) {
      if (strict) {
        toggleStrict();
      }

      kill();
      $("#counter").css("color", "#B22020");
      $('#onSwitch').prop('checked', false);

    } else {
      $("#counter").css("color", "#F24421");
      $('#onSwitch').prop('checked', true);
    }

    on = !on;
  }

  // Start a new game
  function startGame() {
    kill();
    game.init();
    sequence();
  }

  // Generate a random sequence pattern
  function generateRandom() {
    var pattern = [];
    for (var i = 0; i < 20; i++) {
      pattern.push(Math.floor(Math.random() * 4));
    }

    return pattern;
  }

  // Play the current game sequence
  function sequence() {
    $('.corner').each(function() {
      $(this).removeClass("clickable");
    });

    $("#counterText").text(game.index);
    lock = true;
    game.curPattern = 0;
    game.play = setInterval(function() {
      play();
      if (game.curPattern + 1 === game.index) {
        game.curPattern = 0;
        clearInterval(game.play);
      }
      game.curPattern++;
    }, 1200);

    game.userInd = 0;
    game.lock = setTimeout(gameLock, 1200 * (game.index + 1));
  }

  // Play the current light in the pattern
  function play() {
    var index = game.pattern[game.curPattern];
    var corner = corners[index];
    var light = lights[corner];

    $(corner).toggleClass(light);
    sounds[index].play();

    setTimeout(function() {
      $(corner).toggleClass(light);
    }, 1000);
  }

  // Unlock the game for the user
  function gameLock() {
    lock = false;

    $('.corner').each(function() {
      $(this).addClass("clickable");
    });
  }

  // User pushed a corner down
  function pushed() {
    var index = game.pattern[game.userInd];

    // if the user guessed the current option correctly
    if (corners[index] === game.userSelect) {
      game.userInd++;

      // if the user got the sequence correctly
      if (game.userInd === game.index) {

        // if the game is at the last stage, end and celebrate
        if (game.index === game.limit) {
          lock = true;
          game.done = true;
          clearTimeout(lightsOff);
          setTimeout(lightsOn, 501);
          $("#counterText").text(":)");
          $(".congrats").removeClass("hidden");
          setTimeout(startGame, 5000);
          // flash all

          // if it's not at the last stage, raise the current index by one
        } else {
          game.index++;
          sequence();
        }
      }

      // user guessed incorrectly, replay sequence
    } else {
      $("#counterText").text("!!!");
      if (strict) {
        setTimeout(startGame, 3000);
      } else {
        setTimeout(sequence, 1000);
      }
    }
  }
});