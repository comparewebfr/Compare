export const ACCENT = "#1B4332";
export const GREEN = "#2D6A4F";
export const AMBER = "#F59E0B";
export const W = "#F8F6F0";
export const F = "'DM Sans', sans-serif";

export const CSS = `@keyframes slideFadeIn{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:translateX(0)}}
@keyframes pageFadeIn{from{opacity:0}to{opacity:1}}
@keyframes contentSlideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes subtlePulse{0%,100%{opacity:1}50%{opacity:.92}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
.page-enter{animation:contentSlideUp .4s cubic-bezier(.25,.46,.45,.94) forwards}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.skip-link{position:absolute;top:-100px;left:12px;z-index:9999;padding:12px 20px;background:#1B4332;color:#fff;font-weight:600;border-radius:8px;transition:top .2s}.skip-link:focus{top:12px;outline:2px solid #fff;outline-offset:2px}
*{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;background:#F8F6F0}
details summary::-webkit-details-marker{display:none}details summary{list-style:none}
button{transition:all .22s cubic-bezier(.25,.46,.45,.94);-webkit-tap-highlight-color:transparent}button:active{transform:scale(.98)}button:focus-visible{outline:2px solid #1B4332;outline-offset:2px}
a{transition:opacity .2s,color .2s}a:hover{opacity:.85}a:focus-visible{outline:2px solid #1B4332;outline-offset:2px;border-radius:4px}
input,select,textarea{transition:border-color .2s,box-shadow .2s}input:focus,select:focus,textarea:focus{outline:none}input:focus-visible,select:focus-visible,textarea:focus-visible{box-shadow:0 0 0 2px #1B433240}
details{transition:all .25s ease}details[open]{box-shadow:0 2px 12px rgba(0,0,0,.05)}details summary{transition:background .2s ease}details summary:hover{background:#F8F6F0}
table tr:hover td{background:rgba(0,0,0,.015)!important}
@media(hover:hover){button:hover{filter:brightness(1.04);box-shadow:0 2px 10px rgba(0,0,0,.06)}}
.card-hover{transition:transform .25s cubic-bezier(.25,.46,.45,.94),box-shadow .25s ease,border-color .2s}.card-hover:focus-visible{outline:2px solid #1B4332;outline-offset:2px}@media(hover:hover){.card-hover:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(27,67,50,.12);border-color:rgba(45,106,79,.25)}}
.btn-cta{transition:all .22s cubic-bezier(.25,.46,.45,.94);box-shadow:0 2px 12px rgba(27,67,50,.2)}@media(hover:hover){.btn-cta:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(27,67,50,.28);filter:brightness(1.06)}}
.btn-cta:active{transform:translateY(0) scale(.98)}
.pill-hover{transition:all .2s ease}@media(hover:hover){.pill-hover:hover{background:#1B433212;border-color:#1B433240;color:#1B4332}}
.link-hover{transition:color .2s}@media(hover:hover){.link-hover:hover{color:#1B4332}}
.show-mobile{display:none!important}
@media(max-width:640px){.grid-4{grid-template-columns:repeat(2,1fr)!important}.grid-3{grid-template-columns:1fr!important}.grid-2{grid-template-columns:1fr!important}.hide-mobile{display:none!important}.show-mobile{display:flex!important}.hero-title{font-size:28px!important;letter-spacing:-.02em!important}.nav-links{display:none!important}.stat-grid{grid-template-columns:repeat(2,1fr)!important}nav{padding:0 12px!important}section{padding-left:14px!important;padding-right:14px!important}
button,select{min-height:44px}
.btn-cta{padding:12px 22px!important;min-height:48px}}
`;
