// /** Slider by Hashtag team
//  * .slider                                      - обов'язковий клас для слайдера
//  * .slider-container                            - обов'язковий клас для контейнера слайдів 
//  * id                                           - обов'язково задати id

// .(карточки слайдера)                            - обов'язкові стилі для єффекту FadeOut
//     opacity: 0
//     visibility: hidden
// .(карточки слайдера).active
//     opacity: 1
//     visibility: visible

// .left.slider_navigation                         - класи для заддяння стилів на кнопки
// .right.slider_navigation                
// .slider-dot                                     - клас для задання стилів на точки


//  * const sliderProps = {
//         isSlidesToScrollAll: false,               - cкролити одразу всі видимі слайди
//         gap: 20,                                - відстань між слайдами
//         isArrows: false,                          - наявність стрілочок
//         isAutoplay: true,                         - автоскролл
//         autoplaySpeed: 3000                     - швидкість автоскролла
//         isDots: false,                            - наявність точок знизу слайдера
//         distanceToDots: 0,                      - паддінг для відображення точок, якщо потрібен
//         baseCardWidth: widthSliderContainer,    - базова ширина карточок слайдера
//         transitionCard: "all .8s ease-in-out",  - єффект появи карточок
//         isEffectFadeOut: false                  - тип слайдера (з плавною появою, або скролом вбік)
//     }

//  * infinitySlider(selector, settings)
//         - selector - шлях до слайдера, 
//         - settings - нестанарні налаштування sliderProps
//  **/

class InfinitySlider {
    constructor(selector, settings = {}) {
        this.settings = {
            ...InfinitySlider.defaultSettings,
            ...settings
        };
        this.slider = document.querySelector(selector);
        this.positionCards = 0;
        this.sliderContainer = this.slider.querySelector(".slider-container");
        this.sliderCards = this.sliderContainer.children;
        this.realCardsLength = this.sliderCards.length;
        this.heightCards = 0;
        this.widthSliderContainer;
        this.cardsCount;
        this.widthCards;
        this.distanceCards;
        this.cloneCard;
        this.prevBtnSlider;
        this.nextBtnSlider;
        this.sliderInterval;
        this.maxHeight;
        this.sliderDots;
        this.touchPoint;
        // InfinitySlider.defaultSettings.baseCardWidth = this.widthSliderContainer;
    };

    static defaultSettings = {
        isSlidesToScrollAll: false,
        gap: 0,
        isArrows: false,
        isDots: false,
        distanceToDots: 0,
        isAutoplay: false,
        autoplaySpeed: 3000,
        baseCardWidth: null,
        transitionCard: "all 1s ease-in-out",
        isEffectFadeOut: false
    };

    init() {
        this.widthSliderContainer = this.sliderContainer.getBoundingClientRect().width;

        if (this.settings.baseCardWidth == null) this.settings.baseCardWidth = this.widthSliderContainer

        this.slider.querySelectorAll(".clone").forEach(clone => {
            clone.remove();
        });

        if (localStorage[this.slider.id + "Interval"]) {
            clearInterval(localStorage[this.slider.id + "Interval"]);
        }

        this.slider.style.position = "relative";
        this.slider.style.overflow = "hidden";
        this.sliderContainer.style.position = "relative";
        this.sliderContainer.style.width = "100%";
        
        this.cardsCount = Math.floor(this.widthSliderContainer / (parseInt(this.settings.baseCardWidth) + this.settings.gap));
        if (this.cardsCount == 0) this.cardsCount = 1;
        this.distanceCards = this.settings.gap;
        this.widthCards = (this.widthSliderContainer - ((this.cardsCount - 1) * this.distanceCards)) / this.cardsCount;
        this.positionCards = 0 - (this.distanceCards + this.widthCards);

        if (this.settings.isArrows) this.creationArrows();
        this.prevBtnSlider = this.slider.querySelector('.left.slider_navigation');
        this.nextBtnSlider = this.slider.querySelector('.right.slider_navigation');
        if (this.settings.isArrows && this.sliderCards.length <= this.cardsCount) {
            this.prevBtnSlider.style.display = "none";
            this.nextBtnSlider.style.display = "none";
        } else if (this.settings.isArrows) {
            this.prevBtnSlider.style.display = "block";
            this.nextBtnSlider.style.display = "block";
        }
        if (this.settings.isDots && this.realCardsLength > 1) {
            this.creationDots();
            this.sliderDots = document.querySelectorAll('.slider-dot');
            for (let i = 0; i < this.sliderCards.length; i++) {
                if (this.sliderCards[i].classList.contains("activeFade")) {
                    this.sliderDots[i].classList.remove("activeFade");
                    this.sliderCards[i].classList.remove("activeFade");
                }
            }
            this.sliderDots[0].classList.add("activeFade");
            this.sliderCards[0].classList.add("activeFade");
        }

        if (!this.settings.isEffectFadeOut) {
            this.creationClons();
            this.shuffleCard();
        }

        this.sliderCards = this.sliderContainer.children;
        this.heightCards = 0;
        for (let i = 0; i < this.sliderCards.length; i++) {
            this.sliderCards[i].style.width = this.widthCards + "px";
            this.sliderCards[i].style.position = "absolute";
            this.maxHeight = this.sliderCards[i].getBoundingClientRect().height;
            if (this.heightCards < this.maxHeight) {
                this.heightCards = this.maxHeight;
            }
            this.sliderCards[i].style.transition = 'none';
            setTimeout(() => {
                this.sliderCards[i].style.transition = this.settings.transitionCard;
            }, 1);
        }

        this.settings.isDots ? this.sliderContainer.style.height = this.heightCards + this.settings.distanceToDots + 'px' : this.sliderContainer.style.height = this.heightCards + 'px';
        
        this.sliderDots = document.querySelectorAll('.slider-dot');
        this.sliderDots.forEach(element => {
            element.onclick = () => {
                clearInterval(localStorage[this.slider.id + "Interval"]);
                for (let index = 0; index < this.realCardsLength; index++) {
                    this.sliderDots[index].classList.remove("activeFade");
                    this.sliderCards[index].classList.remove("activeFade");
                }
                this.sliderCards[element.dataset.order].classList.add("activeFade");
                element.classList.add("activeFade");
            }
        });
        if (this.settings.isAutoplay && this.realCardsLength > this.cardsCount) {
            this.startAutoPlay();
        }
        this.slider.addEventListener('touchend', () => {
            if (this.settings.isAutoplay && this.realCardsLength > this.cardsCount) {
                this.startAutoPlay();
            }
        });
        
        this.touchSlider = this.touchSlider.bind(this);

        this.slider.addEventListener('touchstart', (e) => {
            this.touchPoint = e.touches[0].pageX;
            this.slider.addEventListener('touchmove', this.touchSlider);
            clearInterval(localStorage[this.slider.id + "Interval"]);
        });

        this.slider.onmouseenter = () => {
            clearInterval(localStorage[this.slider.id + "Interval"]);
        };

        this.slider.onmouseleave = () => {
            if (this.settings.isAutoplay && this.realCardsLength > this.cardsCount) {
                this.startAutoPlay();
            }
        };
    }

    creationClons() {
        let counter = 1;
        do {
            this.cloneCard = this.sliderCards[this.sliderCards.length - counter].cloneNode(true);
            this.cloneCard.classList.add("clone");
            this.cloneCard.style.transition = 'none';
            this.sliderContainer.insertAdjacentElement("afterbegin", this.cloneCard);
            this.realCardsLength = this.sliderCards.length - this.slider.querySelectorAll('.clone').length
            counter++;
        } while (counter <= this.realCardsLength && this.settings.isSlidesToScrollAll);
        
        if (this.settings.isSlidesToScrollAll) {
            counter = 0;
            while (counter < this.realCardsLength) {
                this.cloneCard = this.sliderCards[counter].cloneNode(true);
                this.cloneCard.classList.add("clone");
                this.cloneCard.style.transition = 'none';
                this.sliderContainer.insertAdjacentElement("beforeend", this.cloneCard);
                counter++;            
            }
        }
    }


    creationArrows() {
        const areArrowsExist = this.slider.querySelectorAll('.slider_navigation').length;
        if (areArrowsExist < 1) {
            this.prevBtnSlider = document.createElement("span");
            this.nextBtnSlider = document.createElement("span");
            this.prevBtnSlider.className = "left slider_navigation";
            this.nextBtnSlider.className = "right slider_navigation";
            this.slider.insertAdjacentElement("afterbegin", this.prevBtnSlider);
            this.slider.insertAdjacentElement("beforeend", this.nextBtnSlider);

            let isClickUnabled = true;
            const clickUnabled = () => {
                isClickUnabled = false;
                setTimeout(() => {
                    isClickUnabled = true;
                }, (parseFloat(this.sliderCards[0].style.transitionDuration) * 1000));
            };

            this.prevBtnSlider.onclick = () => {
                if (isClickUnabled) {
                    this.changeSlide("left");
                    clickUnabled();
                }
            };
            this.nextBtnSlider.onclick = () => {
                if (isClickUnabled) {
                    this.changeSlide("right");
                    clickUnabled();
                }
            };
        }
    }

    creationDots() {
        const dotsContainer = this.slider.querySelector('.dots-container');
        if (!dotsContainer) {
            let dotContainer = document.createElement("div");
            dotContainer.style.position = "absolute";
            dotContainer.className = "dots-container";
            dotContainer.style.bottom = "0";
            this.slider.insertAdjacentElement("beforeend", dotContainer);
            for (let index = 0; index < this.realCardsLength; index++) {
                const slideDot = document.createElement("span");
                slideDot.className = "slider-dot";
                slideDot.dataset.order = index;
                dotContainer.insertAdjacentElement("beforeend", slideDot);
            }
        }
    }

    shuffleCard() {
        this.sliderCards = this.sliderContainer.children;
        this.positionCards = 0 - (this.distanceCards + this.widthCards);
        if (this.settings.isSlidesToScrollAll) {
            this.positionCards = 0 - (this.distanceCards + this.widthCards) * this.realCardsLength;
        }
        for (let i = 0; i < this.sliderCards.length; i++) {
            this.sliderCards[i].style.left = this.positionCards + 'px';
            this.positionCards += (this.distanceCards + this.widthCards);
        }
    }

    changeSlide(direction) {
        this.widthSliderContainer = this.sliderContainer.getBoundingClientRect().width;
        this.cardsCount = Math.floor(this.widthSliderContainer / (parseInt(this.settings.baseCardWidth) + this.settings.gap));
        if (this.cardsCount == 0) this.cardsCount = 1;
        this.widthCards = (this.widthSliderContainer - ((this.cardsCount - 1) * this.distanceCards)) / this.cardsCount;
        this.sliderCards = this.sliderContainer.children;
        let slideIndex = 0;
        for (let i = 0; i < this.sliderCards.length; i++) {
            if (this.sliderCards[i].classList.contains("activeFade")) {
                slideIndex = i;
            }
        }
        if (direction == "left") {
            if (this.settings.isSlidesToScrollAll) {
                for (let index = 0; index < this.cardsCount; index++) {
                    this.sliderContainer.insertAdjacentElement("afterbegin", this.sliderCards[this.sliderCards.length - 1]);
                }
            } else if (this.settings.isEffectFadeOut) {
                setTimeout(() => this.sliderCards[slideIndex].classList.add("activeFade"), 800);
                setTimeout(() => this.sliderDots[slideIndex].classList.add("activeFade"), 800);
                this.sliderCards[slideIndex].classList.remove("activeFade");
                this.sliderDots[slideIndex].classList.remove("activeFade");
                this.sliderCards[slideIndex - 1] ? slideIndex-- : slideIndex = this.sliderCards.length - 1;
            } else {
                this.sliderCards[this.sliderCards.length - 1].remove();
                let cloneLast = this.sliderCards[this.sliderCards.length - 1].cloneNode(true);
                cloneLast.classList.add("clone");
                this.sliderContainer.insertAdjacentElement("afterbegin", cloneLast);
                this.sliderCards[1].classList.remove("clone");
            }
        } else if (direction == "right") {
            if (this.settings.isSlidesToScrollAll) {
                for (let index = 0; index < this.cardsCount; index++) {
                    this.sliderContainer.insertAdjacentElement("beforeend", this.sliderCards[0]);
                }
            } else if (this.settings.isEffectFadeOut) {
                setTimeout(() => this.sliderCards[slideIndex].classList.add("activeFade"), 800);
                setTimeout(() => this.sliderDots[slideIndex].classList.add("activeFade"), 800);
                this.sliderCards[slideIndex].classList.remove("activeFade");
                this.sliderDots[slideIndex].classList.remove("activeFade");
                this.sliderCards[slideIndex + 1] ? slideIndex++ : slideIndex = 0
            } else {
                this.sliderCards[0].remove();
                let cloneFirst = this.sliderCards[0].cloneNode(true);
                cloneFirst.classList.add("clone");
                this.sliderContainer.insertAdjacentElement("beforeend", cloneFirst);
                this.sliderCards[this.sliderCards.length - 2].classList.remove("clone");
            }
        }
        if (!this.settings.isEffectFadeOut) this.shuffleCard();
    }

    startAutoPlay() {
        clearInterval(localStorage[this.slider.id + "Interval"]);
        if (this.settings.isEffectFadeOut) {
            let slideIndex = 0;
            for (let i = 0; i < this.sliderCards.length; i++) {
                if (this.sliderCards[i].classList.contains("activeFade")) {
                    slideIndex = i;
                }
            }
            const setActive = (index) => {
                setTimeout(() => this.sliderCards[index].classList.add("activeFade"), 1000);
                setTimeout(() => this.sliderDots[index].classList.add("activeFade"), 1000);
            }
            this.sliderInterval = setInterval(() => {
                this.sliderCards[slideIndex].classList.remove("activeFade");
                this.sliderDots[slideIndex].classList.remove("activeFade");
                this.sliderCards[slideIndex + 1] ? slideIndex++ : slideIndex = 0
                setActive(slideIndex);
            }, this.settings.autoplaySpeed);
        } else {
            this.sliderInterval = setInterval(() => {
                this.changeSlide("right");
            }, this.settings.autoplaySpeed);
        }
        localStorage[this.slider.id + "Interval"] = this.sliderInterval;
    }

    touchSlider(e) {
        if ((this.touchPoint + 20) < e.touches[0].pageX) {
            this.changeSlide('left');
            this.slider.removeEventListener('touchmove', this.touchSlider);
        } else if ((this.touchPoint - 20) > e.touches[0].pageX) {
            this.changeSlide('right');
            this.slider.removeEventListener('touchmove', this.touchSlider);
        }
    }
}

const sliderTools = new InfinitySlider(".technology-slider", {
    isArrows: true,
    isSlidesToScrollAll: true,
    baseCardWidth: "300rem",
    gap: 20,
    isAutoplay: true,
    autoplaySpeed: 5000,
    transitionCard: "all 1s ease-in-out",
});

const sliderPortfolio = new InfinitySlider(".works-slider", {
    isArrows: true,
    baseCardWidth: "300rem",
    gap: 30,
    isAutoplay: true,
    autoplaySpeed: 5000,
    transitionCard: "all 1s ease-in-out",
});

sliderTools.init();
sliderPortfolio.init();

window.onresize = function () {
    sliderTools.init();
    sliderPortfolio.init();
};
