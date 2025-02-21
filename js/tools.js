$(document).ready(function() {

    $('.landwash-techs-list-header-item').click(function() {
        var curItem = $(this);
        if (!curItem.hasClass('active')) {
            $('.landwash-techs-list-header-item.active').removeClass('active');
            curItem.addClass('active');
            var curIndex = $('.landwash-techs-list-header-item').index(curItem);
            $('.landwash-techs-list-tab.active').removeClass('active');
            $('.landwash-techs-list-tab').eq(curIndex).addClass('active');
        }
    });

    $('.landwash-design-hint').click(function() {
        var curHint = $(this);
        if (curHint.hasClass('open')) {
            curHint.removeClass('open');
        } else {
            $('.landwash-design-hint.open').removeClass('open');
            curHint.addClass('open');
        }
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.landwash-design-hint').length == 0 && !$(e.target).hasClass('landwash-design-hint')) {
            $('.landwash-design-hint.open').removeClass('open');
        }
    });

    $('.landwash-welcome-links a, .landwash-menu-item a').click(function(e) {
        var curBlock = $($(this).attr('href'));
        if (curBlock.length == 1) {
            var curHeaderHeight = 0;
            if ($('.site-header').length == 1) {
                curHeaderHeight = $('.site-header').height();
            }
            $('html, body').animate({'scrollTop': curBlock.offset().top - curHeaderHeight}, 1000);
        }
        e.preventDefault();
    });

    $('.landwash-config-filter-slider .landwash-config-slider').each(function() {
        var curSlider = $(this);
        var curRange = curSlider.find('.landwash-config-slider-range-inner')[0];
        var curStartFrom = Number(curSlider.find('.landwash-config-slider-min').html());
        if (Number(curSlider.find('.landwash-config-slider-from').val()) !== 0) {
            curStartFrom = Number(curSlider.find('.landwash-config-slider-from').val());
        }
        var curStartTo = Number(curSlider.find('.landwash-config-slider-max').html());
        if (Number(curSlider.find('.landwash-config-slider-to').val()) !== 0) {
            curStartTo = Number(curSlider.find('.landwash-config-slider-to').val());
        }
        noUiSlider.create(curRange, {
            start: [curStartFrom, curStartTo],
            connect: true,
            range: {
                'min': Number(curSlider.find('.landwash-config-slider-min').html()),
                'max': Number(curSlider.find('.landwash-config-slider-max').html())
            },
            step: Number(curSlider.find('.landwash-config-slider-step').html()),
            tooltips: [wNumb({thousand: ''}), wNumb({thousand: ''})],
            format: wNumb({
                decimals: 0
            })
        });
        curRange.noUiSlider.on('update', function(values, handle) {
            if (handle == 0) {
                curSlider.find('.landwash-config-slider-from').val(values[handle]);
            } else {
                curSlider.find('.landwash-config-slider-to').val(values[handle]);
            }
        });
        curRange.noUiSlider.on('end', function(values, handle) {
            landwashUpdateConfig();
        });
    });

    $('.landwash-config-filter-block input').change(function() {
        landwashUpdateConfig();
    });

    var landwashConfigListSwiper = null;

    function landwashUpdateConfig() {
        $('.landwash-config-list').each(function() {
            var curSlider = $(this);
            if (curSlider.hasClass('swiper-initialized')) {
                landwashConfigListSwiper.destroy();
            }

            var configColor = [];
            $('.landwash-config-filter-block-color input:checked').each(function() {
                configColor.push($(this).val());
            });
            var configDepth = [Number($('.landwash-config-slider-from').val()), Number($('.landwash-config-slider-to').val())];
            var configWeight = 99;
            $('.landwash-config-filter-block-weight input:checked').each(function() {
                configWeight = Number($(this).val());
            });
            var configSpeed = [];
            $('.landwash-config-filter-block-speed input:checked').each(function() {
                configSpeed.push($(this).val());
            });
            if (configSpeed.length > 0) {
            }

            var configProdose = false;
            if ($('.landwash-config-filter-block-prodose input:checked').length == 1) {
                configProdose = true;
            }
            var configSteamassist = false;
            if ($('.landwash-config-filter-block-steamassist input:checked').length == 1) {
                configSteamassist = true;
            }
            var configWatercare = false;
            if ($('.landwash-config-filter-block-watercare input:checked').length == 1) {
                configWatercare = true;
            }

            var newHTML = '';
            for (var i = 0; i < landwashConfigData.length; i++) {
                var curItem = landwashConfigData[i];
                if (
                    (configColor.length == 0 || configColor.indexOf(curItem.color) != -1) &&
                    ((configDepth[0] <= Number(curItem.depth)) && (Number(curItem.depth) <= configDepth[1])) &&
                    (Number(curItem.weight) <= configWeight) &&
                    (configSpeed.length == 0 || configSpeed.indexOf(curItem.speed) != -1) &&
                    (!configProdose || curItem.prodose) &&
                    (!configSteamassist || curItem.steamassist) &&
                    (!configWatercare || curItem.watercare)
                    ) {
                        newHTML +=  '<div class="landwash-config-list-item swiper-slide">' +
                                        '<a href="' + curItem.url + '" class="landwash-config-list-item-link">' +
                                            '<div class="landwash-config-list-item-preview"><img src="' + curItem.preview + '" alt="' + curItem.title + '"></div>' +
                                            '<div class="landwash-config-list-item-title">' + curItem.title + '</div>' +
                                            '<div class="landwash-config-list-item-detail"><span>Показать</span></div>' +
                                        '</a>' +
                                    '</div>';
                }
            }
            if (newHTML == '') {
                newHTML +=  '<div class="landwash-config-list-item swiper-slide">' +
                                '<div class="landwash-config-list-item-link">' +
                                    '<div class="landwash-config-list-item-preview landwash-config-list-item-preview-placeholder"><img src="' + landwashConfigPlaceholder.img + '" alt=""></div>' +
                                    '<div class="landwash-config-list-item-placeholder-title">' + landwashConfigPlaceholder.title + '</div>' +
                                    '<div class="landwash-config-list-item-placeholder-text">' + landwashConfigPlaceholder.text + '</div>' +
                                '</div>' +
                            '</div>';
            }
            $('.landwash-config-list-inner').html(newHTML);

            landwashConfigListSwiper = new Swiper(curSlider[0], {
                touchAngle: 30,
                slidesPerView: 1,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                }
            });
        });
    }

    landwashUpdateConfig();

    $('.landwash-config-filter-link a').click(function(e) {
        $('body').data('curScroll', $(window).scrollTop());
        $('html').addClass('landwash-config-filter-open');
        e.preventDefault();
    });

    $('.landwash-config-filter-close').click(function(e) {
        $('html').removeClass('landwash-config-filter-open');
        $(window).scrollTop($('body').data('curScroll'));
        e.preventDefault();
    });

    $('.landwash-config-filter-cancel').click(function(e) {
        $('.landwash-config-slider-range-inner')[0].noUiSlider.set([Number($('.landwash-config-slider-min').html()), Number($('.landwash-config-slider-max').html())]);
        $('.landwash-config-filter-block input:checked').prop('checked', false).trigger('change');
        $('.landwash-config-filter-block-color .landwash-config-filter-block-radios input').eq(0).prop('checked', true).trigger('change');
        $('.landwash-config-filter-block-weight .landwash-config-filter-block-radios input:last').prop('checked', true).trigger('change');
        $('.landwash-config-filter-close').trigger('click');
        e.preventDefault();
    });

    $('.landwash-config-filter-apply').click(function(e) {
        $('.landwash-config-filter-close').trigger('click');
        e.preventDefault();
    });

    $('.landwash-products-list').each(function() {
        var curSlider = $(this);
        var swiper = new Swiper(curSlider[0], {
            touchAngle: 30,
            slidesPerView: 1,
            breakpoints: {
                1220: {
                    slidesPerView: 4
                }
            },
            navigation: {
                nextEl: '.landwash-products-content .swiper-button-next',
                prevEl: '.landwash-products-content .swiper-button-prev',
            },
        });
    });

});

var landwashProgrammsSwiper = null;

$(window).on('load resize', function() {

    $('.landwash-techs-programms-list').each(function() {
        var curSlider = $(this);
        if (curSlider.hasClass('swiper-initialized')) {
            landwashProgrammsSwiper.destroy();
        }
        if ($(window).width() < 1220) {
            landwashProgrammsSwiper = new Swiper('.landwash-techs-programms-list', {
                slidesPerView: 'auto',
                freeMode: true,
                watchSlidesProgress: true,
                scrollbar: {
                    el: '.swiper-scrollbar',
                }
            });
        }
    });

});