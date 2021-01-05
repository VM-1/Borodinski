	function testWebP(callback) {

var webP = new Image();
webP.onload = webP.onerror = function () {
callback(webP.height == 2);
};
webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

if (support == true) {
document.querySelector('body').classList.add('webp');
}else{
document.querySelector('body').classList.add('no-webp');
}
});
	let burgerMenu = document.querySelector(".header__burger");
burgerMenu.addEventListener("click", function(){
	burgerMenu.classList.toggle('_active');
	document.querySelector(".header__nav").classList.toggle('_active');
	// document.querySelector(".header").classList.toggle('_active');
	document.querySelector("body").classList.toggle('lock');
	document.querySelector("header").classList.toggle('_active');
})
	let sliders = document.querySelectorAll('._swiper');
if (sliders) {
  for (let index = 0; index < sliders.length; index++) {
    let slider = sliders[index];
    if (!slider.classList.contains('swiper-bild')) {
      let slider_items = slider.children;
      if (slider_items) {
        for (let index = 0; index < slider_items.length; index++) {
          let el = slider_items[index];
          el.classList.add('swiper-slide');
        }
      }
      let slider_content = slider.innerHTML;
      let slider_wrapper = document.createElement('div');
      slider_wrapper.classList.add('swiper-wrapper');
      slider_wrapper.innerHTML = slider_content;
      slider.innerHTML = '';
      slider.appendChild(slider_wrapper);
      slider.classList.add('swiper-bild');
    }
    if (slider.classList.contains('_gallery')) {
      //slider.data('lightGallery').destroy(true);
    }
  }
  sliders_bild_callback();
}

function sliders_bild_callback(params) { }

const indexSwiper = new Swiper('.photoslider__body', {
    speed: 800,
    navigation: {
      nextEl: '.photo__button_next',
      prevEl: '.photo__button_prev',
    },
})
const smallSwiper = new Swiper('.slider-small', {
  slidesPerView: 3,
  spaceBetween: 20,
  // simulateTouch: true,
  breakpoints: {
    // when window width is >= 320px
    320: {
      spaceBetween: 10,
    },
    650: {
        spaceBetween: 20,
    },
  }
})

const bigSwiper = new Swiper('.slider-big', {
  slidesPerView: 1,
  thumbs: {
    swiper: smallSwiper
  }
})
	class DynamicAdapt {
  constructor(type) {
    this.type = type;
  }

  init() {
    // массив объектов
    this.оbjects = [];
    this.daClassname = '_dynamic_adapt_';
    // массив DOM-элементов
    this.nodes = [...document.querySelectorAll('[data-da]')];

    // наполнение оbjects объктами
    this.nodes.forEach((node) => {
      const data = node.dataset.da.trim();
      const dataArray = data.split(',');
      const оbject = {};
      оbject.element = node;
      оbject.parent = node.parentNode;
      оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
      оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
      оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.оbjects.push(оbject);
    });

    this.arraySort(this.оbjects);

    // массив уникальных медиа-запросов
    this.mediaQueries = this.оbjects
      .map(({
        breakpoint
      }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
      .filter((item, index, self) => self.indexOf(item) === index);

    // навешивание слушателя на медиа-запрос
    // и вызов обработчика при первом запуске
    this.mediaQueries.forEach((media) => {
      const mediaSplit = media.split(',');
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];

      // массив объектов с подходящим брейкпоинтом
      const оbjectsFilter = this.оbjects.filter(
        ({
          breakpoint
        }) => breakpoint === mediaBreakpoint
      );
      matchMedia.addEventListener('change', () => {
        this.mediaHandler(matchMedia, оbjectsFilter);
      });
      this.mediaHandler(matchMedia, оbjectsFilter);
    });
  }

  // Основная функция
  mediaHandler(matchMedia, оbjects) {
    if (matchMedia.matches) {
      оbjects.forEach((оbject) => {
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.moveTo(оbject.place, оbject.element, оbject.destination);
      });
    } else {
      оbjects.forEach(
        ({ parent, element, index }) => {
          if (element.classList.contains(this.daClassname)) {
            this.moveBack(parent, element, index);
          }
        }
      );
    }
  }

  // Функция перемещения
  moveTo(place, element, destination) {
    element.classList.add(this.daClassname);
    if (place === 'last' || place >= destination.children.length) {
      destination.append(element);
      return;
    }
    if (place === 'first') {
      destination.prepend(element);
      return;
    }
    destination.children[place].before(element);
  }

  // Функция возврата
  moveBack(parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
      parent.children[index].before(element);
    } else {
      parent.append(element);
    }
  }

  // Функция получения индекса внутри родителя
  indexInParent(parent, element) {
    return [...parent.children].indexOf(element);
  }

  // Функция сортировки массива по breakpoint и place 
  // по возрастанию для this.type = min
  // по убыванию для this.type = max
  arraySort(arr) {
    if (this.type === 'min') {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === 'first' || b.place === 'last') {
            return -1;
          }
          if (a.place === 'last' || b.place === 'first') {
            return 1;
          }
          return a.place - b.place;
        }
        return a.breakpoint - b.breakpoint;
      });
    } else {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === 'first' || b.place === 'last') {
            return 1;
          }
          if (a.place === 'last' || b.place === 'first') {
            return -1;
          }
          return b.place - a.place;
        }
        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  }
}
const da = new DynamicAdapt("max");  
da.init();


const filterCheckbox= document.querySelectorAll('.filter-checkbox');
const filterRadio= document.querySelectorAll('.filter-radio');

filterCheckbox.forEach(function(elem) {
	elem.addEventListener('click', function(e) {
		clickElem = this
		event.preventDefault();
		let checkboxActive = null;
		if (clickElem.classList.contains('_active')) {
			console.log(clickElem);
			filterCheckbox.forEach(function(elem) {
				if (elem.classList.contains('_active')) {
					checkboxActive++
					console.log(checkboxActive);
				}
			});
			if (checkboxActive > 1) {
				clickElem.classList.remove('_active');
			}
		}else {
			clickElem.classList.add('_active')
		}
	});
});

filterRadio.forEach(function(elem) {
	elem.addEventListener('click', function(e) {
		event.preventDefault();
		filterRadio.forEach(function(elem) {
			elem.classList.remove('_active');
		}),
		this.classList.add('_active');
	});
});

const page = document.querySelector('[data-page]');
const headerItem = document.querySelectorAll('[data-item]');

if (page) {
	let pageAttr = page.getAttribute('data-page');
	headerItem.forEach(function(elem) {
		let headerItemAttr = elem.getAttribute('data-item')
		if (headerItemAttr == pageAttr) {
			elem.classList.add('_active');
		}
	});
}

let anchors = document.querySelectorAll('.anchor');
if (anchors.length >= 0){
	for (anchor of anchors) {
		anchor.addEventListener('click' , function(anchor){
			event.preventDefault();
			let blockID = this.getAttribute('href');
			let anchorLink = document.querySelector(blockID);
			anchorLink.scrollIntoView({
				behavior:"smooth",
				block: "start"
			})		
		})
	}
}