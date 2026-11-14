/*
  Font Awesome as bundled inline SVG — replaces the ~100 KB CDN stylesheet + webfonts.

  Markup stays the same: <i className="fas fa-cloud" />. A small MutationObserver fills
  each <i> with its SVG and re-renders when the <i>'s class changes (e.g. sun ↔ moon).
  The <i> itself is never altered, so React keeps full ownership of it.

  Only icons registered in ICONS are bundled. When you use a new icon in JSX or in data
  (profile.js, configurations.json), add it below or it renders empty (and warns in dev).
*/
import {
  faArrowRight, faArrowTurnDown, faArrowUpRightFromSquare, faArrowsRotate, faBalanceScale,
  faBookBookmark, faBriefcase, faBullseye, faCalendarCheck, faCertificate, faChalkboardTeacher,
  faChartLine, faCheck, faCheckCircle, faChess, faChevronDown, faClock, faClockRotateLeft,
  faCloud, faCode, faCodeBranch, faCodeMerge, faCogs, faCommentDots, faComments, faCompass,
  faCompassDrafting, faCopy, faDharmachakra, faDownload, faDumbbell, faEnvelope, faEnvelopeOpen,
  faExclamationCircle, faExternalLinkAlt, faFileArrowDown, faGlobeAmericas, faGraduationCap,
  faHand, faHandsHelping, faHandshake, faHeart, faHouse, faInfinity, faKeyboard, faLayerGroup,
  faLightbulb, faLocationDot, faMapMarkerAlt, faMicrophone, faMoon, faPaperPlane, faPenNib,
  faReply, faRobot, faRocket, faRoute, faSearch, faSeedling, faShieldHalved, faSpinner, faStar,
  faSun, faTerminal, faThLarge, faTimes, faTriangleExclamation, faUserCircle, faUsers,
  faUsersCog, faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { faAws, faFacebook, faGithub, faGoogle, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faCopy as farCopy } from "@fortawesome/free-regular-svg-icons";

const SOLID = [
  faArrowRight, faArrowTurnDown, faArrowUpRightFromSquare, faArrowsRotate, faBalanceScale,
  faBookBookmark, faBriefcase, faBullseye, faCalendarCheck, faCertificate, faChalkboardTeacher,
  faChartLine, faCheck, faCheckCircle, faChess, faChevronDown, faClock, faClockRotateLeft,
  faCloud, faCode, faCodeBranch, faCodeMerge, faCogs, faCommentDots, faComments, faCompass,
  faCompassDrafting, faCopy, faDharmachakra, faDownload, faDumbbell, faEnvelope, faEnvelopeOpen,
  faExclamationCircle, faExternalLinkAlt, faFileArrowDown, faGlobeAmericas, faGraduationCap,
  faHand, faHandsHelping, faHandshake, faHeart, faHouse, faInfinity, faKeyboard, faLayerGroup,
  faLightbulb, faLocationDot, faMapMarkerAlt, faMicrophone, faMoon, faPaperPlane, faPenNib,
  faReply, faRobot, faRocket, faRoute, faSearch, faSeedling, faShieldHalved, faSpinner, faStar,
  faSun, faTerminal, faThLarge, faTimes, faTriangleExclamation, faUserCircle, faUsers,
  faUsersCog, faUtensils,
];
const BRANDS = [faAws, faFacebook, faGithub, faGoogle, faInstagram, faLinkedin];
const REGULAR = [farCopy];

// Index every definition under its canonical name and its aliases (e.g. "home" → house).
const ICONS = {};
const register = (prefix, defs) =>
  defs.forEach((def) => {
    const [, , aliases] = def.icon;
    [def.iconName, ...aliases.filter((a) => typeof a === "string")].forEach((name) => {
      ICONS[`${prefix}:${name}`] = def;
    });
  });
register("fas", SOLID);
register("fab", BRANDS);
register("far", REGULAR);

// Utility classes that are modifiers, not icon names.
const MODIFIERS = new Set(["fa-spin", "fa-fw", "fa-lg", "fa-2x", "fa-3x"]);

const toSvg = (def) => {
  const [width, height, , , path] = def.icon;
  const d = Array.isArray(path) ? path.join(" ") : path;
  return `<svg class="svg-inline--fa" viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false"><path fill="currentColor" d="${d}"></path></svg>`;
};

const renderIcon = (el) => {
  const classes = el.classList;
  const prefix = classes.contains("fab") ? "fab" : classes.contains("far") ? "far" : classes.contains("fas") ? "fas" : null;
  if (!prefix) return;
  let name = null;
  for (const c of classes) {
    if (c.startsWith("fa-") && !MODIFIERS.has(c)) {
      name = c.slice(3);
      break;
    }
  }
  const key = `${prefix}:${name}`;
  if (el.dataset.faIcon === key) return;
  const def = ICONS[key];
  if (!def) {
    if (import.meta.env.DEV) console.warn(`[icons] "${prefix} fa-${name}" is not registered in src/icons.js`);
    return;
  }
  el.dataset.faIcon = key;
  el.innerHTML = toSvg(def);
};

const SELECTOR = "i.fas, i.fab, i.far";

const scan = (root) => {
  if (root.nodeType !== 1) return;
  if (root.matches(SELECTOR)) renderIcon(root);
  root.querySelectorAll(SELECTOR).forEach(renderIcon);
};

if (typeof window !== "undefined" && typeof MutationObserver !== "undefined") {
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "attributes") scan(m.target);
      else m.addedNodes.forEach(scan);
    }
  });
  const start = () => {
    scan(document.body);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  };
  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
}
