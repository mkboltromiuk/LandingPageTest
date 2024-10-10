/// Scroll trigger gsap

export function navScroll() {
    const navbar = document.querySelectorAll('.all');

    navbar.forEach((all) => {
        all.addEventListener('click', (event) => {
            event.preventDefault();
            let item = event.target.textContent.toLowerCase();
            item = item.replace(/\s/g, '');
            console.log(item);

            ///let section = document.querySelector(`#${item}`);

            gsap.to(window, {
                duration: 1,
                scrollTo: `#${item}`,
            });

            console.log(section);
        });
    });
}
