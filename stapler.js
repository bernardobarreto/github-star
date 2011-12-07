function clippedRepos(){
    var repos = JSON.parse(localStorage.getItem('repos')) || {};
    return repos;
}


function handleButtonFunction(){

    var repos = clippedRepos();

    var repoInfo = repoInfos_func();

    if (repoInfo.repo in repos) {
        return removeRepo;
    } else {
        return addRepo;
    }
}


function repoInfos_func(){

    var repoInfos = {};

    var url = $('[rel=alternate]')[0].getAttribute('href')
        .replace('https://github.com/', '')
        .replace('/commits/master.atom', '');

    repoInfos.repo = url;

    return repoInfos;
}


function removeRepo(){

    var repoInfo = repoInfos_func();

    var repos = clippedRepos();

    delete repos[repoInfo.repo];

    localStorage.setItem('repos', JSON.stringify(repos));
}


function addRepo() {

    var repos = clippedRepos();

    var repoInfo = repoInfos_func();

    // TODO: This way I can't have more than one repo with the same name, fix it!
    repos[repoInfo.repo] = repoInfo.repo;

    // Add to localStorage
    localStorage.setItem('repos', JSON.stringify(repos));
}


function addClipButton() {

    var repoInfo = repoInfos_func();

    var job = handleButtonFunction(repoInfo);

    var button_name = undefined;
    job === addRepo ? button_name = 'Clip!' : button_name = 'Unclip!';

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

    Panel.append('<div class="bottom-bar">');
    Panel.children('.bottom-bar').append('<a href="" class="show-more" id="inline_clipped_repos">')

    $('div[id=dashboard]').prepend(Panel);
}


function fillPanel() {

    var repos = JSON.stringify(clippedRepos());

    var getRepos = JSON.parse(localStorage.getItem('repos'));

    if (getRepos){
        for (key in getRepos) {

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

            $('#clipped_repos_listing').append(li);
        }

        repos !== "{}" && $('#clipped_repos').show();
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
