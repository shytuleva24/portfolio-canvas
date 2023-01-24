// const arrowUp = document.querySelector('.arrow-up');
const iconMenu = document.querySelector('.menu-icon');
const homeMenuLinks = document.querySelectorAll(".scroll-to");
const menuBody = document.querySelector('.menu-body');
// const homePage = document.querySelector(".home");

if (iconMenu) {
    iconMenu.addEventListener("click", function (e) {
        document.body.classList.toggle('lock');
        iconMenu.classList.toggle("open-menu");
        menuBody.classList.toggle("open-menu");
    });

}

if (homeMenuLinks.length > 0) {
    homeMenuLinks.forEach(link => {
        link.onclick = function (event) {
            event.preventDefault();
            onMenuLinkClick(this.getAttribute("href"));
        }
    });

    function onMenuLinkClick(href) {
        if (document.querySelector(href)) {
            const target = document.querySelector(href);
            let targetLocation = target.getBoundingClientRect().top + window.pageYOffset;

            if (iconMenu.classList.contains("open-menu")) {
                document.body.classList.remove('lock');
                iconMenu.classList.remove("open-menu");
                menuBody.classList.remove("open-menu");
            }
            window.scrollTo({
                top: targetLocation,
                behavior: "smooth"
            });
        }
    }
}

animBlockInScroll()


// анимация появления элементов при скролле
function animBlockInScroll() {
    const animItems = document.querySelectorAll(`._anim-items`);

    if (animItems.length > 0) {
        window.addEventListener(`scroll`, animOnScroll);
        window.addEventListener(`touchmove`, animOnScroll);
        window.addEventListener(`wheel`, animOnScroll);

        function animOnScroll() {
            animItems.forEach(element => {
                const animItem = element;
                const animItemHeight = animItem.offsetHeight;
                const animItemOffSet = offset(animItem).top;
                const animStart = 4;
                let animItemPoint = window.innerHeight - animItemHeight / animStart;
                if (animItemHeight > window.innerHeight) {
                    animItemPoint = window.innerHeight - window.innerHeight / animStart;
                }
                if ((window.pageYOffset > animItemOffSet - animItemPoint) && window.pageYOffset < (animItemOffSet + animItemHeight)) {
                    animItem.classList.add(`_active`);
                } else {
                    if (!(animItem.classList.contains(`_anim-no-hide`))) {
                        animItem.classList.remove(`_active`);
                    }
                }
            });
        }

        function offset(el) {
            const rect = el.getBoundingClientRect();
            let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft
            };
        }
        setTimeout(() => {
            animOnScroll();
        }, 300)
    }
}
parallaxEffect()

function parallaxEffect() {
    const parallax = document.querySelectorAll(".parallax");
    const parallaxX = document.querySelector(".parallax-x");
    const parallaxY = document.querySelector(".parallax-y");

    function moveBackground(e) { // на комп
        let Y = e.pageY - window.pageYOffset - e.target.getBoundingClientRect().top + 1;
        let offsetX = (e.pageX / window.innerWidth * 5);
        let offsetY = (Y / window.innerHeight * 3);
        parallaxY.style.transform = `translate(${-offsetX}%, ${-offsetY}%)`;
        // console.log(parallaxX);
        // for (let i = 0; i < parallaxX.length; i++) {
        //     parallaxX[i].style.transform = `translate(${-offsetX}%, ${-offsetY}%)`;
        //     // console.log(element);
        // }
        // parallaxX.forEach(element => {
        //     element.style.transform = `translate(${-offsetX}%, ${-offsetY}%)`;
        // });
    }
    parallax.forEach(element => {
        element.addEventListener("mousemove", function (e) {
            moveBackground(e);
        });
    });
}
// function rand(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }