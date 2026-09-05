// FORM 14.8.1 — activate unified shortlist story after the existing results pipeline.
// No observers, no rescoring, no reordering.
(function(){'use strict';
if(window.FORM_RESULTS_SHORTLIST_ACTIVATE_V192)return;window.FORM_RESULTS_SHORTLIST_ACTIVATE_V192=true;
function run(){try{return typeof window.FORM_APPLY_RESULTS_SHORTLIST_STORY_V191==='function'&&window.FORM_APPLY_RESULTS_SHORTLIST_STORY_V191()}catch(e){return false}}
function hook(name){const prior=window[name];if(typeof prior!=='function')return;window[name]=function(){const out=prior.apply(this,arguments);try{run()}catch(e){}return out;};}
hook('FORM_APPLY_RESULTS_CLARITY_V190');
hook('FORM_APPLY_RESULTS_STORY_V188');
hook('FORM_APPLY_RESULTS_NARRATIVE_V186');
try{run()}catch(e){}
})();