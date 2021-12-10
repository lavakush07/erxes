import * as DataLoader from 'dataloader';
import * as _ from 'underscore';
import { Users } from '../../db/models';

export default function generateDataLoaderTag() {
  return new DataLoader<string, any>(async (ids: readonly string[]) => {
    const result: any[] = await Users.find({ _id: { $in: ids } }).lean();
    const resultById = _.indexBy(result, '_id');
    return ids.map(id => resultById[id]);
  });
}
