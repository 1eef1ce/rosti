$( document ).ready(function() {

    $(".header-toggler").on("click", function () {
        $(this).toggleClass("active");
        $(".header-nav").toggleClass("active");
    });

    $(".open-modal").on("click", function () {
        $(".modal").addClass("open");
    });

    $(".modal__close").on("click", function () {
        $(".modal").removeClass("open");
    });

    $(window).resize(function() {
        $(window).scroll(function(){
            if ($(window).scrollTop() >= 100){
                $('.header').addClass('sticky');
            }
            else {
                $('.header').removeClass('sticky');
            }
        });
    }).resize();

    const partnersSwiper = new Swiper('.partners__slider', {
        slidesPerView: 'auto',
        spaceBetween: 45,
        loop: true,
    });
});