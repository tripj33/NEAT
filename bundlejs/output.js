function scrollCards(e) {
    let target = e.target;
    let cardWrapper = target.parentNode.nextSibling;
    let cardWrapperWidth = cardWrapper.scrollWidth;
    let sliderCard = cardWrapper.firstChild;
    let sliderCardWidth = sliderCard.offsetWidth;
    let sliderCardMargin = window.getComputedStyle(sliderCard).getPropertyValue("margin-right");
    sliderCardMargin = sliderCardMargin.match(/\d+/)[0];
    console.log(target.dataset.scroll)
    let sliderCardFullWidth = parseInt(sliderCardWidth) + parseInt(sliderCardMargin);
    if (target.dataset.scroll === "left") {
        cardWrapper.scrollLeft += sliderCardFullWidth
        console.log("scrool-left")
    } else {
        cardWrapper.scrollLeft -= sliderCardFullWidth
        console.log("scrool-right");
    }
}
