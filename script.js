
/* =========================================================
   OYIPS WEBSITE
   Main JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sessions = [...document.querySelectorAll(".session")];
    const navLinks = [...document.querySelectorAll(".nav-link")];

    const previousButtons = [
        ...document.querySelectorAll("#previousButton, .prev-button")
    ].filter((button, index, buttons) =>
        buttons.indexOf(button) === index
    );

    const nextButton = document.getElementById("nextButton");
    const sessionNumber = document.getElementById("sessionNumber");
    const progressBar = document.getElementById("progressBar");
    const menuButton = document.getElementById("menuButton");
    const sideNav = document.getElementById("sideNav");
    const startButton = document.querySelector(".start-button");
    const year = document.getElementById("year");
    const footerYear = document.getElementById("footerYear");

    /* =====================================================
       CURRENT SESSION
    ===================================================== */

    let currentSession = 1;
    const totalSessions = sessions.length;

    /* =====================================================
       YEAR
    ===================================================== */

    const currentYear = new Date().getFullYear();

    if (year) year.textContent = currentYear;
    if (footerYear) footerYear.textContent = currentYear;

    /* =====================================================
       MOBILE MENU
    ===================================================== */

    function closeMobileMenu() {
        if (sideNav) sideNav.classList.remove("open");

        if (menuButton) {
            menuButton.setAttribute("aria-expanded", "false");
        }
    }

    if (menuButton && sideNav) {
        menuButton.addEventListener("click", () => {
            const isOpen = sideNav.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMobileMenu();
            }
        });
    }

    /* =====================================================
       UPDATE SESSION INTERFACE
    ===================================================== */

    function updateInterface(number) {
        if (totalSessions === 0) return;

        currentSession = Math.max(
            1,
            Math.min(number, totalSessions)
        );

        if (sessionNumber) {
            sessionNumber.textContent =
                String(currentSession).padStart(2, "0");
        }

        if (progressBar) {
            progressBar.style.width =
                `${(currentSession / totalSessions) * 100}%`;
        }

        navLinks.forEach(link => {
            const linkSession = Number(link.dataset.session);
            const isActive = linkSession === currentSession;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "step");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        previousButtons.forEach(button => {
            const targetSession = button.dataset.prev !== undefined
                ? Number(button.dataset.prev)
                : currentSession - 1;

            const isDisabled =
                targetSession < 1 ||
                targetSession > totalSessions;

            button.disabled = isDisabled;
            button.style.opacity = isDisabled ? "0.35" : "1";
        });

        if (nextButton) {
            const isLastSession =
                currentSession === totalSessions;

            nextButton.disabled = isLastSession;
            nextButton.style.opacity =
                isLastSession ? "0.35" : "1";
        }
    }

    /* =====================================================
       GO TO SESSION
    ===================================================== */

    function goToSession(number) {
        if (number < 1 || number > totalSessions) return;

        const target = sessions[number - 1];
        if (!target) return;

        updateInterface(number);
        closeMobileMenu();

        target.scrollIntoView({
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth",
            block: "start"
        });
    }

    /* =====================================================
       PREVIOUS SESSION
    ===================================================== */

    previousButtons.forEach(button => {
        button.addEventListener("click", () => {
            /*
             * If data-prev is present, use that exact session.
             * Otherwise, move back one session.
             */
            const targetSession = button.dataset.prev !== undefined
                ? Number(button.dataset.prev)
                : currentSession - 1;

            goToSession(targetSession);
        });
    });

    /* =====================================================
       NEXT SESSION
    ===================================================== */

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            goToSession(currentSession + 1);
        });
    }

    /* =====================================================
       START BUTTON
    ===================================================== */

    if (startButton) {
        startButton.addEventListener("click", () => {
            const targetSession = Number(startButton.dataset.next);

            if (Number.isFinite(targetSession)) {
                goToSession(targetSession);
            }
        });
    }

    /* =====================================================
       SIDE NAVIGATION LINKS
    ===================================================== */

    navLinks.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();

            const number = Number(link.dataset.session);

            if (Number.isFinite(number)) {
                goToSession(number);
            }
        });
    });

    /* =====================================================
       DETECT CURRENT SESSION WHILE SCROLLING
    ===================================================== */

    if (sessions.length > 0 && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const number = sessions.indexOf(entry.target) + 1;

                    if (number > 0) {
                        updateInterface(number);
                    }
                }
            });
        }, {
            threshold: 0.45
        });

        sessions.forEach(session => observer.observe(session));
    }

    /* =====================================================
       KEYBOARD SESSION NAVIGATION
    ===================================================== */

    document.addEventListener("keydown", event => {
        const target = event.target;
        if (!target) return;

        const tag = target.tagName.toLowerCase();

        if (
            tag === "input" ||
            tag === "textarea" ||
            tag === "select" ||
            tag === "button" ||
            target.isContentEditable
        ) {
            return;
        }

        if (target.closest && target.closest("#poemSlider")) {
            return;
        }

        if (
            event.key === "ArrowRight" ||
            event.key === "PageDown"
        ) {
            event.preventDefault();
            goToSession(currentSession + 1);
        }

        if (
            event.key === "ArrowLeft" ||
            event.key === "PageUp"
        ) {
            event.preventDefault();
            goToSession(currentSession - 1);
        }
    });

    /* =====================================================
       ART & PHILOSOPHY — POEM SLIDER
    ===================================================== */

    const poemSlider = document.getElementById("poemSlider");
    const poemTrack = document.getElementById("poemTrack");
    const poemPrev = document.getElementById("poemPrev");
    const poemNext = document.getElementById("poemNext");
    const poemDots = document.getElementById("poemDots");

    const poemCurrentLabel =
        document.querySelector(".poem-current-slide");

    if (
        poemSlider &&
        poemTrack &&
        poemPrev &&
        poemNext &&
        poemDots &&
        poemCurrentLabel
    ) {
        const poemCards = [
            ...poemTrack.querySelectorAll(".poem-card")
        ];

        if (poemCards.length > 0) {
            let activePoem = 0;
            let scrollFrame = null;
            let resizeTimer;

            poemDots.replaceChildren();

            const dots = poemCards.map((card, index) => {
                const dot = document.createElement("button");

                dot.type = "button";
                dot.className = "poem-dot";
                dot.setAttribute(
                    "aria-label",
                    `Go to poem ${index + 1}`
                );

                dot.addEventListener("click", () => {
                    goToPoem(index);
                });

                poemDots.appendChild(dot);
                return dot;
            });

            function updatePoemControls(index) {
                activePoem = Math.max(
                    0,
                    Math.min(index, poemCards.length - 1)
                );

                poemCurrentLabel.textContent =
                    String(activePoem + 1).padStart(2, "0");

                dots.forEach((dot, dotIndex) => {
                    const isActive = dotIndex === activePoem;

                    dot.classList.toggle("is-active", isActive);

                    if (isActive) {
                        dot.setAttribute("aria-current", "true");
                    } else {
                        dot.removeAttribute("aria-current");
                    }
                });

                poemPrev.disabled = activePoem === 0;
                poemNext.disabled =
                    activePoem === poemCards.length - 1;
            }

            function goToPoem(index) {
                const targetIndex = Math.max(
                    0,
                    Math.min(index, poemCards.length - 1)
                );

                const targetCard = poemCards[targetIndex];

                const sliderRect =
                    poemSlider.getBoundingClientRect();

                const cardRect =
                    targetCard.getBoundingClientRect();

                const targetLeft =
                    poemSlider.scrollLeft +
                    cardRect.left -
                    sliderRect.left;

                poemSlider.scrollTo({
                    left: targetLeft,
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth"
                });

                updatePoemControls(targetIndex);
            }

            poemPrev.addEventListener("click", () => {
                goToPoem(activePoem - 1);
            });

            poemNext.addEventListener("click", () => {
                goToPoem(activePoem + 1);
            });

            poemSlider.addEventListener("scroll", () => {
                if (scrollFrame !== null) {
                    cancelAnimationFrame(scrollFrame);
                }

                scrollFrame = requestAnimationFrame(() => {
                    const sliderRect =
                        poemSlider.getBoundingClientRect();

                    const sliderCenter =
                        sliderRect.left +
                        poemSlider.clientWidth / 2;

                    let closestIndex = 0;
                    let closestDistance = Infinity;

                    poemCards.forEach((card, index) => {
                        const cardRect = card.getBoundingClientRect();

                        const cardCenter =
                            cardRect.left + cardRect.width / 2;

                        const distance =
                            Math.abs(cardCenter - sliderCenter);

                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestIndex = index;
                        }
                    });

                    updatePoemControls(closestIndex);
                    scrollFrame = null;
                });
            }, { passive: true });

            poemSlider.addEventListener("keydown", event => {
                if (event.key === "ArrowRight") {
                    event.preventDefault();
                    goToPoem(activePoem + 1);
                }

                if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    goToPoem(activePoem - 1);
                }
            });

            window.addEventListener("resize", () => {
                clearTimeout(resizeTimer);

                resizeTimer = setTimeout(() => {
                    goToPoem(activePoem);
                }, 100);
            });

            updatePoemControls(0);
        }
    }

    /* =====================================================
       INITIAL STATE
    ===================================================== */

    updateInterface(1);

});
