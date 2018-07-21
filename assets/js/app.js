let projects = null;
let experiences = null;
let skills = null;
let itemWidth = 0;

let portfolio = {
    loadAnimationSkillBar:function() {
        $('.skillbar').each(function(){
            $(this).find('.skillbar-bar').animate({
                width:$(this).attr('data-percent')
            },3000);
        });

        $('.load-text').html("Skill Bar Loaded...");
    },
    stickyToggle:function (sticky, scrollElement) {
        let stickyTop = $('.header-bg').outerHeight() / 2;
        if (scrollElement.scrollTop() >= stickyTop) {
            sticky.removeClass("is-sticky");
            sticky.addClass("not-sticky");
        }
        else {
            sticky.removeClass("not-sticky");
            sticky.addClass("is-sticky");
        }
    },
    loadSkills:function() {
      let skillView = $("#about");
        $.getJSON("data/skills.json", function (exp) {
            let it_view = skillView.find('.skills-it');
            let lang_view = skillView.find('.skills-lang');
            skills = exp;
            $.each(exp, function (index, value) {
                let content = `<div class="skillbar clearfix " data-percent="${value.percentage}"> <div class="skillbar-title"><span>${value.name}</span></div> <div class="skillbar-bar"></div> <div class="skill-bar-percent">${value.percentage}</div> </div> `;
                if (value.type === "IT") {
                    it_view.append(content);
                } else {
                    lang_view.append(content);
                }
            });

            portfolio.loadAnimationSkillBar();
        });
    },
    loadProject: function(limit) {
        let projectView = $('#portfolio').find('.portfolio-content');

        $.getJSON("/data/portfolio.json", function (exp) {
            projects = exp;
            $.each(exp, function (index, value) {
                let image = value.data.images.length > 0 ? value.data.images[0] : '/assets/img/portfolio-2.jpg';
                let view = `<div class="col-lg-4 col-md-6 col-sm-8 offset-md-0 offset-sm-2 portfolio-list"><div class="card-view card-7"><img src="${image}" class="img portfolio-img img-responsive"><div class="card-name">${value.project_name}</div><div class="card-icons"><a class="btn btn-primary button-view" data-id="${index}">View</a></div></div></div>`
                projectView.append(view);

                if (limit != null && (limit-1) === index) {
                    return false;
                }
            });
        });

        $('.load-text').html("Projects Loaded...");
    },
    loadExperiences:function() {
        let expView = $("#experience").find(".cd-horizontal-timeline");

        $.getJSON("data/exp_data.json", function (exp) {
            experiences = exp;
            let events = expView.find('.timeline .events-wrapper .events');
            let contents = expView.find('.events-content ol');
            let lastIndex = exp.length - 1;
            $.each(exp, function (index, value) {
                let view = `<li><a href='#' data-date='${value.real_date}' class='${index == lastIndex ? `selected` : ``}'>${value.date}</a></li>`;
                events.find('ol').append(view);

                let content = `<li data-date='${value.real_date}' class='${index == lastIndex ? `selected` : ``}'><h2>${value.title}</h2><span>${value.sub_title}</span><em>${value.formatted_date}</em><pre>${value.text}</pre></li>`;

                contents.append(content);
            });

            triggerAnimatedTimeline();

            $('.load-text').html("Experiences Loaded...");
        });
    },
    executeParticleJs:function() {
        $.getJSON('data/particles.json', function (exp) {
            $('.particles-js').each(function (e) {
                $(this).attr('id', 'particle-' + e);
                particlesJS('particle-' + e, exp);
            });
            $('.load-text').html("Particles Loaded...");
        });
    },
    cognitoDoneLoad: function() {
        portfolio.doneLoadPage("Cognito Form Loaded...");
    },
    doneLoadPage:function (text) {
        $('.load-text').html(text == null ? "Final Touch Up..." : text);
        setTimeout(function () {
            $(".loading").addClass("loading-end").fadeOut(1000);
        }, 1000);
    },
    resCarousel: function(e, el, s) {
        let leftBtn = ('.leftLst');
        let rightBtn = ('.rightLst');
        let translateXval = '';
        let divStyle = $(el + ' ' + '.multi-carousel-inner').css('transform');
        let values = divStyle.match(/-?[\d\.]+/g);
        let xds = Math.abs(values[4]);
        if (e == 0) {
            translateXval = parseInt(xds) - parseInt(itemWidth * s);
            $(el + ' ' + rightBtn).removeClass("over");

            if (translateXval <= itemWidth / 2) {
                translateXval = 0;
                $(el + ' ' + leftBtn).addClass("over");
            }
        }
        else if (e == 1) {
            let itemsCondition = $(el).find('.multi-carousel-inner').width() - $(el).width();
            translateXval = parseInt(xds) + parseInt(itemWidth * s);
            $(el + ' ' + leftBtn).removeClass("over");

            if (translateXval >= itemsCondition - itemWidth / 2) {
                translateXval = itemsCondition;
                $(el + ' ' + rightBtn).addClass("over");
            }
        }
        $(el + ' ' + '.multi-carousel-inner').css('transform', 'translateX(' + -translateXval + 'px)');
    },
    resCarouselSize: function() {
        let incno = 0;
        let dataItems = ("data-items");
        let itemClass = ('.mc-item');
        let id = 0;
        let btnParentSb = '';
        let itemsSplit = '';
        let sampwidth = $('.multi-carousel').width();
        let bodyWidth = $('body').width();
        $('.multi-carousel-inner').each(function () {
            id = id + 1;
            let itemNumbers = $(this).find(itemClass).length;
            btnParentSb = $(this).parent().attr(dataItems);
            itemsSplit = btnParentSb.split(',');
            $(this).parent().attr("id", "multi-carousel" + id);

            if (bodyWidth >= 1200) {
                incno = itemsSplit[3];
                itemWidth = sampwidth / incno;
            }
            else if (bodyWidth >= 992) {
                incno = itemsSplit[2];
                itemWidth = sampwidth / incno;
            }
            else if (bodyWidth >= 768) {
                incno = itemsSplit[1];
                itemWidth = sampwidth / incno;
            }
            else {
                incno = itemsSplit[0];
                itemWidth = sampwidth / incno;
            }
            console.log(sampwidth);

            $(this).css({ 'transform': 'translateX(0px)', 'width': itemWidth * itemNumbers });
            $(this).find(itemClass).each(function () {
                $(this).outerWidth(itemWidth);
                $(this).outerHeight(itemWidth);
            });

            $(".leftLst").addClass("over");
            $(".rightLst").removeClass("over");
        });
    },
    multiCarouselClick: function(ell, ee) {
        let Parent = "#" + $(ee).parent().attr("id");
        let slide = $(Parent).attr("data-slide");
        portfolio.resCarousel(ell, Parent, slide);
    },
    executeMagnificPopup: function () {
        $('.zoom-gallery').magnificPopup({
            delegate: 'a',
            type: 'image',
            closeOnContentClick: false,
            fixedContentPos: false,
            closeBtnInside: false,
            mainClass: 'mfp-with-zoom mfp-img-mobile',
            image: {
                verticalFit: true,
                titleSrc: function(item) {
                    return '<a class="image-source-link" href="'+item.el.attr('href')+'" target="_blank">Click to Open</a>';
                }
            },
            gallery: {
                enabled: true
            },
            zoom: {
                enabled: true,
                duration: 300,
                opener: function(element) {
                    return element.find('img');
                }
            }
        });
    }
};

$('[data-toggle="sticky-onscroll"]').each(function () {
    let sticky = $(this);
    sticky.addClass('sticky');

    $(window).on('scroll.sticky-onscroll resize.sticky-onscroll', function () {
        portfolio.stickyToggle(sticky, $(this));
    });
    portfolio.stickyToggle(sticky, $(window));
});

$('#portfolio .portfolio-content').on('click', '.portfolio-list .button-view', function () {
    let modal = $('#projectModal');
    let self = $(this);
    let project = null;
    $.each(projects, function (index, value) {
        if (self.data('id') === index) {
            project = value;
        }
    });
    if (project != null) {
        modal.find('.modal-title').html(project.project_name);
        modal.find('.modal-body .description-section').html(project.data.description);
        let carousel = modal.find('.modal-body .multi-carousel');
        if (project.data.images.length > 0) {
            carousel.show();
            modal.find('.zoom-gallery').empty();
            $.each(project.data.images, function (index, value) {
                let content = `<div class="mc-item"><div class="pad15"><a href="${value}"><img src="${value}" class="img img-responsive"></a></div></div>`;
                modal.find('.zoom-gallery').append(content);
            });
        } else {
            carousel.hide();
        }
        modal.modal('show');
    }
});

$('#projectModal').on('shown.bs.modal', function () {
    portfolio.resCarouselSize();
    portfolio.executeMagnificPopup();
});

$('.leftLst, .rightLst').click(function () {
    let condition = $(this).hasClass("leftLst");
    if (condition)
        portfolio.multiCarouselClick(0, this);
    else
        portfolio.multiCarouselClick(1, this)
});

$(window).resize(function () {
    portfolio.resCarouselSize();
});

