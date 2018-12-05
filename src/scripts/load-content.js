function loadJSON(url, callback) {   
    let xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);  
};

let dataObject = {};
let selectedIdx = -1;

function loadProjectContent(callback) {
    var content = dataObject[selectedIdx];
    fetch(window.location.href + 'views/details-template.html').then(data => data.text()).then(data => {
        let template = data;
        let container = document.createElement('div');
        container.id = 'projectDetails';
        container.classList.add('project-details');

        // fill in detailed content
        template = template.replace(/{{name}}/g, content["name"])
                           .replace(/{{subheader}}/g, content["subheader"])
                           .replace(/{{description}}/g, content["description"])
                           .replace(/{{website-url}}/g, content["website-url"])
                           //.replace(/{{thumbnail}}/g, window.location.href + content["thumbnail"]);

        container.innerHTML = template;

        let iconRow = container.querySelector('#iconRow');
        content["technologies-used"].forEach(function(item) {
            let iconWrapper = document.createElement('span');
            iconWrapper.classList.add('icon-wrapper');

            let icon = document.createElement('img');
            icon.id = item;
            icon.classList.add('icon');
            icon.src = window.location.href + '/assets/images/icons/blue/' + item + '.png';

            let iconTitle = document.createElement('span');
            iconTitle.classList.add('icon-title');
            iconTitle.innerHTML = iconNames[item];

            iconWrapper.appendChild(icon);
            iconWrapper.appendChild(iconTitle);
            iconRow.appendChild(iconWrapper);
        });

        document.body.appendChild(container);

        let ps = document.createElement('script');
        ps.src = 'assets/scripts/particle-system.js';
        container.appendChild(ps);

        if (callback) callback();
    });
};

function loadProjectJSON(url, callback) {
    fetch(window.location.href + 'views/content-template.html').then(data => data.text()).then(data => {
        let template = data;
        let els = document.querySelectorAll('.row-el');
        loadJSON(url, function (response) {
            dataObject = JSON.parse(response);
            let pageHtml = "";
            for (let key in dataObject) {
                let idx = parseInt(key);
                els[idx].innerHTML = template.replace(/{{name}}/g, dataObject[idx]["name"])
                                             //.replace(/{{short-description}}/g, dataObject[idx]["short-description"])
                                             .replace(/{{thumbnail}}/g, window.location.href + dataObject[idx]["thumbnail"]);
                els[idx].addEventListener('click', function _func(e) {
                    if (projectsVisible) {
                        selectedIdx = parseInt(e.currentTarget.id);
                        loadProjectContent(showDetails());
                        els[idx].removeEventListener('click', _func);
                    }
                });
                template = data;
            }
            if (callback) callback();
        });    
    });
};

iconNames = {
    "angular" : "Angular",
    "aws": "AWS",
    "bower": "Bower",
    "csharp": "C#",
    "css3": "CSS3",
    "github" : "GitHub",
    "gulp" : "Gulp",
    "html5" : "HTML5",
    "javascript" : "Javascript",
    "linkedin" : "LinkedIn",
    "mongodb" : "MongoDB",
    "nodejs" : "Node.js",
    "npm" : "Node Package Manager",
    "parse-platform" : "Parse Platform",
    "sass" : "Sass",
    "swift" : "Swift",
    "web-components" : "Web Components",
    "webpack" : "Webpack",
}