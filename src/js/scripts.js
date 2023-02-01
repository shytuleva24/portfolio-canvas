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
// parallaxEffect()

// function parallaxEffect() {
//     const parallax = document.querySelectorAll(".parallax");
//     const parallaxX = document.querySelector(".parallax-x");
//     const parallaxY = document.querySelector(".parallax-y");

//     function moveBackground(e) { // на комп
//         let Y = e.pageY - window.pageYOffset - e.target.getBoundingClientRect().top + 1;
//         let offsetX = (e.pageX / window.innerWidth * 5);
//         let offsetY = (Y / window.innerHeight * 3);
//         parallaxY.style.transform = `translate(${-offsetX}%, ${-offsetY}%)`;
//         // console.log(parallaxX);
//         // for (let i = 0; i < parallaxX.length; i++) {
//         //     parallaxX[i].style.transform = `translate(${-offsetX}%, ${-offsetY}%)`;
//         //     // console.log(element);
//         // }
//         // parallaxX.forEach(element => {
//         //     element.style.transform = `translate(${-offsetX}%, ${-offsetY}%)`;
//         // });
//     }
//     parallax.forEach(element => {
//         element.addEventListener("mousemove", function (e) {
//             moveBackground(e);
//         });
//     });
// };

// canvas = document.getElementById("drawingCanvas");
// context = canvas.getContext("2d");
// const img = document.getElementById("photo");
// const CELL_SIZE = 1;
// const containerMyPhoto = document.querySelector('.my-photo');
// img.onload = () => {
//     canvas.width = img.width
//     canvas.height = img.height
//     console.log(img.width, img.height);
//     for (let y = 0; y < img.height / CELL_SIZE; y++) {
//         for (let x = 0; x < img.width / CELL_SIZE; x++) {
//             if ((x + y) % 2 === 0) {
//                 continue;
//             }

//             setTimeout(function() {
//                 // body
//                 // context.drawImage(
//                 //     img,
//                 //     x * CELL_SIZE,
//                 //     y * CELL_SIZE,
//                 //     CELL_SIZE,
//                 //     CELL_SIZE,
//                 //     x * CELL_SIZE,
//                 //     y * CELL_SIZE,
//                 //     CELL_SIZE,
//                 //     CELL_SIZE
//                 // );
//             }, 1);
//         }
//         context.drawImage(img, 0, 0, img.width, img.height);

//     }
// }


// const containerMyPhoto = document.querySelector('.my-photo');
// animPhotoCrop(document.querySelector('.my-photo'));

// function animPhotoCrop(obj) {
//     let img = obj.querySelector('img'),
//         gridX = 7,
//         gridY = 7,
//         imgW = img.getBoundingClientRect().width,
//         imgH = img.getBoundingClientRect().height,
//         bgPosY = 0,
//         top = 0;
//         spanWhidth = 100 / gridX,
//         spanHeight = 100 / gridY,
//         width = imgW / gridX,
//         height = imgH / gridY;

//     // img.remove()
//     function create() {
//         for (let x = 0; x < gridX; x++) {
//             let bgPosX = 0,
//                 left = 0;
//             for (let y = 0; y < gridY; y++) {
//                 let span = document.createElement('span');
//                 span.style.backgroundImage = `url(${img.src})`;
//                 span.style.display = 'inline-block';
//                 span.style.backgroundRepeat = 'no-repeat';
//                 span.style.position = 'absolute';
//                 span.style.transition = `all ${(rand(3, 10))/10}s ease ${(rand(10, 13))/10}s`;
//                 span.style.opacity = "0";
//                 span.style.transform = `translate(${rand(-window.innerWidth, window.innerWidth)}px, ${rand(-window.innerHeight, window.innerHeight)}px) scale(${rand(40, 40)/10})`;
//                 span.style.top = top + 'px';
//                 span.style.left = left  + 'px';
//                 span.style.width = width  + 'px';
//                 span.style.height = height  + 'px';
//                 span.style.backgroundPosition = bgPosX + "% " + bgPosY + "%";
//                 bgPosX += spanWhidth;
//                 left += width;
//                 console.log(bgPosX, bgPosY);
//                 setTimeout(() => {
//                     span.style.transform = `translate(0px, 0px) scale(1)`;
//                     span.style.opacity = "1";
//                 }, 0);
//                 obj.appendChild(span);
//                 // setTimeout(() => {
//                     //     span.remove();
//                     // }, 1500);
//                 }
//             bgPosY += spanHeight;
//             top += height;
//         }
//     }
//     create();

//     function rand(min, max) {
//         return Math.floor(Math.random() * (max - min + 1)) + min;
//     }
// }
// function rand(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

const form = document.querySelector('#form');