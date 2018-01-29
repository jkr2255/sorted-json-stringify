// assume trimmed in index.js
const parseArray = lines => {
  const items = [];
  while (1) {
    const item = linedJSONToAST(lines);
    if (!item) break;
    items.push(item);
  }
  return {type: 'array', items};
};

const parseObjectItem = lines => {
  const trimmed = lines.shift();
  if (trimmed === '}') return false;
  const matches = /^("(?:[^\\"]|\\.)*"): (.+)$/.exec(trimmed);
  const key = matches[1];
  let value = matches[2];
  if (value === '[') value = parseArray(lines);
  else if (value === '{') value = parseObject(lines);
  else value = parseScalar(value);
  return {key, value};
};

const parseObject = lines => {
  const items = [];
  while (1) {
    const item = parseObjectItem(lines);
    if (!item) break;
    items.push(item);
  }
  return {type: 'object', items};
};

const parseScalar = trimmed => {
  return {type: 'scalar', value: trimmed};
};

export default function linedJSONToAST (lines) {
  const trimmed = lines.shift();
  if (trimmed === '[') return parseArray(lines);
  if (trimmed === '{') return parseObject(lines);
  if (trimmed === ']') return false;
  return parseScalar(trimmed);
}
