// const vantaEffect = VANTA.WAVES({
//   el: "#vanta-canvas",
//   mouseControls: false,
//   touchControls: false,
//   gyroControls: false,
//   minHeight: 200.0,
//   minWidth: 200.0,
//   scale: 1,
//   scaleMobile: 1.0,
//   color: 0x00001,
//   shininess: 10.0,
//   waveHeight: 6.5,
//   zoom: 1.1,
// });

// Function to create a glitchy effect by varying the shininess
function glitchShininess() {
  const minShininess = 15;
  const maxShininess = 25;

  // Generate a random shininess value within the range
  const randomShininess =
    Math.random() * (maxShininess - minShininess) + minShininess;

  // Apply the new shininess value to the VANTA effect
  // vantaEffect.setOptions({ shininess: randomShininess });

  // Schedule the next glitch effect
  setTimeout(glitchShininess, Math.random() * 300); // Random interval between glitches
}

// Start the glitch effect loop
// glitchShininess();

document.addEventListener("DOMContentLoaded", function () {
  const glitchText = document.getElementById("glitch-text");
  const textContent = glitchText.textContent;
  glitchText.innerHTML = "";

  // Split the text into individual span elements
  textContent.split("").forEach((char) => {
    const span = document.createElement("span");
    span.classList.add("glitch-char");
    span.textContent = char;
    glitchText.appendChild(span);
  });

  const glitchChars = document.querySelectorAll(".glitch-char");

  function randomizeOpacity() {
    glitchChars.forEach((char) => {
      char.style.opacity = Math.random(); // Random opacity for each character
      setTimeout(() => {
        char.style.opacity = 1; // Settle to full opacity after random time
      }, Math.random() * 2000); // Random delay before settling
    });
  }

  randomizeOpacity();
});

const items__faq = document.querySelectorAll(".accordion__faq button");

function toggleAccordion__faq() {
  const itemToggle__faq = this.getAttribute("aria-expanded");

  for (let i = 0; i < items__faq.length; i++) {
    items__faq[i].setAttribute("aria-expanded", "false");
  }

  if (itemToggle__faq == "false") {
    this.setAttribute("aria-expanded", "true");
  }
}

items__faq.forEach((item__faq) =>
  item__faq.addEventListener("click", toggleAccordion__faq)
);
