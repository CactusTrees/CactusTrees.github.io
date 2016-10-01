// Returns the smallest circle that contains the specified circles.
export default function(circles) {
  return enclosingCircleIntersectingCircles(randomizedList(circles), []);
};

// Returns a linked list from the specified array in random order.
function randomizedList(array) {
  var i,
      n = (array = array.slice()).length,
      head = null,
      node = head;

  while (n) {
    var next = {id: array.length - n, value: array[n - 1], next: null};
    if (node) node = node.next = next;
    else node = head = next;
    array[i] = array[--n];
  }

  return {head: head, tail: node};
}

// Returns the smallest circle that contains the circles L
// and intersects the circles B.
function enclosingCircleIntersectingCircles(L, B) {
  var circle,
      l0 = null,
      l1 = L.head,
      l2,
      p1;

  switch (B.length) {
    case 1: circle = B[0]; break;
    case 2: circle = circleIntersectingTwoCircles(B[0], B[1]); break;
    case 3: circle = circleIntersectingThreeCircles(B[0], B[1], B[2]); break;
  }

  while (l1) {
    p1 = l1.value, l2 = l1.next;
    if (!circle || !circleContainsCircle(circle, p1)) {

      // Temporarily truncate L before l1.
      if (l0) L.tail = l0, l0.next = null;
      else L.head = L.tail = null;

      B.push(p1);
      circle = enclosingCircleIntersectingCircles(L, B); // Note: reorders L!
      B.pop();

      // Move l1 to the front of L and reconnect the truncated list L.
      if (L.head) l1.next = L.head, L.head = l1;
      else l1.next = null, L.head = L.tail = l1;
      l0 = L.tail, l0.next = l2;

    } else {
      l0 = l1;
    }
    l1 = l2;
  }

  L.tail = l0;
  return circle;
}

// Returns true if the specified circle1 contains the specified circle2.
function circleContainsCircle(circle1, circle2) {
  var xc0 = circle1.x - circle2.x,
      yc0 = circle1.y - circle2.y;
  return Math.sqrt(xc0 * xc0 + yc0 * yc0) < circle1.r - circle2.r + 1e-6;
}

// Returns the smallest circle that intersects the two specified circles.
function circleIntersectingTwoCircles(circle1, circle2) {
  var x1 = circle1.x, y1 = circle1.y, r1 = circle1.r,
      x2 = circle2.x, y2 = circle2.y, r2 = circle2.r,
      x12 = x2 - x1, y12 = y2 - y1, r12 = r2 - r1,
      l = Math.sqrt(x12 * x12 + y12 * y12);
  return {
    x: (x1 + x2 + x12 / l * r12) / 2,
    y: (y1 + y2 + y12 / l * r12) / 2,
    r: (l + r1 + r2) / 2
  };
}

// Returns the smallest circle that intersects the three specified circles.
function circleIntersectingThreeCircles(circle1, circle2, circle3) {
  var x1 = circle1.x, y1 = circle1.y, r1 = circle1.r,
      x2 = circle2.x, y2 = circle2.y, r2 = circle2.r,
      x3 = circle3.x, y3 = circle3.y, r3 = circle3.r,
      a2 = 2 * (x1 - x2),
      b2 = 2 * (y1 - y2),
      c2 = 2 * (r2 - r1),
      d2 = x1 * x1 + y1 * y1 - r1 * r1 - x2 * x2 - y2 * y2 + r2 * r2,
      a3 = 2 * (x1 - x3),
      b3 = 2 * (y1 - y3),
      c3 = 2 * (r3 - r1),
      d3 = x1 * x1 + y1 * y1 - r1 * r1 - x3 * x3 - y3 * y3 + r3 * r3,
      ab = a3 * b2 - a2 * b3,
      xa = (b2 * d3 - b3 * d2) / ab - x1,
      xb = (b3 * c2 - b2 * c3) / ab,
      ya = (a3 * d2 - a2 * d3) / ab - y1,
      yb = (a2 * c3 - a3 * c2) / ab,
      A = xb * xb + yb * yb - 1,
      B = 2 * (xa * xb + ya * yb + r1),
      C = xa * xa + ya * ya - r1 * r1,
      r = (-B - Math.sqrt(B * B - 4 * A * C)) / (2 * A);
  return {
    x: xa + xb * r + x1,
    y: ya + yb * r + y1,
    r: r
  };
}
