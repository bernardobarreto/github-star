function clippedRepos(){
    var repos = JSON.parse(localStorage.getItem('repos')) || {};
    return repos;
}


function handleButtonFunction(){

    var repos = clippedRepos();

    var repoInfo = repoInfos_func();

    if (repoInfo.name in repos) {
        return removeRepo;
    } else {
        return addRepo;
    }
}


function repoInfos_func(){

    var repoInfos = {};

    repoInfos.URL = $('[rel=alternate]')[0].getAttribute('href')
        .replace('https://github.com/', '')
        .replace('/commits/master.atom', '');

    repoInfos.owner = repoInfos.URL.replace(new RegExp("/.*"), '');

    repoInfos.name = repoInfos.URL.replace(new RegExp(".*/"), '');

    return repoInfos;

}


function removeRepo(){

    var repoInfo = repoInfos_func();

    var repos = clippedRepos();

    delete repos[repoInfo.name];

    localStorage.setItem('repos', JSON.stringify(repos));

}


function addRepo() {

    var repos = clippedRepos();

    var repoInfo = repoInfos_func();

    // TODO: This way I can't have more than one repo with the same name, fix it!
    repos[repoInfo.name] = repoInfo.owner;

    // Add to localStorage
    localStorage.setItem('repos', JSON.stringify(repos));
}


function addClipButton() {

    var repoInfo = repoInfos_func();

    var job = handleButtonFunction(repoInfo);

    var button = $('<li class="js-toggler-container">').append('<a href="" class="minibutton" id="clip_button">');
    button.children('a').text('Clip!').click(function () {
        job(repoInfo)
    });

    $('.pagehead-actions').append(button)

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

            var repoName = key;
            var repoOwner = getRepos[key];

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

function handleURLS() {

    var url = window.location.href

    if (url == "https://github.com/" || url == "https://github.com/dashboard/yours") {
        createClipPanel();
        fillPanel();

    } else if ($('.watch-button').length > 0) {
        addClipButton();
    }
}

handleURLS()
