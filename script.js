/* const chatSections = document.querySelectorAll('.liveChat');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
});

chatSections.forEach(section => observer.observe(section));

document.querySelectorAll('.liveChat').forEach(section => {
    section.querySelectorAll('p').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.6}s`;
    });
}); */


//Claude
document.querySelectorAll('.liveChat').forEach(section => {
    const paragraphs = section.querySelectorAll('p');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(paragraphs).indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
                entry.target.classList.add('in-view');
            }
        });
    }, {
        rootMargin: '0px 0px -200px 0px'
    });

    paragraphs.forEach(p => observer.observe(p));
});

const hourTrack = document.querySelector('#clockHourTrack');
let currentHour = 7;

function setHour(newHour) {
    if (newHour === currentHour) return;

    hourTrack.querySelectorAll('.digit.leaving').forEach(d => d.remove());

    const oldDigit = hourTrack.querySelector('.digit:not(.leaving)');
    if (oldDigit) {
        oldDigit.classList.add('leaving');
        oldDigit.style.transform = 'translateY(-100%)';
        setTimeout(() => oldDigit.remove(), 500);
    }

    const newDigit = document.createElement('span');
    newDigit.classList.add('digit');
    newDigit.textContent = newHour;
    newDigit.style.transform = 'translateY(100%)';
    hourTrack.appendChild(newDigit);

    newDigit.getBoundingClientRect();
    newDigit.style.transform = 'translateY(0)';

    currentHour = newHour;
}

const zeroHourEl = document.querySelector('#zeroHour');

function updateClock() {
    const targetScroll = zeroHourEl.offsetTop;
    const scrollPercent = Math.min(1, window.scrollY / targetScroll);
    const hoursLeft = Math.max(0, Math.ceil(7 - (scrollPercent * 7)));
    setHour(hoursLeft);
}

let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateClock();
            ticking = false;
        });
        ticking = true;
    }
});

async function typeLine(p, speed = 60, keepCursor = false) {
    const promptSpan = p.querySelector('.prompt');
    const sourceContent = document.createElement('div');
    sourceContent.innerHTML = p.innerHTML;
    if (promptSpan) {
        sourceContent.querySelector('.prompt')?.remove();
    }

    p.textContent = '';
    if (promptSpan) p.appendChild(promptSpan);
    p.classList.add('typing-cursor', 'typed');

    await typeNode(p, sourceContent, speed);

    if (!keepCursor) {
        p.classList.remove('typing-cursor');
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function typeNode(parentEl, sourceNode, speed) {
        for (const child of Array.from(sourceNode.childNodes)) {
            if (child.nodeType === Node.TEXT_NODE) {
                const textNode = document.createTextNode('');
                parentEl.appendChild(textNode);
                const cleanedText = child.textContent.replace(/\s+/g, ' ');
                for (const char of cleanedText) {
                    textNode.textContent += char;
                    await sleep(speed);
                }
            }
        }
    }
}

async function typeConsole(consoleEl) {
    const lines = consoleEl.querySelectorAll('p');
    for (const line of lines) {
        await typeLine(line);
    }
}

const consoleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            typeConsole(entry.target);
            consoleObserver.unobserve(entry.target);
        }
    });
});

document.querySelectorAll('.console').forEach(section => {
    consoleObserver.observe(section);
});

const endLine = document.querySelector('#end p');

const endObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            typeLine(entry.target, 80, true);
            endObserver.unobserve(entry.target);
        }
    });
});

if (endLine) {
    endObserver.observe(endLine);
}