// FORM 14.16.1 — interaction geometry stabilization for Driver Lab.
// Presentation only. Keeps answer selection from moving the control grid.
(function(){'use strict';if(window.FORM_DRIVER_LAB_STABILITY_V208)return;window.FORM_DRIVER_LAB_STABILITY_V208=true;
const s=document.createElement('style');s.id='formLabStability208';s.textContent=`
/* Reserve scrollbar space so answers that reveal extra content do not recenter the whole fitting. */
@media (min-width:821px){html{scrollbar-gutter:stable}}
/* Selection must never alter geometry. Earlier layers added translate effects to .opt.on/.opt:hover. */
#driverExperience.active:not(:has(#results.formReport100:not(.hidden))) .formLab207Content .opt,
#driverExperience.active:not(:has(#results.formReport100:not(.hidden))) .formLab207Content .opt.on,
#driverExperience.active:not(:has(#results.formReport100:not(.hidden))) .formLab207Content .metricChoice,
#driverExperience.active:not(:has(#results.formReport100:not(.hidden))) .formLab207Content .metricChoice.on,
#driverExperience.active:not(:has(#results.formReport100:not(.hidden))) .formLab207Content .multiOptions button,
#driverExperience.active:not(:has(#results.formReport100:not(.hidden))) .formLab207Content .multiOptions button.on{transform:none!important;box-sizing:border-box!important}
/* Keep grids and controls locked to their available width as content/readouts change. */
#driverExperience.active:not(:has(#results.formReport100:not(.hidden))) .formLab207Content,
#driverExperience.active:not(:has(#results.formReport100:not(.hidden))) .formLab207Content .options,
#driverExperience.active:not(:has(#results.formReport100:not(.hidden))) .formLab207Content .priorityRank,
#driverExperience.active:not(:has(#results.formReport100:not(.hidden))) .formLab207Content .lmInputs{width:100%!important;max-width:100%!important;box-sizing:border-box!important}
#driverExperience.active:not(:has(#results.formReport100:not(.hidden))) .formLab207Content .opt{width:100%!important;margin-left:0!important;margin-right:0!important}
/* Hover lift is useful with a mouse, but sticky hover on touch made taps feel like layout movement. */
@media (hover:hover) and (pointer:fine){#driverExperience.active:not(:has(#results.formReport100:not(.hidden))) .formLab207Content .opt:hover{transform:translateY(-2px)!important}}
@media (hover:none),(pointer:coarse){#driverExperience.active:not(:has(#results.formReport100:not(.hidden))) .formLab207Content .opt:hover{transform:none!important;box-shadow:0 4px 12px rgba(35,55,45,.025)!important}}
`;
document.head.appendChild(s);
})();