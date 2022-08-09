import Type from './Type';
import Query from './Query';
import Mutation from './Mutation';
import Subscription from './Subscription';


const resolvers = {
  ...Type,
  Query,
  Mutation,
  Subscription,
}

export default resolvers;