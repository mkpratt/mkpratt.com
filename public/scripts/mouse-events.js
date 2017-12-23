var ww = window.innerWidth;
var wh = window.innerHeight;
// Get new height if window size changes
window.onresize = function(event) {
    ww = window.innerWidth
    wh = window.innerHeight;
};
// Control perspective based on mouse position
var mx, my, midX, midY, px, py, img1, img2;
document.addEventListener('mousemove', function updateMousePosition(ev) {
    // mouse position and mid points
    mx = ev.clientX; my = ev.clientY;
    midX = ww/2; midY = wh/2;

    if (mx < midX) px = -(midX-mx); else px = mx-midX;
    if (my < midY) py = -(midY-my); else py = my-midY;

    img1 = document.getElementById('n1'); img2 = document.getElementById('n2');
    stars = document.getElementById('s1'); stars2 = document.getElementById('s2');
    img1.style.transform = 'translate(' + -(px * .096) + 'px, ' + -(py * .048) + 'px)';
    img2.style.transform = 'translate(' + -(px * .048) + 'px, ' + -(py * .016) + 'px)';
    stars.style.transform = 'translate(' + -(px * 0.064) + 'px, ' + -(py * 0.032) + 'px)';
    stars2.style.transform = 'translate(' + -(px * 0.032) + 'px, ' + -(py * 0.024) + 'px) scale(-1, -1)';
});