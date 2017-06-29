$(function() {
    if (!Date.now)
        Date.now = function() { return new Date().getTime(); };

    (function() {
        'use strict';

        var vendors = ['webkit', 'moz'];
        for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
            var vp = vendors[i];
            window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = (window[vp + 'CancelAnimationFrame'] ||
                window[vp + 'CancelRequestAnimationFrame']);
        }
        if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
            ||
            !window.requestAnimationFrame || !window.cancelAnimationFrame) {
            var lastTime = 0;
            window.requestAnimationFrame = function(callback) {
                var now = Date.now();
                var nextTime = Math.max(lastTime + 16, now);
                return setTimeout(function() { callback(lastTime = nextTime); },
                    nextTime - now);
            };
            window.cancelAnimationFrame = clearTimeout;
        }
    }());

    var obj = {
        init: function() {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                this.hideHeadView();
            }
            this.loadData();
        },

        loadData: function() {
            $.ajax({
                url: 'js/city.json',
                dataType: 'json',
                success: function(data) {
                    this.applyHtml(data)
                }.bind(this),
                error: function() {
                    //
                }
            })
        },

        scroller: null,

        scrollTop: 0,

        applyHtml: function(data) {
            var citys = document.querySelector('#citys');

            var html = "";
            var letters = [];
            data.forEach(function(obj) {
                html += [
                    '<li>',
                    '<dl>',
                    '<dt id="' + obj.Index + '" class="title">', obj.Index, '</dt>',
                    (function() {
                        var temp = "";
                        obj.Citys = obj.Citys.slice(0, parseInt(Math.random() * 10) + 5);
                        obj.Citys.forEach(function(o) {
                            temp += '<dd class="data">' + o.Name + '</dd>'
                        });
                        return temp;
                    })(),
                    '</dl>',
                    '</li>'
                ].join('');
                letters.push()
            });
            citys.innerHTML = html;
            var li = document.createElement('li');
            li.style.cssText = "text-align: center;font-size: 0.9em;color: #717171;padding: 10px 0 60px";
            li.innerText = "没有更多数据了！";
            citys.appendChild(li);

            var bar = document.querySelector('.bar');
            var barHtml = '';
            data.forEach(function(obj) {
                barHtml += [
                    '<li class="item">', obj.Index, '</li>'
                ].join('')
            });

            bar.innerHTML = barHtml;

            this.initNavLetter();
            this.initScrollBar();
            this.iOSOverflowScroll(citys);
        },

        hideHeadView: function() {
            document.querySelector('header').style.display = "none";
            document.querySelector('section').style.height = "100%";
        },

        checkCount: 0,

        isFirst: true,

        setFixed: function() {
            var current = window.letters[0];
            for (var i = 0; i < window.letters.length; i++) {
                var p = letters[i];
                if (p.offsetTop <= this.scroller.scrollTop) {
                    if (current.offsetTop < p.offsetTop) {
                        current = p;
                    }
                }
            }
            window.fixed.innerText = current.innerText;
        },

        render: function() {
            console.log('xxxx');
            this.setFixed()

            var nowTop = this.scroller.scrollTop;
            if (nowTop == this.scrollTop) {
                this.checkCount++;
            } else {
                this.checkCount = 0;
            }
            if (this.checkCount < 5) {
                this.scrollTop = nowTop;
                requestAnimationFrame(this.render.bind(this))
            } else {
                this.checkCount = 0;
                this.isFirst = true;
                //cancelAnimationFrame()
            }
        },

        initNavLetter: function() {
            var scope = this;
            var citys = document.querySelector('#citys');
            this.scroller = citys;
            var letters = document.querySelectorAll('.title');
            var fixed = document.querySelector('.fixed');

            //window.citys = citys;
            window.letters = letters;
            window.fixed = fixed;



            fixed.innerText = letters[0].innerText;
            var timer = null;

            //this.isFirst = true;

            citys.addEventListener('scroll', function(e) {
                var self = this;
                if (scope.isFirst) {
                    requestAnimationFrame(scope.render.bind(scope));
                    scope.isFirst = false;
                }

                requestAnimationFrame(function() {
                    // var current = letters[0];
                    // for (var i = 0; i < letters.length; i++) {
                    //     var p = letters[i];
                    //     if (p.offsetTop <= self.scrollTop) {
                    //         if (current.offsetTop < p.offsetTop) {
                    //             current = p;
                    //         }
                    //     }
                    // }
                    // fixed.innerText = current.innerText;
                    var delta = fixed.offsetHeight;
                });

                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function() {
                    this.isHide = false;
                    requestAnimationFrame(this.showFooterBar)
                }.bind(scope), 500);
            });
            var X, Y, isMove, target;
            citys.addEventListener('touchstart', function(e) {
                var touch = e.touches[0];
                X = touch.pageX;
                Y = touch.pageY;

                target = e.target;
                isMove = false;
                setTimeout(function() {
                    if (!isMove && target.tagName == 'DD') {
                        target.style.background = "#d6d6d6";
                    }
                }, 100)
            }.bind(this));
            citys.addEventListener('touchmove', function(e) {
                var touch = e.touches[0];
                var deltaX = Math.abs(X - touch.pageX);
                var deltaY = Math.abs(Y - touch.pageY);
                if (deltaX < deltaY && Y > touch.pageY && !this.isHide) {
                    this.isHide = true;
                    requestAnimationFrame(this.hideFooterBar)
                }
                if (!isMove) {
                    target.style.background = "";
                    isMove = true;
                }
            }.bind(this));
            citys.addEventListener('touchend', function(e) {
                if (!isMove && target.tagName == 'DD') {
                    setTimeout(function() {
                        target.style.background = "";
                        isMove = false;
                        alert('您已选择：' + target.innerText)
                    }, 300)
                }
            });
            citys.addEventListener('touchcancel', function(e) {
                target.style.background = "";
                isMove = false;
            })
        },

        showFooterBar: function() {
            var footer = document.querySelector('#footerbar');
            footer.style.webkitTransform = "translateY(0%)";
        },

        hideFooterBar: function() {
            var footer = document.querySelector('#footerbar');
            footer.style.webkitTransform = "translateY(100%)";
        },

        initScrollBar: function() {
            var bar = document.querySelector('.bar');
            var citys = document.querySelector('#citys');
            var stop = document.querySelector('.stop');
            var X = 0;
            bar.addEventListener('touchstart', function(e) {
                e.preventDefault();
                X = e.touches[0].pageX;
                this.setStopLetter(e, citys, stop, X);
                stop.style.display = "block";
            }.bind(this));
            bar.addEventListener('touchmove', function(e) {
                e.preventDefault();
                this.setStopLetter(e, citys, stop, X);
            }.bind(this));
            bar.addEventListener('touchend', function(e) {
                bar.style.cssText = "";
                stop.style.display = "";
            });
            bar.addEventListener('touchcancel', function(e) {
                bar.style.cssText = "";
                stop.style.display = "";
            })
        },

        setStopLetter: function(evt, container, stop, X) {
            var touch = evt.touches[0];
            var Y = touch.pageY;
            var target = document.elementFromPoint(X, Y);
            if (target && target.tagName == 'LI') {
                var letter = target.innerText;
                var top = document.querySelector('#' + letter);
                if (top) {
                    container.scrollTop = top.offsetTop;
                    stop.style.top = (Y - 20) + "px";
                    stop.innerText = letter;
                }
            }
        },
        iOSOverflowScroll: function(targets) {
            var topScroll = 0;
            if (navigator.userAgent.indexOf('Mac') > -1) {
                targets = Array.isArray(targets) || targets instanceof NodeList ? targets : [targets];
                for (var i = 0; i < targets.length; i++) {
                    var view = targets[i];
                    view.addEventListener('touchstart', function(e) {
                        topScroll = this.scrollTop;
                        if (topScroll <= 0) {
                            this.scrollTop = 1
                        }
                        if (topScroll + this.offsetHeight >= this.scrollHeight) {
                            this.scrollTop = topScroll - 1
                        }
                    }, false)
                }
            }
        }
    };
    obj.init();
})
