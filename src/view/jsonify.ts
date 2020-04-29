import { TagType } from '../model/tag';

export function jsonify(action: string, data: TagType[]): string {
  return JSON.stringify({
    action,
    data
  });
}

export function parse(message: string): Mensaje {
  const {action, data} = JSON.parse(message);
  return {
    action,
    data
  }
}

export interface Mensaje {
  action: string;
  data: TagType[];
}