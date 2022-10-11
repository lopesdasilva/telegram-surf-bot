export function getEmoji(color) {
  switch (color.Id) {
    case 0:
      return '🟢';
    case 1:
      return '🔴';
    case 2:
      return '🟡';
    default:
      return '';
  }
}

export function groupBy(arr, property) {
  return arr.reduce((acc, cur) => {
    acc[cur[property]] = [...acc[cur[property]] || [], cur];
    return acc;
  }, {});
}
