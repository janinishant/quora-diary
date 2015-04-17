//quoraDiary constructor.
var quoraDiary = function () {
  this.filteredFeeds = [];
  this.allCurrentDOMFeeds = $('.pagedlist_item');
  this.quoraBaseURL = "http://www.quora.com";
};

//add feeds of type answer only, not to question and profiles
quoraDiary.prototype.filter  = function () {
  var currentFeedLength = this.allCurrentDOMFeeds.length;

  var filteredFeedsCounter = 0;
  for (var i = 0; i < currentFeedLength; i++ ) {
    //put only answers
    if ($(this.allCurrentDOMFeeds[i]).find('>:first-child').hasClass('feed_type_answer')) {
      this.filteredFeeds[filteredFeedsCounter++] = this.allCurrentDOMFeeds[i];
    }
  }
};

//add the QD button to all feeds
quoraDiary.prototype.addQDButton = function () {
  var filteredFeedLength = this.filteredFeeds.length;

  for (var i = 0; i < filteredFeedLength; i++) {
    if ($(this.filteredFeeds[i]).find('div.qd-add-button.action_item').length > 0) continue;

    var questionLink = $(this.filteredFeeds[i]).find('a.question_link').attr('href');

    var authorLink = $(this.filteredFeeds[i]).find('div.author_info a:first-child').attr('href');
    var answerQuoraRelativeLink = questionLink+"/answer"+authorLink;
    var fullURL = this.quoraBaseURL + answerQuoraRelativeLink;
    var uniqueId = $(this.filteredFeeds[i]).attr('id');
    var qdButtonHTML = '<div id = '+uniqueId+' class="qd-add-button action_item" data-question='+questionLink+' data-answer-url = '+fullURL+'> <a href="#">QD- Read Later</a></div>';
    $(this.filteredFeeds[i]).find('.action_item.overflow').before(qdButtonHTML);
  }
};

quoraDiary.prototype.saveToLocalStorage = function(buttonDOM) {
    debugger;
};

$(document).ready(function(){

  var initQD  = function() {
    var qd = new quoraDiary();

    qd.filter();
    qd.addQDButton();
  };

  initQD();

  setInterval(function () {
    initQD();
  }, 3000);

  $(document).on('click', '.qd-add-button', function(event) {
      var qd_questions = localStorage.getItem('qd-questions');
      if (!qd_questions) {
        localStorage['qd-questions'] = [];
        qd_questions = [];
      }
      else {
        qd_questions = JSON.parse(qd_questions);
      }

      var targetQuestion = $(event.currentTarget);
      var questionText = targetQuestion.data('question').replace(/-/g," ").replace("/","");;
      var answerLink = targetQuestion.data('answer-url');
      qd_questions.push({question: questionText, answerLink: answerLink});

      localStorage['qd-questions'] = JSON.stringify(qd_questions);


      chrome.storage.sync.set({'qd-questions': JSON.stringify(qd_questions)});

      console.log(JSON.stringify(localStorage['qd-questions']));
  });
});