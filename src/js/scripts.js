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



// function rand(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }