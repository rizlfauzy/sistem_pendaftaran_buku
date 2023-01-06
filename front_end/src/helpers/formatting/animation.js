import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

function animate_from(elem, direction = 1) {
  var x = 0,
    y = direction * 100;
  if (elem.classList.contains("gs_trigger_from_down")) {
    x = 0;
    y = 100;
  } else if (elem.classList.contains("gs_trigger_from_left")) {
    x = -100;
    y = 0;
  } else if (elem.classList.contains("gs_trigger_from_right")) {
    x = 100;
    y = 0;
  }
  elem.style.transform = "translate(" + x + "px, " + y + "px)";
  elem.style.opacity = "0";
  gsap.fromTo(
    elem,
    { x, y, autoAlpha: 0 },
    {
      duration: 1.25,
      x: 0,
      y: 0,
      autoAlpha: 1,
      ease: "expo",
      overwrite: "auto",
      clearProps: "transform",
    }
  );
}

function hide(elem) {
  gsap.set(elem, { autoAlpha: 0 });
}

export function running_animate() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray(".gs_trigger").forEach((elem) => {
    hide(elem);
    ScrollTrigger.create({
      trigger: elem,
      markers: false,
      onEnter: () => animate_from(elem),
      onEnterBack: () => animate_from(elem, -1),
      onLeave: () => hide(elem),
    });
  });
}
