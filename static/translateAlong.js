function translateAlong(path) {
    let l = path.getTotalLength();
    return function(d, i, a) {
      return function(t) {

        if (d && d.i >= 0) {
          t = t + (d.i / d.siblings) + d.orbitOffset;
          while (t >= 1.) {
            t = t - 1.;
          }
        }
        var p = path.getPointAtLength(t * l);
        return `translate(${p.x}, ${p.y})`;
      };
    };
  }

function transition(element, path, duration) {
  return function exc() {
    const node = path.node();
    element.transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .attrTween("transform", translateAlong(node))
      .on("end", exc);
  }
}