const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError,
} = require("apollo-server");
const jwt = require("jsonwebtoken");
const { v1: uuid } = require("uuid");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
const mongoose = require("mongoose");
const Author = require("./models/author");
const Book = require("./models/books");
const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://izhan:izhan@cluster0.airbl.mongodb.net/graphql?retryWrites=true&w=majority";
const JWT_SECRET = "NEED_HERE_A_SECRET_KEY";

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

mongoose.set("debug", true);

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    published: Int!
    author: String!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID
    born: Int
    bookCount: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String): User
    login(username: String!, password: String!): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: (root, args) => {
      console.log(args);
      if (args.author) {
        return Book.find({ author: args.author }).exec();
      }
      if (args.genre) {
        return Book.find({ genres: args.genre }).exec();
      }
      return Book.find({}).exec();
    },
    allAuthors: (root, args) => {
      return Author.find({}).populate("bookCount").exec();
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      const book = new Book({ ...args });

      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      try {
        await book.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },

    editAuthor: async (root, args, { currentUser }) => {
      const author = await Author.findOne({ name: args.name });

      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      author.born = args.born;
      try {
        await author.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return author;
    },
    createUser: (root, args, context) => {
      const user = new User({ ...args });
      const currentUser = context.currentUser;

      return user.save().catch((error) => {
        throw new UserInputError(error, message, {
          invalidArgs: args,
        });
      });
    },

    login: async (root, args) => {
      const user = await User.findOne({ usernme: args.username });

      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
