const http = require('http');
const headers = require('./utils/headers.js');
const successHandle = require('./utils/successHandle.js');
const errorHandle = require('./utils/errorHandle.js');

const Post = require('./models/post.js');

const requestListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  // 取得
  if (req.url === '/posts' && req.method === 'GET') {
    try {
      const posts = await Post.find();
      successHandle({ res, data: { posts } });
    } catch (err) {
      errorHandle({ res, err });
    }
  }

  // 新增
  else if (req.url === '/posts' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);

        const post = await Post.create({
          name: data.name,
          image: data.image || '',
          content: data.content,
          type: data.type,
          tags: data.tags || [],
          createdAt: Date.now(),
        });

        successHandle({ res, message: '新增成功', data: { post } });
      } catch (err) {
        errorHandle({ res, err });
      }
    });
  }

  // 編輯
  else if (req.url.startsWith('/posts/') && req.method === 'PATCH') {
    req.on('end', async () => {
      try {
        const id = req.url.split('/').pop();
        const data = JSON.parse(body);

        if (!Object.keys(data).length) {
          errorHandle({ res, message: '修改欄位不得為空' });
          return;
        }

        const editData = {
          name: data.name,
          image: data.image,
          content: data.content,
          type: data.type,
          tags: data.tags,
          updatedAt: Date.now(),
        };

        const post = await Post.findByIdAndUpdate(id, editData, { new: true, runValidators: true });

        if (!post) {
          errorHandle({ res, message: '找不到 id' });
        } else {
          successHandle({ res, message: '修改成功', data: { post } });
        }
      } catch (err) {
        errorHandle({ res, err });
      }
    });
  }

  // 刪除所有
  else if (req.url === '/posts' && req.method === 'DELETE') {
    try {
      const post = await Post.deleteMany();
      successHandle({ res, message: `已刪除所有貼文(共 ${post.deletedCount} 筆)`, data: { posts: [] } });
    } catch (err) {
      errorHandle({ res, err });
    }
  }

  // 刪除單筆
  else if (req.url.startsWith('/posts/') && req.method === 'DELETE') {
    try {
      const id = req.url.split('/').pop();
      const post = await Post.findByIdAndDelete(id);
      if (!post) {
        errorHandle({ res, message: '找不到 id' });
      } else {
        successHandle({ res, message: '刪除成功' });
      }
    } catch (err) {
      errorHandle({ res, err });
    }
  }

  // Preflight 預檢請求
  else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  }

  // 404
  else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        success: false,
        message: '此 API 路徑不存在',
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(3000);
