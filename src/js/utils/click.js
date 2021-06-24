export default function click(callback) {
  if (ios()) {
    window.addEventListener("touchstart", (event) => {
      return event;
    });
  } else {
    window.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener("click", () => {
      if (this.intersects.length) {
        this.stepThree(index);
        index++;
      }
    });
  }
}
