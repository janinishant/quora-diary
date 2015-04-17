var QDPopup = function() {

};

QDPopup.prototype.render = function(questions) {
    var html = "";
    for (var i = 0; i < questions.length; i++) {
        html += "<div class='container'>" +
        "<div class=''><input type='checkbox' id='qd-quest'>" +
        "<a target='_blank' href='"+questions[i].answerLink+"'>"+questions[i].question+"</a>" +
        "<hr></div></div>";
    }
    $('#results').html(html);
};

chrome.storage.sync.get('qd-questions', function(response) {
    var pop = new QDPopup();
    pop.render(JSON.parse(response['qd-questions']));
});

$(document).ready(function(){
    $('body').on('click', 'a', function(){
        chrome.tabs.create({url: $(this).attr('href')});
        return false;
    });
});