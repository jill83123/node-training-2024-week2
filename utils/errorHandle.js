const headers = require('./headers.js');

function errorHandle({ res, err, message, ...args }) {
  let errorMessage = '格式錯誤';

  if (err?.errors) {
    const errorFields = Object.keys(err.errors);
    errorMessage = errorFields
      .map((field) => {
        return err.errors[field].properties?.message || `${field} 型別錯誤`;
      })
      .join('、');
  } else if (err?.path === '_id') {
    errorMessage = '找不到 id';
  } else if (message) {
    errorMessage = message;
  }

  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      success: false,
      message: errorMessage,
      errors: err,
      ...args,
    })
  );
  res.end();
}

module.exports = errorHandle;
