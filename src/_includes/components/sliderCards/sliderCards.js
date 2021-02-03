function scrollCards(e) {
    let target = e.target;
    let cardWrapper = target.parentNode.nextSibling;

    let cardWrapperWidth = cardWrapper.scrollWidth;
    let sliderCard = cardWrapper.firstChild;
    let sliderCardWidth = sliderCard.offsetWidth;
    let sliderCardMargin = window.getComputedStyle(sliderCard).getPropertyValue("margin-right");
    sliderCardMargin = sliderCardMargin.match(/\d+/)[0];
    let sliderCardFullWidth = parseInt(sliderCardWidth) + parseInt(sliderCardMargin);
    if (target.parentNode.dataset.scroll === "left") {
        cardWrapper.scrollLeft += sliderCardFullWidth;
    } else {
        cardWrapper.scrollLeft -= sliderCardFullWidth;
    }
}
