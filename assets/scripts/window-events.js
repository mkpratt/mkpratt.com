function resizeNavWrapper() {
    if (CURRENT_STATE && CURRENT_STATE === State.MAIN) {
        let h = window.innerHeight;
        let cubeSize = (h / 2) + 50;
        let nw = document.querySelector('#navWrapper');
        nw.style.width = (cubeSize + 450) + 'px';
        nw.style.opacity = 1;
    }
};
window.addEventListener('resize', resizeNavWrapper);

// ADD OTHER WINDOW EVENTS FROM cube.js AND OTHERS

function resizeAll() {
    resizeNavWrapper();
};

if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    resizeAll();
} else {
    document.addEventListener('DOMContentLoaded', resizeAll);
}