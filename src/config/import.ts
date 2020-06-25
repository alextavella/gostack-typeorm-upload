import path from 'path';

const importConfig = {
  dir: path.resolve(__dirname, '..', '..', 'tmp'),
  fileName: 'import_template',
  type: '.csv',
};

export default {
  ...importConfig,
  filePath: path.join(
    importConfig.dir,
    `${importConfig.fileName}${importConfig.type}`,
  ),
};
