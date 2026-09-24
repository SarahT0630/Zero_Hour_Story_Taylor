const chatSections = document.querySelectorAll('.liveChat');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
});

chatSections.forEach(section => observer.observe(section));

document.querySelectorAll('.liveChat p').forEach((el, index) => {
    el.style.animationDelay = `${index * 0.3}s`;
});