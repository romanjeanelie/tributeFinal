export default function getOrientation() {
  var orientation = window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
  if (window.innerWidth < 800) {
    return orientation;
  }
}
