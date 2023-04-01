/**
 * Generates the regex which will match a given path
 */
function generatePathRegex(unparsedPath: string) {
  // Regex for splitting the path up
  const PATH_PARSE_REGEX = /(?:\/([^/]+))+?/g;
  // /books/[id]/view => MATCH: books [id] view
  const pathSegments = Array.from(unparsedPath.matchAll(PATH_PARSE_REGEX), (match) => match[1]);
  // pathSegments looks like ["books", "[id]", "view"]

  const DYNAMIC_SEGMENT_REGEX = /\[(?<param_name>.+?)\]/g;
  // [id] => MATCH: id

  let regexString = "^";
  pathSegments.forEach((segment) => {
    regexString += "\\/";
    if (segment.match(DYNAMIC_SEGMENT_REGEX)) {
      const PARAM_NAME = Array.from(segment.matchAll(DYNAMIC_SEGMENT_REGEX))[0].groups?.param_name;
      regexString += `(?<${PARAM_NAME}>[^/]+?)`;
    } else {
      regexString += escapeString(segment);
    }
  });
  regexString += "$";
  return RegExp(regexString, "i");
}

/**
 * Escape a regular expression string.
 */
// Adapted from: https://github.com/pillarjs/path-to-regexp/blob/master/src/index.ts#L418-L423
function escapeString(str: string) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}

export { generatePathRegex };
