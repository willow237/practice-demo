const card = document.querySelector('.card');

function barHeight() {
    return window.outerHeight - window.innerHeight;
}

/**
 * 视口坐标转屏幕坐标
 */
function clientToScreen(x, y) {
    const screenX = x + window.screenX;
    const screenY = y + window.screenY + barHeight();
    return [screenX, screenY];
}

/**
 * 屏幕坐标转视口坐标
 */
function screenToClient(x, y) {
    const clientX = x - window.screenX;
    const clientY = y - window.screenY - barHeight();
    return [clientX, clientY];
}

// 窗口通信
const channel = new BroadcastChannel('card');
channel.onmessage = (e) => {
    const clientPoints = screenToClient(...e.data);
    card.style.left = clientPoints[0] + 'px';
    card.style.top = clientPoints[1] + 'px';
}
card.onmousedown = (e) => {
    let x = e.pageX - card.offsetLeft;
    let y = e.pageY - card.offsetTop;

    window.onmousemove = (e) => {
        const cx = e.pageX - x;
        const cy = e.pageY - y;
        card.style.left = cx + 'px';
        card.style.top = cy + 'px';
        const screenPoints = clientToScreen(cx, cy);
        channel.postMessage(screenPoints);
    };

    window.onmouseup = () => {
        window.onmousemove = null;
        window.onmouseup = null;
    }
}

function init() {
    const url = new URL(location.href);
    const type = url.searchParams.get("type") || 'Q';
    card.src = './images/' + `${type}.jpg`;
}

init();