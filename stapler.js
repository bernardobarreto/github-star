function clippedRepos(){
    var repos = JSON.parse(localStorage.getItem('repos')) || {};
    return repos;
}


function handleButtonFunction(){

    var repos = clippedRepos();

    var repoInfo = repoInfosFunc();

    if (repoInfo.repo in repos) {
        return removeRepo;
    } else {
        return addRepo;
    }
}


function repoInfosFunc(){

    var repoInfos = {};

    var url = $('[rel=alternate]')[0].getAttribute('href')
        .replace('https://github.com/', '')
        .replace('/commits/master.atom', '');

    repoInfos.repo = url;

    return repoInfos;
}


function removeRepo(){

    var repoInfo = repoInfosFunc();

    var repos = clippedRepos();

    delete repos[repoInfo.repo];

    localStorage.setItem('repos', JSON.stringify(repos));
}


function addRepo() {

    var repos = clippedRepos();

    var repoInfo = repoInfosFunc();

    repos[repoInfo.repo] = repoInfo.repo;

    // Add to localStorage
    localStorage.setItem('repos', JSON.stringify(repos));
}


function addClipButton() {

    var repoInfo = repoInfosFunc();

    var job = handleButtonFunction(repoInfo);

    var button_name = job === addRepo ? 'Clip!' : 'Unclip!';

    var button = $('<li class="js-toggler-container">')
        .append('<a href="" class="minibutton" id="clip_button">')
        .children('a').append('<span>' + button_name + '</span>').click(function () {
            job(repoInfo)
        });

    $('.pagehead-actions').append(button);
}


//######################################### DASHBOARD #############################################

function createClipPanel() {

    var Panel = $('<div class="repos" id="clipped_repos">').hide()

    Panel.append('<div class="top-bar">')
    Panel.children('.top-bar').append('<h2> Clipped Repositories </h2>')

    Panel.append('<ul class="repo_list" id="clipped_repos_listing">')

    $('div[id=dashboard]').prepend(Panel);
}


function addBottomBar() {

    var button = $('<div class="bottom-bar">')
        .append('<a href="javascript: void(0)" class="show-more" id="inline_clipped_repos"> Show all repositories.. </a>')
        .click(function() {
            $('#clipped_repos_listing > li').show();
            $('#inline_clipped_repos').hide();
       });
    $('#clipped_repos').append(button);
}


function fillPanel() {

    var repos = JSON.stringify(clippedRepos());

    var getRepos = JSON.parse(localStorage.getItem('repos'));

    if (getRepos){

        var clipped_repos_count = 0;

        for (key in getRepos) {

            clipped_repos_count++;

            var repoName = key.replace(new RegExp(".*/"), '');
            var repoOwner = key.replace(new RegExp("/.*"), '');

            var li = $('<li class="public source">').append('<a>');
            li.children('a').attr({
                'href': '/' + repoOwner + '/' + repoName
            })
                .append('<span class="owner">')
                .append('/')
                .append('<span class="repo">');

            li.children('a').children('.owner').text(repoOwner);
            li.children('a').children('.repo').text(repoName);

            clipped_repos_count > 10 ? li.hide() : li.show()

            $('#clipped_repos_listing').append(li);
        }

        repos !== "{}" && $('#clipped_repos').show();

    if (clipped_repos_count > 10){
        addBottomBar();
    }

    }
}

(function main() {

    var url = window.location.href

    if (url == "https://github.com/" || url == "https://github.com/dashboard/yours") {
        createClipPanel();
        fillPanel();

    } else if ($('.watch-button').length > 0) {
        addClipButton();
    }
})();
