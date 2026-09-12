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


    /* =====================================================
       CURRENT SESSION
    ===================================================== */

    let currentSession = 1;

    const totalSessions = sessions.length;


    /* =====================================================
       YEAR
    ===================================================== */

    year.textContent =
        new Date().getFullYear();


    /* =====================================================
       UPDATE UI
    ===================================================== */

    function updateInterface(number) {

        currentSession = number;


        /* Session number */

        sessionNumber.textContent =
            String(number).padStart(2, "0");


        /* Progress */

        const progress =
            (number / totalSessions) * 100;

        progressBar.style.width =
            `${progress}%`;


        /* Navigation */

        navLinks.forEach(link => {

            const linkSession =
                Number(link.dataset.session);

            link.classList.toggle(
                "active",
                linkSession === number
            );

        });


        /* Previous button */

        previousButton.disabled =
            number === 1;

        previousButton.style.opacity =
            number === 1 ? "0.35" : "1";


        /* Next button */

        nextButton.disabled =
            number === totalSessions;

        nextButton.style.opacity =
            number === totalSessions
                ? "0.35"
                : "1";

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

        const target =
            sessions[number - 1];

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        updateInterface(number);

        closeMobileMenu();
    }


    /* =====================================================
       NEXT
    ===================================================== */

    nextButton.addEventListener(
        "click",
        () => {

            goToSession(
                currentSession + 1
            );

        }
    );


    /* =====================================================
       PREVIOUS
    ===================================================== */

    previousButton.addEventListener(
        "click",
        () => {

            goToSession(
                currentSession - 1
            );

        }
    );


    /* =====================================================
       START BUTTON
    ===================================================== */

    if (startButton) {

        startButton.addEventListener(
            "click",
            () => {

                const nextSession =
                    Number(
                        startButton.dataset.next
                    );

                goToSession(nextSession);

            }
        );

    }


    /* =====================================================
       NAVIGATION LINKS
    ===================================================== */

    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const number =
                    Number(link.dataset.session);

                goToSession(number);

            }
        );

    });


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    function closeMobileMenu() {

        sideNav.classList.remove("open");

    }


    menuButton.addEventListener(
        "click",
        () => {

            sideNav.classList.toggle("open");

        }
    );


    /* =====================================================
       DETECT CURRENT SESSION WHILE SCROLLING
    ===================================================== */

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        const number =
                            Number(
                                entry
                                    .target
                                    .dataset
                                    .session
                            );

                        updateInterface(number);

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


    /* =====================================================
       KEYBOARD NAVIGATION
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            /*
             Ignore keyboard navigation when
             the user is typing in an input.
            */

            const tag =
                event.target.tagName.toLowerCase();

            if (
                tag === "input" ||
                tag === "textarea"
            ) {
                return;
            }


            /* Right arrow / Page Down */

            if (
                event.key === "ArrowRight" ||
                event.key === "PageDown"
            ) {

                goToSession(
                    currentSession + 1
                );

            }


            /* Left arrow / Page Up */

            if (
                event.key === "ArrowLeft" ||
                event.key === "PageUp"
            ) {

                goToSession(
                    currentSession - 1
                );

            }

        }
    );


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    updateInterface(1);

});