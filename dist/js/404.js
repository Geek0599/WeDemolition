(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function addLoadedClass() {
        window.addEventListener("load", (function() {
            setTimeout((function() {
                document.documentElement.classList.add("loaded");
            }), 0);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    let addWindowScrollEvent = false;
    function getElementOffset(element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        return {
            top: rect.top + scrollTop,
            left: rect.left + scrollLeft
        };
    }
    function headerScroll() {
        addWindowScrollEvent = true;
        const wrapper = document.querySelector(".wrapper");
        const header = document.querySelector("header.header");
        const headerWrapper = document.querySelector(".header__wrapper");
        const headerBtnShow = header.hasAttribute("data-scroll-show-btn");
        const btnRelativeBtn = document.querySelector("[data-header-btn-show]");
        let btnRelativeBtnShowOffsetTo = btnRelativeBtn && headerWrapper ? getElementOffset(btnRelativeBtn).top + btnRelativeBtn.offsetHeight - headerWrapper.offsetHeight : 280;
        let startPointBtnShow = headerBtnShow ? btnRelativeBtnShowOffsetTo : 1;
        const headerShow = header.hasAttribute("data-scroll-show");
        const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
        const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
        let scrollDirection = 0;
        let timer;
        document.addEventListener("windowScroll", (function(e) {
            const scrollTop = window.scrollY;
            btnRelativeBtnShowOffsetTo = btnRelativeBtn && headerWrapper ? getElementOffset(btnRelativeBtn).top + btnRelativeBtn.offsetHeight - headerWrapper.offsetHeight : 280;
            startPointBtnShow = headerBtnShow ? btnRelativeBtnShowOffsetTo : 1;
            clearTimeout(timer);
            if (scrollTop >= startPoint) {
                !header.classList.contains("_header-scroll") ? header.classList.add("_header-scroll") : null;
                !wrapper.classList.contains("_header-scroll") ? wrapper.classList.add("_header-scroll") : null;
                if (headerShow) {
                    if (scrollTop > scrollDirection) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null; else !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    timer = setTimeout((() => {
                        !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    }), headerShowTimer);
                }
            } else {
                header.classList.contains("_header-scroll") ? header.classList.remove("_header-scroll") : null;
                wrapper.classList.contains("_header-scroll") ? wrapper.classList.remove("_header-scroll") : null;
                if (headerShow) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
            }
            if (headerBtnShow) if (scrollTop >= startPointBtnShow) !header.classList.contains("_header-show-btn") ? header.classList.add("_header-show-btn") : null; else header.classList.contains("_header-show-btn") ? header.classList.remove("_header-show-btn") : null;
            scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
        }));
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    isWebp();
    addLoadedClass();
    menuInit();
    headerScroll();
    function formValidate() {
        const validateForms = document.querySelectorAll("[data-validate]");
        if (validateForms.length) validateForms.forEach((form => {
            const inputs = form.querySelectorAll("input,select,textarea");
            const btnSubmit = form.querySelector('button[type="submit"]') ? form.querySelector('button[type="submit"]') : document.querySelector(`button[form="${form.id}"]`);
            if (inputs.length) {
                form.addEventListener("submit", (e => {
                    e.preventDefault();
                }));
                btnSubmit && btnSubmit.addEventListener("click", (() => {
                    checkInputs(inputs, form);
                }));
                inputs.forEach((input => {
                    if ([ "text", "number", "email", "textarea" ].includes(input.type)) input.addEventListener("input", (() => {
                        checkInput(input);
                    })); else input.addEventListener("change", (() => {
                        checkInput(input);
                    }));
                }));
            }
        }));
        function checkInputs(inputs, form) {
            let errors = 0;
            inputs.forEach((input => {
                if (checkInput(input)) errors++;
            }));
            errors === 0 ? form.submit() : null;
        }
        function checkInput(input) {
            if (input.required) {
                let isError = false;
                const value = input.value;
                if (input.value !== "") removeError(input); else isError = addError(input);
                if (input.hasAttribute("data-num-format")) if (parseFloat(value) > 0) removeError(input); else isError = addError(input);
                if (input.type === "email" && emailTest(input)) isError = addError(input);
                if (input.hasAttribute("data-minlength") && value.length < input.dataset.minlength) isError = addError(input);
                if (input.hasAttribute("data-maxlenght") && value.length > input.dataset.maxlenght) isError = addError(input);
                if (input.inputmask) if (input.inputmask.isComplete()) removeError(input); else isError = addError(input);
                return isError;
            }
        }
        function addError(input) {
            input.classList.remove("_validated");
            input.classList.add("_no-validated");
            return true;
        }
        function removeError(input) {
            input.classList.remove("_no-validated");
            input.classList.add("_validated");
        }
        function emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    }
    formValidate();
})();