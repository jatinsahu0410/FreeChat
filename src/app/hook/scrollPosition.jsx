
export function ScrollPosition() {
    const element = document.getElementById("myDiv");
    const innerElement = document.getElementById("content");

    const scrolledTopHeight = element.scrollTop;
    const scrollh = innerElement.scrollHeight;
    const clientS = element.clientHeight;

    const height = scrollh - clientS;
    const scrolled = (height / scrolledTopHeight) * 100;
    return scrolled;
}