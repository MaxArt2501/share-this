!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.ShareThis=t()}(this,function(){"use strict";function e(e){return{left:e.pageXOffset,top:e.pageYOffset}}function t(e,t){return v||(v=o(e)),e[v](t)}function n(e,n){for(var r=e;r&&(1!==r.nodeType||!t(r,n));)r=r.parentNode;return r}function r(e,t){var n=e.compareDocumentPosition(t);return!n||(16&n)>0}function o(e){for(var t=["matches","matchesSelector","webkitMatchesSelector","mozMatchesSelector","msMatchesSelector","oMatchesSelector"],n=0;n<t.length;n++){var r=t[n];if(e[r])return r}}function i(e,t){for(var n=0;n<e.length;n++){var r=e[n];if(r.name===t)return r}}function a(e,t){if(t&&"object"===("undefined"==typeof t?"undefined":m(t)))for(var n in t)e[n]=t[n];return e}function c(e){return"function"==typeof e}function f(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function u(e){if(e.isCollapsed)return!0;var t=e.anchorNode.compareDocumentPosition(e.focusNode);return t?(4&t)>0:e.anchorOffset<e.focusOffset}function l(e,t){var n=void 0,r=e.getClientRects();if(t){for(var o=1/0,i=r.length;i--;){var a=r[i];if(a.left>o)break;o=a.left}n=g.call(r,i+1)}else{for(var c=-(1/0),u=0;u<r.length;u++){var l=r[u];if(l.right<c)break;c=l.right}n=g.call(r,0,u)}return{top:Math.min.apply(Math,f(n.map(function(e){return e.top}))),bottom:Math.max.apply(Math,f(n.map(function(e){return e.bottom}))),left:n[0].left,right:n[n.length-1].right}}function s(e,t){var o=e.cloneRange();if(e.collapsed||!t)return o;var i=n(e.startContainer,t);return i?r(i,e.endContainer)||o.setEnd(i,i.childNodes.length):(i=n(e.endContainer,t),i?o.setStart(i,0):o.collapse()),o}function p(t,n,r){var o=r.document,i=o.defaultView,a=i.getSelection(),c=u(a),f=l(n,c),s=e(i),p=t.style;c?p.right=o.documentElement.clientWidth-f.right-s.left+"px":p.left=s.left+f.left+"px",p.width=f.right-f.left+"px",p.height=f.bottom-f.top+"px",p.top=s.top+f.top+"px",p.position="absolute",t.className=r.popoverClass}function d(e,t){var r=n(t.target,"["+y+"]");if(r){var o=r.getAttribute(y),a=i(e,o);a&&c(a.action)&&a.action(t,r)}}function h(e){return{createPopover:function(){var t=e.createElement("div");return t.addEventListener("click",function(e){d(this.sharers,e)}),t},attachPopover:function(t){e.body.appendChild(t)},removePopover:function(e){var t=e.parentNode;t&&t.removeChild(e)}}}var v=void 0,m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},g=Array.prototype.slice,y="data-share-via",b=function(e,t,n,r){var o=e.shareUrl||e.document.defaultView.location;return"<ul>"+t.map(function(e){return'<li data-share-via="'+e.name+'">'+e.render.call(e,n,r,o)+"</li>"}).join("")+"</ul>"},S=void 0,C=["selectionchange","mouseup","touchend","touchcancel"],M=function(e){function t(e){g.addEventListener(e,r)}function n(e){g.removeEventListener(e,r)}function r(e){var t=e.type,n="selectionchange"===t;!y!==n&&setTimeout(function(){var e=o();e?i(e):f()},10)}function o(){var e=m(),t=e.rangeCount&&e.getRangeAt(0);if(t){var n=s(t,l.selector);if(!n.collapsed)return n}}function i(e){var t=!y,n=e.toString(),r=l.transformer(n),o=l.sharers.filter(u.bind(null,r,n));return o.length?(t&&(y=M.createPopover()),y.sharers=o,y.innerHTML=b(l,o,r,n),p(y,e,l),void(t&&(M.attachPopover(y),c(l.onOpen)&&l.onOpen(y,r,n)))):void(y&&f())}function f(){y&&(M.removePopover(y),y=S,c(l.onClose)&&l.onClose())}function u(e,t,n){return c(n.active)?n.active(e,t):n.active===S||n.active}var l=(Object.assign||a)({document:document,selector:"body",sharers:[],popoverClass:"share-this-popover",transformer:function(e){return e.trim().replace(/\s+/g," ")}},e||{}),d=!1,v=!1,m=S,g=S,y=S,M=S;return{init:function(){return!d&&(g=l.document,(m=g.defaultView.getSelection)?(C.forEach(t),M=h(g),d=!0):(console.warn("share-this: Selection API isn't supported"),!1))},destroy:function(){return!(!d||v)&&(C.forEach(n),f(),m=S,g=S,v=!0)}}};return M});