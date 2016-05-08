$(function(){
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
                               //obj.Citys = obj.Citys.slice(0,10)
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
       },

       initNavLetter:function(){
           var section = document.querySelector('section');
           var letters = document.querySelectorAll('.title');
           var fixed = document.querySelector('.fixed');
           section.addEventListener('scroll',function(e){
               var current = letters[0];
               for (var i=0;i<letters.length;i++){
                   var p = letters[i];
                   if(p.offsetTop <= this.scrollTop){
                       if(current.offsetTop < p.offsetTop){
                           current = p;
                       }
                   }
               }
               fixed.innerText = current.innerText;
           })
       },

       initScrollBar:function(){
           var bar = document.querySelector('.bar');
           var section = document.querySelector('section');

           bar.addEventListener('touchstart',function(e){
               e.preventDefault();
               this.setStopLetter(e,section);
           }.bind(this));
           bar.addEventListener('touchmove',function(e){
               e.preventDefault();
               this.setStopLetter(e,section);
               bar.style.cssText = "border-radius:999px;background:#ccc"
           }.bind(this));
           bar.addEventListener('touchend',function(e){
               bar.style.cssText = ""
           });
           bar.addEventListener('touchcancel',function(e){
               bar.style.cssText = ""
           })
       },

       setStopLetter:function(evt,container){
           var touch = evt.touches[0];
           var X = touch.pageX;
           var Y = touch.pageY;
           var target = document.elementFromPoint(X,Y);
           if(target && target.tagName == 'LI'){
               var letter = target.innerText;
               var top = document.querySelector('#'+letter).offsetTop;
               container.scrollTop = top;
           }
       }
   };
   obj.init();
})
