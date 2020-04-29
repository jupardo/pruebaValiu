import * as Mongoose from 'mongoose';

const tagSchema: Mongoose.Schema = new Mongoose.Schema({
  randomColor: String,
  name: String
});

export default Mongoose.model('Tag', tagSchema);

export interface TagType {
  _id: string | null;
  randomColor: string;
  name: string;
}