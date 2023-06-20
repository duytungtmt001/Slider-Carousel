const slider = document.querySelector('.slider')
const wrapper = document.querySelector('.wrapper');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

const wrapItems = document.querySelectorAll(".wrap-item");
const slides = document.querySelectorAll('.slide');
const slideDots = document.querySelectorAll('.dot');


// Set default Slider
let currentImage;
slides.forEach((slide, index) => {
    if(slide.classList.contains('slide-active')) {
        currentImage = index
    }
})
const imageDefaultWidth = 700;
wrapper.style.transform = `translateX(-${currentImage * imageDefaultWidth}px)`;

wrapItems.forEach((wrap) => {
    wrap.addEventListener("transitionend", (e) => {
        e.stopPropagation();
    });
});


// Handle click
const handleNext = (event) => {
    currentImage++;
    
    if(currentImage <= slideDots.length + 1) {
        handleClickDot(slideDots[currentImage-2])
    } else {
        handleClickDot(slideDots[0]);
    }
    
    document.querySelector('.slide.slide-active').classList.remove('slide-active');
    slides[currentImage].classList.add("slide-active");
    if (currentImage >= slides.length / 2 + 1) {
        slides[2].classList.add("slide-active");
    }

    const transformWidth = currentImage * imageDefaultWidth;
    wrapper.style.transition = `all ease .5s`;
    wrapper.style.transform = `translateX(-${transformWidth}px)`;
    next.removeEventListener("click", handleNext);
}

const handlePrev = () => {
    currentImage--;
    
    if(currentImage >= 2) {
        handleClickDot(slideDots[currentImage - 2]);
    } else {
        handleClickDot(slideDots[slideDots.length - 1]);
    }
    
    document.querySelector('.slide.slide-active').classList.remove('slide-active');
    slides[currentImage].classList.add("slide-active");
    if (currentImage <= 1) {
        slides[slides.length/2].classList.add("slide-active");
    }
    
    const transformWidth = currentImage * imageDefaultWidth;
    wrapper.style.transition = `all ease .5s`; 
    wrapper.style.transform = `translateX(-${transformWidth}px)`;
    prev.removeEventListener("click", handlePrev);
}


const handleTransionEnd = () => {
    next.addEventListener("click", handleNext);
    prev.addEventListener("click", handlePrev);
    wrapper.addEventListener("mousedown", handleMouseDown);
    
    if (currentImage >= (slides.length)/2 + 1) {
        currentImage = 2;
        wrapper.style.transition = `none`;
        wrapper.style.transform = `translateX(-${currentImage * imageDefaultWidth}px)`;
        document.querySelectorAll('.slide.slide-active')[1].classList.remove('slide-active');
    }
    
    if(currentImage <= 1) {
        currentImage = slides.length/2;
        document.querySelector('.slide.slide-active').classList.remove('slide-active');
        slides[currentImage].classList.add("slide-active");
        wrapper.style.transition = `none`;
        wrapper.style.transform = `translateX(-${currentImage * imageDefaultWidth}px)`;
    }
};

next.addEventListener("click", handleNext);

prev.addEventListener('click', handlePrev)

wrapper.addEventListener("transitionend", handleTransionEnd);


// Handle click Dots

const handleClickDot = (dot) => {
    document.querySelector(".dot.active").classList.remove('active')
    dot.classList.add("active");
}

slideDots.forEach((dot, index) => {
    dot.onclick = () => {
        handleClickDot(dot)
        currentImage = index + 2;
        document.querySelector('.slide.slide-active').classList.remove('slide-active');
        slides[currentImage].classList.add("slide-active");
        wrapper.style.transition = `all ease .5s`;
        wrapper.style.transform = `translateX(-${currentImage * imageDefaultWidth}px)`;
    }
})


// Handle drag mouse

let isDown = false;
let isUp = true;
let dragDistance;
let startX;
let wrapperTransfromDefault = currentImage * imageDefaultWidth;

const handleTransform = () => {
    if (dragDistance >= 200) {
        wrapper.removeEventListener("mousedown", handleMouseDown);
        next.click();
        wrapperTransfromDefault = currentImage * imageDefaultWidth;
    } else if (dragDistance <= -200) {
        wrapper.removeEventListener("mousedown", handleMouseDown);
        prev.click();
        wrapperTransfromDefault = currentImage * imageDefaultWidth;
    } else {
        wrapper.style.transition = `all ease .5s`;
        wrapper.style.transform = `translateX(-${currentImage * imageDefaultWidth}px)`;
    } 
    dragDistance = 0;
}

const handleMouseLeave = () => {
    isDown = false;
    if(!isUp) {
        isUp = true;
        handleTransform();
    }
}

const handleMouseUp = () => {
    isUp = true;
    isDown = false;
    handleTransform();
    wrapper.style.cursor = "auto";
}

const handleMouseDown = (e) => {
    isUp = false;
    isDown = true;
    startX = e.pageX;
    wrapperTransfromDefault = currentImage * imageDefaultWidth;
};

const handleMouseMove = (e) => {
    if (!isDown) {
        return;
    }
    
    e.preventDefault();
    const mouseX = e.pageX;
    dragDistance = startX - mouseX;

    Object.assign(wrapper.style, {
        cursor: "grab",
        transition: "all ease .05s",
        transform: `translateX(-${wrapperTransfromDefault + dragDistance}px)`
    })
};

wrapper.addEventListener("mousedown", handleMouseDown);
wrapper.addEventListener("mousemove", handleMouseMove);
wrapper.addEventListener("mouseleave", handleMouseLeave);
wrapper.addEventListener("mouseup", handleMouseUp);



