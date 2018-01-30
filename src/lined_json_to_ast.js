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

function parseKeyAndValue (row) {
  const char = row[row.length - 1];
  if (char === '{' || char === '[') return [row.slice(0, -3), char];

  const matches = /^("(?:[^\\"]|\\.)*"): (.+)$/.exec(row);
  return [matches[1], matches[2]];
}

const parseObjectItem = lines => {
  const trimmed = lines.shift();
  if (trimmed === '}') return false;
  const [key, rawValue] = parseKeyAndValue(trimmed);
  let value;
  if (rawValue === '[') value = parseArray(lines);
  else if (rawValue === '{') value = parseObject(lines);
  else value = parseScalar(rawValue);
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
