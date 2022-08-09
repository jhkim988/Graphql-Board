import Type from './Type.js';
import Query from './Query.js';
import Mutation from './Mutation.js';
import Subscription from './Subscription.js';


const resolvers = {
  ...Type,
  Query,
  Mutation,
  Subscription,
}

export default resolvers;