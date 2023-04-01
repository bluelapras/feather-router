/**
 * A simple module which creates a unique numerical route id that increments.
 */

let ID = 0;
function generateRouteID() {
  return ID++;
}

export { generateRouteID };
