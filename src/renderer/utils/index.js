export const parseFilenameFromPath = (path) => {
  let _path = path.split('\\');
  let filename = _path[_path.length - 1];
  return filename;
}

export const loop = () => {};