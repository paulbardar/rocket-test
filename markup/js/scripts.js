let objectFitPoly = false;
let loadLazyLoadScript = false;

document.addEventListener('DOMContentLoaded', function(){
	loadFonts();
	// supportPolyfills();
	correctVh();
	// lazyLoad();
});

// load fonts
function loadFonts() {
	WebFont.load({
		custom: {
			families: ['Font Awesome 5 Brands'],
			urls: ['css/fonts.css']
		},
		google: {
			families: ['Cormorant:500,regular', 'Montserrat:400,500,regular']
		}
	});
}

// lazyLoad Images
function lazyLoad() {
	if ('loading' in HTMLImageElement.prototype) {
		let images = document.querySelectorAll('img.lazyload');
		images.forEach(function (img) {
			img.src = img.dataset.src;
			img.onload = function() {
				img.classList.add('lazyloaded');
			};
			if (img.classList.contains('svg-html')) {
				replaseInlineSvg(img);
			}
			if (img.classList.contains('lazyload-bg')) {
				img.style.display = "none";
				img.parentNode.style.backgroundImage = "url(" + img.dataset.src + ")";
			}
		});
	} else {
		if (!loadLazyLoadScript) {
			loadLazyLoadScript = true;
			let script = document.createElement("script");
			script.async = true;
			script.src = '/js/lazysizes.min.js';
			document.body.appendChild(script);
		}
		document.addEventListener('lazyloaded', function (e) {
			let img = e.target;
			if (img.classList.contains('lazyload-bg')) {
				img.style.display = 'none';
				img.parentNode.style.backgroundImage = 'url(' + img.dataset.src + ')';
			}
			if (img.classList.contains('svg-html')) {
				replaseInlineSvg(img);
			}
		});
	}
}

// replaseInlineSvg
function replaseInlineSvg(el) {
	const imgID = el.getAttribute('id');
	const imgClass = el.getAttribute('class');
	const imgURL = el.getAttribute('src');

	fetch(imgURL)
		.then(data => data.text())
		.then(response => {
			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(response, 'text/html');
			let svg = xmlDoc.querySelector('svg');

			if (typeof imgID !== 'undefined') {
				svg.setAttribute('id', imgID);
			}

			if (typeof imgClass !== 'undefined') {
				svg.setAttribute('class', imgClass + ' replaced-svg');
			}

			svg.removeAttribute('xmlns:a');

			el.parentNode.replaceChild(svg, el);
	});
}

// correctVh
function correctVh() {
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', vh+'px');
}

// support and polyfills
function supportPolyfills() {
	// objectFit
	if('objectFit' in document.documentElement.style === false && !objectFitPoly) {
		const script = document.createElement('script');

		script.src = '/js/ofi.min.js';
		document.body.appendChild(script);
		script.onload = function () {
			objectFitPoly = true;
			objectFitImages();
		};
	}

	// forEach
	if (window.NodeList && !NodeList.prototype.forEach) {
		NodeList.prototype.forEach = Array.prototype.forEach;
	}

	// swiper 6 polyfills
	Number.isNaN = Number.isNaN || function isNaN(input) {
		return typeof input === 'number' && input !== input;
	}

	if (!String.prototype.repeat) {
		String.prototype.repeat = function(count) {
			'use strict';
			if (this == null)
				throw new TypeError('can\'t convert ' + this + ' to object');

			let str = '' + this;
			count = +count;
			if (count != count)
				count = 0;

			if (count < 0)
				throw new RangeError('repeat count must be non-negative');

			if (count == Infinity)
				throw new RangeError('repeat count must be less than infinity');

			count = Math.floor(count);
			if (str.length == 0 || count == 0)
				return '';

			if (str.length * count >= 1 << 28)
				throw new RangeError('repeat count must not overflow maximum string size');

			let maxCount = str.length * count;
			count = Math.floor(Math.log(count) / Math.log(2));
			while (count) {
				str += str;
				count--;
			}
			str += str.substring(0, maxCount - str.length);
			return str;
		}
	}
	// swiper 6 polyfills end
};

// mobile menu
function mobileMenu() {
	const openBtn = document.querySelector('.navbar-toggler'),
		menuItem = document.querySelectorAll('.menu-link'),
		body = document.body,
		mobNav = document.querySelectorAll('.mob-nav');

	openBtn.addEventListener('click', function(event) {
		event.preventDefault();
		if( body.classList.contains('mobmenu-opened') ) {
			body.classList.remove('mobmenu-opened');
		} else {
			body.classList.add('mobmenu-opened');
		}
		if ( document.querySelector('.mob-nav').classList.contains('show') ) {
			document.querySelector('.mob-nav').classList.remove('show');

		} else {
			console.log('show');
		}
	});
	for (let i = 0; i < menuItem.length; i++) {
		menuItem[i].addEventListener('click', function(event) {
			if (  document.querySelector('.mob-nav').classList.contains('show') ) {
				document.querySelector('.mob-nav').classList.remove('show');
			}
			if( !document.querySelector('.navbar-toggler').classList.contains('collapsed' )){
				document.querySelector('.navbar-toggler').classList.add('collapsed');
			}
			if( body.classList.contains('mobmenu-opened') ) {
				body.classList.remove('mobmenu-opened');
			}
		});
	}
};

// Phraise slider swiper


// jQuery
(function($){
	'use strict';

	$(document).ready(function() {
		mobileMenu();

		function updSwiperNumericPagination() {
  			this.el.querySelector(".swiper-numbers").innerHTML = '<span class="count">' + (this.realIndex + 1) + '</span>/<span class="total">' + this.el.slidesQuantity + "</span>";
			}
		const phraiseSlider = document.querySelector('.slider-block-sw');
		phraiseSlider.slidesQuantity = phraiseSlider.querySelectorAll(".swiper-slide").length;
		const swiperPhraise = new Swiper( phraiseSlider, {
			speed: 500,
			slidesPerView: 1,
			loop: true,
			grabCursor: true,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			on: {
				init: updSwiperNumericPagination,
				slideChange: updSwiperNumericPagination
			}
		});

		// Contact form modal
		$('#contact-form').on('submit', function(e){

			$('#thanksModal').modal('show');
			$('#contact-form input[type="text"]').val('');
			$('#contact-form input[type="email"]').val('');
			$('#contact-form textarea').val('');
			setTimeout(function(){$('#thanksModal').modal('hide')},3000);
  			e.preventDefault();
		});
	}); // ready

	$(window).on('resize', function() {
	}); // resize

	$(window).on('load', function() {
	}); // load

	// functions
})(this.jQuery);
