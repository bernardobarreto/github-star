$(document).ready(function(){
    createClipPanel();
    fillPanel();
    $('#clipped_repos').show()
});


function createClipPanel(){

    var Panel = $('<div class="repos" id="clipped_repos">').hide()

    Panel.append('<div class="top-bar">')
    Panel.children('.top-bar').append('<h2> Clipped Repositories </h2>')

    Panel.append('<ul class="repo_list" id="clipped_repos_listing">')

    Panel.append('<div class="bottom-bar">');
    Panel.children('.bottom-bar').append('<a href="#" class="show-more" id="inline_clipped_repos">')

    $('div[id=dashboard]').append(Panel);
}


function fillPanel (){

    var getRepos = JSON.parse(localStorage.getItem('repos'))

    for (key in getRepos){

        var repoName = key;
        var repoOwner = getRepos[key];

        var li = $('<li class="public source">').append('<a>');
        li.children('a').attr({'href': '/' + repoOwner + '/' + repoName})
            .append('<span class="owner">')
            .append('/')
            .append('<span class="repo">');

        li.children('a').children('.owner').text(repoOwner);
        li.children('a').children('.repo').text(repoName);

        $('#clipped_repos_listing').append(li);


    }
}


function addRepo(repoInfo){

    var repoOwner = repoInfo.replace(new RegExp("/.*"),'');

    var repoName = repoInfo.replace(new RegExp(".*/"), '');

    var repos = JSON.parse(localStorage.getItem('repos')) || {};

    // TODO: This way I can't have more than one repo with the same name, fix it!
    repos[repoName] = repoOwner;

    // Add to localStorage
    localStorage.setItem('repos', JSON.stringify(repos));
}


function addClipButton(){

    var repoURL = $('[rel=alternate]')[0].getAttribute('href')
                    .replace('https://github.com/', '')
                    .replace('/commits/master.atom', '');

    var button = $('<li class="js-toggler-container">')
        .append('<a href="#" class="minibutton mousedown">');
        button.children('a').text('Clip!')
        .click(addRepo(repoURL));

    $('.pagehead-actions').append(button)

}
