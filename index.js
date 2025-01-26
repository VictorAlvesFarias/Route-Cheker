const routeList = document.getElementById('route-list');
const domainFilter = document.getElementById('domain-filter');

async function listRoutes() {
    routeList.innerHTML = '';
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const filter = domainFilter.value;

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getRoutes,
        args: [filter]
    }, (result) => {
        const routes = result[0].result;
        routes.forEach(route => {
            const li = document.createElement('li');
            li.textContent = route;
            routeList.appendChild(li);
        });
    });
}
function getRoutes(filter) {
    const anchors = [...document.querySelectorAll('a')];
    const iframes = [...document.querySelectorAll('iframe')];
    return [...anchors.map(a => a.href), ...iframes.map(f => f.src)]
        .filter(url => url && (!filter || new URL(url).hostname.includes(filter)));
}

domainFilter.addEventListener('input', listRoutes);
document.addEventListener('DOMContentLoaded', () => {
    listRoutes();
});
