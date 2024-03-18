const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '姓名(name)為必填'],
    },
    image: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: [true, '內文(content)為必填'],
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: {
        values: ['friend', 'group'],
        message: '種類(type)只能是 friend 或 group',
      },
      required: [true, '種類(type)為必填'],
    },
    tags: [
      {
        type: String,
      },
    ],
    createdAt: {
      type: Number,
      immutable: true,
    },
    updatedAt: {
      type: Number,
      default: null,
    },
  },
  {
    versionKey: false,
  }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
