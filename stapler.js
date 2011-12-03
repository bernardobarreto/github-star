function repoInfos(){

    var repoInfos = {};

    repoInfos.URL = $('[rel=alternate]')[0].getAttribute('href')
        .replace('https://github.com/', '')
        .replace('/commits/master.atom', '');

    repoInfos.owner = repoInfos.URL.replace(new RegExp("/.*"), '');

    repoInfos.name = repoInfos.URL.replace(new RegExp(".*/"), '');

    return repoInfos;

}


function addRepo(infos) {

    var repoInfo = infos()

    var repos = JSON.parse(localStorage.getItem('repos')) || {};

    // TODO: This way I can't have more than one repo with the same name, fix it!
    repos[repoInfo.name] = repoInfo.owner;

    // Add to localStorage
    localStorage.setItem('repos', JSON.stringify(repos));
}


function addClipButton() {

    var button = $('<li class="js-toggler-container">').append('<a href="#" class="minibutton" id="clip_button">');
    button.children('a').text('Clip!').click(function () {
        addRepo(repoInfos)
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
    Panel.children('.bottom-bar').append('<a href="#" class="show-more" id="inline_clipped_repos">')

    $('div[id=dashboard]').prepend(Panel);
}


function fillPanel() {

    var getRepos = JSON.parse(localStorage.getItem('repos'))

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
}


function handleURLS() {

    var url = window.location.href

    if (url == "https://github.com/" || url == "https://github.com/dashboard/yours") {
        createClipPanel();
        fillPanel();
        $('#clipped_repos').show();

    } else if ($('.watch-button').length > 0) {
        addClipButton();
    }
}

handleURLS()
