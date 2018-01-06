function loadJSON(url, callback) {   
    let xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);  
};

let dataObject = {};
let selectedIdx = -1;

function loadProjectContent(callback) {
    // obj not defined
    var content = dataObject[selectedIdx];
    // maybe have to do the fetch in the click event listener
    fetch(window.location.href + 'views/details-template.html').then(data => data.text()).then(data => {
        let template = data;
        let container = document.createElement('div');
        container.id = 'projectDetails';
        container.classList.add('project-details');

        //let container = document.querySelector('#bg');

        // fill in detailed content
        template = template.replace(/{{name}}/g, content["name"])
                           .replace(/{{short-description}}/g, content["short-description"])
                           .replace(/{{long-description}}/g, content["long-description"])
                           .replace(/{{website-url}}/g, content["website-url"])
                           .replace(/{{thumbnail}}/g, window.location.href + content["thumbnail"]);

        container.innerHTML = template;
        document.body.appendChild(container);

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
                                             .replace(/{{short-description}}/g, dataObject[idx]["short-description"])
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