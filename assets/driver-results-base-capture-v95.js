// FORM 9.5 — capture the underlying results renderer before experience wrappers.
(function(){
  'use strict';
  if(!window.__FORM_BASE_SHOW_RESULTS && typeof window.showResults==='function'){
    window.__FORM_BASE_SHOW_RESULTS=window.showResults;
  }
})();
