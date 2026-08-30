/* =========================================================
   AZKA MAULANA PORTFOLIO
   External JavaScript
========================================================= */

(() => {
    "use strict";

    const heroInner = document.querySelector(".hero-inner");
    const heroTitle = document.querySelector(".hero-title");
    const heroDescription = document.querySelector(".hero-description");
    const heroPhoto = document.querySelector(".hero-photo");

    if (
        !heroInner ||
        !heroTitle ||
        !heroDescription ||
        !heroPhoto
    ) {
        return;
    }

    const mobileQuery =
        window.matchMedia("(max-width: 600px)");


    /* =====================================================
       SYNCHRONIZE HERO PHOTO WIDTH
       
       Mobile:
       - Measure actual H1 width
       - Measure actual paragraph width
       - Use the wider one
       - Apply that width to the photo
       
       Desktop:
       - Return width control to CSS
    ===================================================== */

    const syncHeroPhoto = () => {

        if (!mobileQuery.matches) {

            heroPhoto.style.removeProperty("width");
            heroPhoto.style.removeProperty("max-width");

            return;
        }


        const titleWidth =
            heroTitle.getBoundingClientRect().width;


        const paragraphWidth =
            heroDescription.getBoundingClientRect().width;


        const availableWidth =
            heroInner.getBoundingClientRect().width;


        /*
         * Use the larger rendered width between
         * H1 and paragraph.
         */
        const contentWidth =
            Math.min(
                Math.max(
                    titleWidth,
                    paragraphWidth
                ),
                availableWidth
            );


        /*
         * Apply the calculated width to the
         * photo container.
         */
        heroPhoto.style.width =
            `${Math.ceil(contentWidth)}px`;

        heroPhoto.style.maxWidth =
            `${Math.ceil(contentWidth)}px`;
    };


    /* =====================================================
       WAIT FOR FONT
       
       Important because the actual H1 width depends
       on the loaded Inter font.
    ===================================================== */

    const initialize = async () => {

        try {

            if (document.fonts) {
                await document.fonts.ready;
            }

        } catch (error) {

            console.warn(
                "Font loading warning:",
                error
            );

        }


        requestAnimationFrame(
            syncHeroPhoto
        );
    };


    /* =====================================================
       OBSERVE H1 + PARAGRAPH
       
       Recalculate automatically when their dimensions
       change.
    ===================================================== */

    const resizeObserver =
        new ResizeObserver(() => {

            requestAnimationFrame(
                syncHeroPhoto
            );

        });


    resizeObserver.observe(heroTitle);
    resizeObserver.observe(heroDescription);


    /* =====================================================
       WINDOW RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        syncHeroPhoto,
        {
            passive: true
        }
    );


    /* =====================================================
       MOBILE / DESKTOP BREAKPOINT CHANGE
    ===================================================== */

    if (
        typeof mobileQuery.addEventListener ===
        "function"
    ) {

        mobileQuery.addEventListener(
            "change",
            syncHeroPhoto
        );

    }


    /* =====================================================
       START
    ===================================================== */

    initialize();

})();

const contactEmail = document.querySelector(".contact-email");

if (contactEmail) {
    contactEmail.addEventListener("click", (event) => {
        event.preventDefault();

        const email = contactEmail.dataset.email;

        const subject = "Portfolio Inquiry";

        const body = `Hello Azka,

I would like to discuss a project with you.

Best regards,`;

        const gmailUrl =
            `https://mail.google.com/mail/?view=cm&fs=1` +
            `&to=${encodeURIComponent(email)}` +
            `&su=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(body)}`;

        window.open(
            gmailUrl,
            "_blank",
            "noopener,noreferrer"
        );
    });
}

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);

        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message")
        };

        try {
            const response = await fetch(
                "http://localhost:3000/api/contact",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            alert("Message sent successfully!");
            contactForm.reset();

        } catch (error) {
            console.error(error);
            alert("Failed to send message.");
        }
    });
}