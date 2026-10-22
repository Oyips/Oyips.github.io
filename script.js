
/* =========================================================
   OYIPS WEBSITE
   Main JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sessions = [
        ...document.querySelectorAll(".session")
    ];

    const navLinks = [
        ...document.querySelectorAll(".nav-link")
    ];

    const previousButton =
        document.getElementById("previousButton");

    const nextButton =
        document.getElementById("nextButton");

    const sessionNumber =
        document.getElementById("sessionNumber");

    const progressBar =
        document.getElementById("progressBar");

    const menuButton =
        document.getElementById("menuButton");

    const sideNav =
        document.getElementById("sideNav");

    const startButton =
        document.querySelector(".start-button");

    const year =
        document.getElementById("year");

    const footerYear =
        document.getElementById("footerYear");


    /* =====================================================
       CURRENT SESSION
    ===================================================== */

    let currentSession = 1;

    const totalSessions = sessions.length;


    /* =====================================================
       YEAR
    ===================================================== */

    const currentYear = new Date().getFullYear();

    if (year) {
        year.textContent = currentYear;
    }

    if (footerYear) {
        footerYear.textContent = currentYear;
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

        /* Session number */

        if (sessionNumber) {
            sessionNumber.textContent =
                String(currentSession).padStart(2, "0");
        }

        /* Progress bar */

        if (progressBar) {
            const progress =
                (currentSession / totalSessions) * 100;

            progressBar.style.width = `${progress}%`;
        }

        /* Navigation links */

        navLinks.forEach(link => {
            const linkSession =
                Number(link.dataset.session);

            const isActive =
                linkSession === currentSession;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "step");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        /* Previous button */

        if (previousButton) {
            previousButton.disabled =
                currentSession === 1;

            previousButton.style.opacity =
                currentSession === 1 ? "0.35" : "1";
        }

        /* Next button */

        if (nextButton) {
            nextButton.disabled =
                currentSession === totalSessions;

            nextButton.style.opacity =
                currentSession === totalSessions
                    ? "0.35"
                    : "1";
        }
    }


    /* =====================================================
       GO TO SESSION
    ===================================================== */

    function goToSession(number) {

        if (
            number < 1 ||
            number > totalSessions
        ) {
            return;
        }

        const target = sessions[number - 1];

        if (!target) return;

        target.scrollIntoView({
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth",
            block: "start"
        });

        updateInterface(number);
        closeMobileMenu();
    }


    /* =====================================================
       NEXT SESSION
    ===================================================== */

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            goToSession(currentSession + 1);
        });
    }


    /* =====================================================
       PREVIOUS SESSION
    ===================================================== */

    if (previousButton) {
        previousButton.addEventListener("click", () => {
            goToSession(currentSession - 1);
        });
    }


    /* =====================================================
       START BUTTON
    ===================================================== */

    if (startButton) {
        startButton.addEventListener("click", () => {
            const nextSession =
                Number(startButton.dataset.next);

            if (Number.isFinite(nextSession)) {
                goToSession(nextSession);
            }
        });
    }


    /* =====================================================
       NAVIGATION LINKS
    ===================================================== */

    navLinks.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();

            const number =
                Number(link.dataset.session);

            if (Number.isFinite(number)) {
                goToSession(number);
            }
        });
    });


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    function closeMobileMenu() {

        if (sideNav) {
            sideNav.classList.remove("open");
        }

        if (menuButton) {
            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }

    if (menuButton && sideNav) {
        menuButton.addEventListener("click", () => {

            const isOpen =
                sideNav.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        /* Close the menu with Escape */

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMobileMenu();
            }
        });
    }


    /* =====================================================
       DETECT CURRENT SESSION WHILE SCROLLING
    ===================================================== */

    if (
        sessions.length > 0 &&
        "IntersectionObserver" in window
    ) {
        const observer = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {
                    if (entry.isIntersecting) {

                        const number =
                            sessions.indexOf(entry.target) + 1;

                        if (number > 0) {
                            updateInterface(number);
                        }
                    }
                });

            },
            {
                threshold: 0.45
            }
        );

        sessions.forEach(session => {
            observer.observe(session);
        });
    }


    /* =====================================================
       KEYBOARD SESSION NAVIGATION
    ===================================================== */

    document.addEventListener("keydown", event => {

        const target = event.target;

        if (!target) return;

        const tag =
            target.tagName.toLowerCase();

        /* Don't interfere with typing or controls */

        if (
            tag === "input" ||
            tag === "textarea" ||
            tag === "select" ||
            tag === "button" ||
            target.isContentEditable
        ) {
            return;
        }

        /* Don't override arrow keys used by the poem slider */

        if (
            target.closest &&
            target.closest("#poemSlider")
        ) {
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

    const poemSlider =
        document.getElementById("poemSlider");

    const poemTrack =
        document.getElementById("poemTrack");

    const poemPrev =
        document.getElementById("poemPrev");

    const poemNext =
        document.getElementById("poemNext");

    const poemDots =
        document.getElementById("poemDots");

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

            /* Create one indicator dot per poem */

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


            /* Update slider controls and indicator */

            function updatePoemControls(index) {

                activePoem = Math.max(
                    0,
                    Math.min(index, poemCards.length - 1)
                );

                poemCurrentLabel.textContent =
                    String(activePoem + 1).padStart(2, "0");

                dots.forEach((dot, dotIndex) => {

                    const isActive =
                        dotIndex === activePoem;

                    dot.classList.toggle(
                        "is-active",
                        isActive
                    );

                    if (isActive) {
                        dot.setAttribute(
                            "aria-current",
                            "true"
                        );
                    } else {
                        dot.removeAttribute("aria-current");
                    }
                });

                poemPrev.disabled = activePoem === 0;

                poemNext.disabled =
                    activePoem === poemCards.length - 1;
            }


            /* Move to a selected poem */

            function goToPoem(index) {

                const targetIndex = Math.max(
                    0,
                    Math.min(index, poemCards.length - 1)
                );

                const targetCard =
                    poemCards[targetIndex];

                /*
                 * Calculate the card's position relative
                 * to the scrollable slider.
                 */

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


            /* Previous and next controls */

            poemPrev.addEventListener("click", () => {
                goToPoem(activePoem - 1);
            });

            poemNext.addEventListener("click", () => {
                goToPoem(activePoem + 1);
            });


            /* Update the active poem during touch/swipe/scroll */

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

                        const cardRect =
                            card.getBoundingClientRect();

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


            /* Allow keyboard users to navigate the poems */

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


            /* Keep the active poem aligned after resizing */

            let resizeTimer;

            window.addEventListener("resize", () => {

                clearTimeout(resizeTimer);

                resizeTimer = setTimeout(() => {
                    goToPoem(activePoem);
                }, 100);
            });


            /* Initial slider state */

            updatePoemControls(0);
        }
    }


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    updateInterface(1);

});
