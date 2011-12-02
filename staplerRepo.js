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
        .bind('click',addRepo(repoURL));

    $('.pagehead-actions').append(button)

}
