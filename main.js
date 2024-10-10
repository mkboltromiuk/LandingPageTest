import { navScroll } from './anime';

navScroll();

gsap.registerPlugin(MotionPathPlugin);
// Funkcja do tworzenia animacji dla danego elementu i ścieżki
function createAnimation(elementId, pathId) {
    const tl = gsap.timeline();

    tl.set(
        elementId,
        {
            opacity: 1,
        },
        '-=1'
    )
        .to(
            elementId,
            {
                duration: 5,
                opacity: 1,
                delay: 0.5,
                repeat: -1,
                repeatDelay: 3,
                motionPath: {
                    path: pathId,
                    align: pathId,
                    alignOrigin: [0.5, 0.5],
                },
            },
            '-=1'
        )
        .to(
            elementId,
            {
                delay: 2,
                repeatDelay: 7,
                repeat: -1,
                opacity: 0,
            },
            '-=1'
        );

    return tl;
}

function createAnimation2(elementId, pathId) {
    const tl2 = gsap.timeline();

    tl2.set(elementId, { delay: 6, opacity: 1 }, '-=1')
        .to(
            elementId,
            {
                duration: 5,
                opacity: 1,
                delay: 1,
                repeat: -1,
                repeatDelay: 3,
                motionPath: {
                    path: pathId,
                    align: pathId,
                    alignOrigin: [0.5, 0.5],
                },
            },
            '-=1'
        )
        .to(
            elementId,
            {
                delay: 2,
                repeatDelay: 7,
                repeat: -1,
                opacity: 0,
            },
            '-=1'
        );

    return tl2;
}

// Tworzenie animacji dla poszczególnych elementów
for (let i = 1; i <= 4; i++) {
    // Zmiana na i = 1 do 13
    const anime = createAnimation(`#cr${i}`, `#path${i}`); // Poprawka w selektorze
}

for (let i = 5; i <= 12; i++) {
    // Zmiana na i = 1 do 13
    const anime2 = createAnimation2(`#cr${i}`, `#path${i}`); // Poprawka w selektorze
}
