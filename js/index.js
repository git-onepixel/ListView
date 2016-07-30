$(function(){
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame  ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var obj = {
       init:function(){
           this.loadData();
       },

       loadData:function(){
           $.ajax({
               url:'js/city.json',
               dataType:'json',
               success:function(data){
                  this.applyHtml(data)
               }.bind(this),
               error:function(){
                   //
               }
           })
       },

       applyHtml:function(data){
           var citys = document.querySelector('#citys');

           var html = "";
           var letters = [];
           data.forEach(function(obj){
               html += [
                   '<li>',
                      '<dl>',
                          '<dt id="'+obj.Index+'" class="title">',obj.Index,'</dt>',
                           (function(){
                               var temp = "";
                               obj.Citys = obj.Citys.slice(0,15);
                               obj.Citys.forEach(function(o){
                                   temp += '<dd class="data">'+ o.Name + '</dd>'
                               });
                               return temp;
                           })(),
                      '</dl>',
                   '</li>'
               ].join('');
               letters.push()
           });
           citys.innerHTML = html;

           var bar = document.querySelector('.bar');
           var barHtml = '';
           data.forEach(function(obj){
               barHtml += [
                   '<li class="item">',obj.Index,'</li>'
               ].join('')
           });
           bar.innerHTML = barHtml;

           this.initNavLetter();
           this.initScrollBar();
           this.iOSOverflowScroll(citys)
       },

       initNavLetter:function(){
           var last = +new Date();
           var citys = document.querySelector('#citys');
           var letters = document.querySelectorAll('.title');
           var fixed = document.querySelector('.fixed');
           fixed.innerText = letters[0].innerText;
           citys.addEventListener('scroll',function(e){
               var self = this;
               requestAnimationFrame(function(){
                   var current = letters[0];
                   for (var i=0;i<letters.length;i++){
                       var p = letters[i];
                       if(p.offsetTop <= self.scrollTop){
                           if(current.offsetTop < p.offsetTop){
                               current = p;
                           }
                       }
                   }
                   fixed.innerText = current.innerText;
                   var delta = fixed.offsetHeight;
               });
           })
       },

       initScrollBar:function(){
           var bar = document.querySelector('.bar');
           var citys = document.querySelector('#citys');
           var stop = document.querySelector('.stop');

           bar.addEventListener('touchstart',function(e){
               e.preventDefault();
               this.setStopLetter(e,citys,stop);
               stop.style.display = "block";
           }.bind(this));
           bar.addEventListener('touchmove',function(e){
               e.preventDefault();
               var x = e.touches[0].pageX;
               var y = e.touches[0].pageY;
               this.setStopLetter(e,citys,stop);
               bar.style.cssText = "border-radius:999px;background:#ccc";
           }.bind(this));
           bar.addEventListener('touchend',function(e){
               bar.style.cssText = "";
               stop.style.display = "";
           });
           bar.addEventListener('touchcancel',function(e){
               bar.style.cssText = "";
               stop.style.display = "";
           })
       },

       setStopLetter:function(evt,container,stop){
           var touch = evt.touches[0];
           var X = touch.pageX;
           var Y = touch.pageY;
           var target = document.elementFromPoint(X,Y);
           if(target && target.tagName == 'LI'){
               var letter = target.innerText;
               var top = document.querySelector('#'+letter).offsetTop;
               container.scrollTop = top;
               stop.style.top = (Y-20)+"px";
               stop.innerText = letter;
           }
       },
       iOSOverflowScroll:function(targets){
               var topScroll = 0;
               if (navigator.userAgent.indexOf('Mac') > -1) {
                   targets = Array.isArray(targets) || targets instanceof NodeList ? targets : [targets];
                   for (var i = 0; i < targets.length; i++) {
                       var view = targets[i];
                       view.addEventListener('touchstart', function (e) {
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
