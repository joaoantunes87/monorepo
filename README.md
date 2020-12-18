14th December, 2020

# Starting Repository

```sh
mkdir my-mono-repo
cd my-mono-repo
```

```sh
yarn init-y
```

## Using Volta to pin tool chain versions

https://docs.volta.sh/guide/

Add to package.json

```json
  "volta": {
    "node": "14.15.1",
    "yarn": "1.22.10"
  }
```

Pin node and yarn version

```sh
volta pin node yarn
```

## Configuring yarn workspace

```sh
mkdir packages
```

Add to package.json

```json
  "private": true,
  "workspaces": [
    "packages/*"
  ],
```

## Create types package

```sh
mkdir packages/types
```

[`types`](../packages/types) will become your first package: `@mr/types`.

It needs a `package.json`, so create one

### [`types/package.json`](../packages/types/package.json)

```json
{
  "name": "@mr/types",
  "version": "0.0.1",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "build": "tsc -b ."
  },
  "devDependencies": {
    "typescript": "^4.0.3"
  }
}
```

This is a TypeScript project, so you'll need a `tsconfig.json`

### [`types/tsconfig.json`](../packages/types/tsconfig.json)

```json
{
  "compilerOptions": {
    "module": "CommonJS",
    "types": [],
    "sourceMap": true,
    "target": "ES2018",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

### Types code

- src/Book.ts
- src/User.ts
- src/index.ts

### src/Book.ts

```ts
export interface IBook {
  id: string;
  title: string;
  author: string;
}

export function bookToString(book: IBook): string {
  return `${book.title}`;
}
```

### src/User.ts

```ts
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
}

export function userToString(user: IUser): string {
  return `${user.firstName} ${user.lastName}`;
}
```

### src/index.ts

```ts
export * from "./Book";
export * from "./User";
```

Finally run `yarn` to install and link dependencies, and then try to build the `@mr/types` package from within its directory.

```sh
cd packages/types
yarn build
```

you should see that a [`packages/types/dist`](../packages/types/dist) is created for you, and there are a few `.js` and `.d.ts` files within it (your build output)

## Create utils package

TODO
Now Create your own package for random utils

## Examples of utils functions:

- sum
- sub
- times

```sh
mkdir packages/utils
```

[`utils`](../packages/types) will become your first package: `@mr/utils`.

It needs a `package.json`, so create one

# Typescript configs

Replicate those configs on utils packages, created previously by you.

we'll need a `tsconfig.json` as well, and it'll be almost _exactly_ the same as the one for our `@mr/types` and `@mr/utils` packages. Repetition is annoying (and an "out of sync" bug waiting to happen), so let's set up one _meaningful_ tsconfig, and extend from it in multiple places.

### [`packages/tsconfig.settings.json`](./packages/tsconfig.settings.json)

```json
{
  "compilerOptions": {
    "module": "CommonJS",
    "types": [],
    "sourceMap": true,
    "target": "ES2018",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "declaration": true
  }
}
```

### update [`packages/types/tsconfig.json`](./packages/types/tsconfig.json)

```json
{
  "extends": "../tsconfig.settings.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

### do the same for [`packages/utils/tsconfig.json`](./packages/utils/tsconfig.json)

Finally create a [`packages/tsconfig.json`](../packages/tsconfig.json) that _refers_ to each package

```json
{
  "files": [],
  "references": [{ "path": "utils" }, { "path": "types" }]
}
```

try running this from the root of your project now

```sh
yarn tsc -b packages
```

both `types` and `utils` should build!

### Squeaky Clean

Each package we create will put its build output in its own folder, so we should set ourselves up for an easy way to destroy it and "build again from scratch".

We can install a _workspace_ dependency (at the root of the project, not a dependency of any package) to handle this in a platform-independent way:

```sh
yarn add -WD rimraf
```

Then, go to `types/package.json` and `utils/package.json` and make this small change

```diff
@@ -7,6 +7,7 @@
     "access": "public"
   },
   "scripts": {
+    "clean": "rimraf dist *.tsbuildinfo",
     "build": "tsc -b ."
   },
```

Now, we can go to either of these projects and run `yarn clean` to delete build output, and `yarn build` to make a fresh build.

15th December, 2020

Keeping the last developments in regard to our simple mono repository, here I am going to setup our code testing using jest framework and linting with eslint.

Those are two technologies highly consensual on javascript ecosystem.

More and more I have been convinced that testing is probably more important that our production code, with that I have been trying to follow the Test Driven Development (TDD) approach with [Jest](http://jestjs.io/).

[ESLint](https://eslint.org/) prevents some human error, doing a static analysis of our code alerting to us in regard to some bad practices.

Jest and ESLint are some of the technologies I have been using in all the javascript projects I have been on.

### Jest

We start by setting up Jest on `packages/types`. For that we need to install some dependencies:

```sh
cd packages/types
```

```sh
yarn add -D @babel/preset-env @babel/preset-typescript @types/jest jest
```

Do the same on `packages/utils`.

We are using [babel](https://babeljs.io/) to convert our typescript code, in our tests, to javascript. So, we need to add a `.babelrc` with needed configs for babel to do its work.

We are going to create a `.babelrc` on packages folder, which will be then extended by each package. So `./packages/.babelrc`:

<pre>
{
  "presets": [
    ["@babel/preset-env", { "targets": { "node": "10" } }],
    "@babel/preset-typescript"
  ]
}
</pre>

Here we configure babel to transpile code for node env (@babel/preset-env) with typescript (@babel/preset-typescript). Presets are a set of rules for babel to trasnpile the code. There are a lot of presets available, for example, if you use react, there is a preset to transpile react code. It is usually used for JSX.

The main purpose of Babel is to transpile our `modern`javascript code for old browsers.

Now on `./packages/types` and `./packages/utils` create their on `.babelrc`:

<pre>
{
  "extends": "../.babelrc"
}
</pre>

You are almost done with setting up jest. We just need to add a script, on package.json, to execute our tests.

Go to `./packages/types/package.json` and `./packages/utils/package.json`, and add the following on `scripts`

```
"test": "jest"
```

You should now be able to go to `./packages/types` or `./packages/utils` and execute:

```bash
yarn test
```

It will fail be we have no tests. Lets add a simple test on `./packages/types`. Create a folder `tests`:

```bash
mkdir tests
```

And a file called `book.test.ts`:

<pre>
import { bookToString } from "@mr/types";

describe("bookToString() tests", function () {
  test("should return title of book", () => {
    expect(
      bookToString({
        id: "id",
        title: "Clean Code",
        author: "Uncle Bob",
      })
    ).toBe("Clean Code");
  });
});
</pre>

Now, when you execute `yarn test` we should this a message telling tests has passed. In this case:
`Test Suites: 1 passed, 1 total`

16th December, 2020

Keeping the last developments in regard to our simple mono repository, here I am going to setup our linting process with eslint.

[ESLint](https://eslint.org/) highly consensual on javascript ecosystem. I have been using it in all javascript project I have been on, in the last 3 years. ESLint prevents some human error, doing a static analysis of our code alerting to us in regard to some bad practices.

### Linting Setup

We will start by installing eslint and needed plugins for typescript. ESLint architecture works around plugins.

```bash
yarn add -WD eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

In the root of our project we have to create an `.eslintrc` file with eslint configs for our project. We will follow the same technique of creating a general one config file, and then each package extending it and adapting it as needed. That way it is easier to maintain, when we want update our eslint rules:

<pre>
{
  "env": {
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 12
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "prefer-const": "error",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-assignment": "off"
  }
}
</pre>

Here we are using a standard configs with recommended rules from:

- eslint
- @typescript-eslint plugin

For each of our packages we need to create a `.eslintrc` as well, extending the general one we have just created:

<pre>
{
  "extends": "../../.eslintrc",
  "parserOptions": {
    "project": "tsconfig.json"
  }
}
</pre>

Replicate it for `packages/types` and `packages/utils`.

Finally, lets add a script on each package.json to execute eslint on our files:

```json
"lint": "eslint src --ext js,ts"
```

Add this line to `scripts` at `package.json` files for `packages/types` and `packages/utils`.

Go to each package folder an execute:

```bash
yarn lint
```

It should give no errors. However, it is important to have the IDE also alerting you for errors. I am using VSCode and while going to `packages/types/src/Book.ts` I have found the following error on VSCode in the first line in regard to `export`:

```
Parsing error: Cannot read file '…/tsconfig.json'.eslint
```

This does not make sense. It seems that VSCode needs to have a `tsconfig.json` at the root of the repository. I have tried to copy a `tsconfig.json` file to the root and it solves the problem, but I do not like it. It is hard to maintain and error prone.

After digging a while I found I would need to configure my workspace settings on VSCode with the correct directories for eslint plugin on VSCode. Added this to `settings` of workspace file in VSCode:

<pre>
  "eslint.workingDirectories": [
    { "directory": "packages/types", "changeProcessCWD": true },
    { "directory": "packages/utils", "changeProcessCWD": true }
  ]
</pre>

It has the downside of needed to add new entry everytime we have new package. However, I prefer this approach.

More information about it [here](https://stackoverflow.com/questions/64933543/parsing-error-cannot-read-file-tsconfig-json-eslint#:~:text=If%20you%20run%20eslint%20in,the%20project%20configuration%20relative%20to%20.) and [here](https://github.com/microsoft/vscode-eslint/issues/722)

Now, everything should be ok, but I want to confirm eslint is really checking the rules configured. I am going to `packages/utils/src/math.js` and do the following change on `sum` function:

<pre>
export function sum(one: number, two: number): number {
  let result = one + two;
  return one + two;
}
</pre>

The VScode should be alerting to an error `'result' is never reassigned. Use 'const' instead`

That is because we have configured the following `eslint rule`

```json
"prefer-const": "error",
```

IF we execute

```bash
yarn lint
```

Besides the error we also get a warning `'result' is assigned a value but never used`

Ok, first things first. Lets change the `let` to `const`:

<pre>
export function sum(one: number, two: number): number {
  let result = one + two;
  return one + two;
}
</pre>

We now only have the warning on VSCode and while executing `yarn lint`, alerting us we are not using `result` var. Lets fix it:

<pre>
export function sum(one: number, two: number): number {
  const result = one + two;
  return result;
}
</pre>

We have solved the linting errors.

Next I am going to experiment with (Lerna)[https://github.com/lerna/lerna] to facilitate the management of our packages in a mono repository.

18th December, 2020

### Lerna

(Lerna)[https://github.com/lerna/lerna] provides a mechanism to run a command on each package in our mono repo with one cli. For example run test for all `packages` using only a command on the root workspace:

```bash
yarn lerna run test
```

We start by adding `lerna` dependency at our workspace level:

```bash
yarn add -WD lerna
```

Now we need to configure `lerna`in our repository. We do it by create a `lerna.json` file in the root of our repository:

<pre>
{
  "packages": ["packages/*"],
  "npmClient": "yarn",
  "version": "0.1.0",
  "useWorkspaces": true
}
</pre>

We have defined our `packages` folder, and marking we are using `yarn` and `yarn workspaces`. Here we are using a fixed version for the repository. Lerna also supports `ìndependent`versioning. For that we would need to change `version` to `independent`:

```json
"version": "independent"
```

#### Lerna Versioning

According to Learn documentation, `fixed versioning`:

"Fixed mode Lerna projects operate on a single version line. The version is kept in the lerna.json file at the root of your project under the version key. When you run lerna publish, if a module has been updated since the last time a release was made, it will be updated to the new version you're releasing. This means that you only publish a new version of a package when you need to."

`independent versioning`:
"Independent mode Lerna projects allows maintainers to increment package versions independently of each other. Each time you publish, you will get a prompt for each package that has changed to specify if it's a patch, minor, major or custom change."

#### Lerna Bootstrap

No we have Lerna configured we are ready to execute:

```bash
yarn lerna bootstrap
```

If we had dependencies between our existing packages, this would take care of "linking" everything up. It will be very useful for further developments, when we have packages depending on each other.

More about the `bootstrap` command [here](https://github.com/lerna/lerna/tree/main/commands/bootstrap#readme).

Now we have Lerna setted up we can start taking advantage of it. For example, lets execute the following command in the root of our repository:

```bash
yarn lerna run clean && yarn lerna run build
```

Each command will be executed in each package with one command. First we clean the build and then generate a new build.

**Note**: this command should be improved to use `prebuild` for clean task. We can also improve it with concurrent execution.

Other useful lerna commands to explore later:

- lerna bootstrap;
- lerna link;
- lerna exec <cmd>;
- lerna changed

#### Internal dependencies with Lerna

Lets imagine we want to create a `booksService` on `utils` creating `booksService.ts` file at `packages/utils/src`:

<pre>
import { IBook } from "@mr/types";

const books: IBook[] = [
  {
    id: "1",
    title: "Clean Code",
    author: "Uncle Bob",
  },
  {
    id: "2",
    title: "The Pragmatic Programmer",
    author: "Andy Hunt and Dave Thomas",
  },
];

export function findBookById(id: string): IBook {
  const book = books.find(({ id: bookId }) => id === bookId);

  if (book) {
    return book;
  }

  throw new Error("Not Found");
}

export function allBooks(): IBook[] {
  return books;
}

</pre>

Also add the following at `packages/utils/src/index.ts`:

```js
export * from "./booksService";
```

We need to add `@mr/types` dependency to `@mr/utils`. With Lerna we could do the following:

```bash
yarn lerna add @mr/types --scope=@mr/utils
```

19th December, 2020

### Lerna Publish and Verdaccio

[Verdaccio](https://verdaccio.org/en/) is a local npm proxy we can use locally.

```bash
yarn add -WD verdaccio
```

```bash
yarn verdaccio
```

A npm repository is now available at `http://localhost:4873/`

Now we need to configure our registry create a `.npmrc` file with:

```
registry=http://localhost:4873
```

We need to create Verdaccio user to be able to publish packages to our repository. Create it and then do:

```bash
yarn login
```

We should now be able to publish our packages with lerna using:

```bash
yarn lerna publish from-package
```

Not sure why, but I needed to setup the git repository and before any publish lerna ask me to commit any change, which makes sense.

After trying the command I had some problems authenticating in my local registry, lerna was always trying to publish on npm registry.

After a while I tried the following, explicitly configuring my local registry:

```bash
yarn lerna publish from-package --yes --registry http://localhost:4873
```

It worked, and now I have the artifacts on my local verdaccio repository. Another solution, would be Nexus. I have used it in the past, however it requires more work to set up. I will keep experimenting with Verdaccio.

Also, some work need to be done to have it working smoothly in Continuos Integration, Delivery and Deployment environment.

20th December, 2020

#### Web Application

```bash
cd packages
```

```bash
npx create-react-app spa
```

Lets update `packages/spa/package.json` name:

```json
"name": "@mr/spa",
```

At our root `package.json` at `scripts` add:

```json
  "scripts": {
    "start:spa": "cd packages/spa && yarn start"
  },
```

Lets add our internal libraries:

```bash
yarn lerna add @mr/types @mr/utils --scope=@mr/spa
```

I was expecting it to work, however it fails. For, what I see it is only possible to add a library as dependency at a time, using lerna. I read more about it [here](https://github.com/lerna/lerna/issues/2004)

Experiment with

```bash
yarn lerna add @mr/utils --scope=@mr/spa
```

Followed by

```bash
yarn lerna add @mr/types --scope=@mr/spa
```

In this case, we have created our react-app with javascript, so `@mr/types` will not be very useful.

Lets start using our books in our React Application. Go to `packages/spa/src/App.js` and update it to:

<pre>
import { allBooks } from "@mr/utils";

function App() {
  return (
    <div>
      <h1>List of Books</h1>
      <ul>
        {allBooks().map(function renderBook(book) {
          return (
            <li key={book.id}>
              {book.title} from {book.author}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
</pre>

Now lets do a change on `@mr/utils` and check if we get it. Lets add a `tag` property to our books. We will need to change `@mr/types` as well.

On `@mr/types` I have updated `src/Book.ts` to:

<pre>
export interface IBook {
  id: string;
  title: string;
  author: string;
  tag?: string;
}

export function bookToString(book: IBook): string {
  return `${book.title}`;
}
</pre>

`tag` was added as an optional property to `IBook` interface, representing our books.

Now, lets go to `@mr/utils`. I update `books` array at `src/booksService.ts` with a `tag` for each book:

<pre>
const books: IBook[] = [
  {
    id: "1",
    title: "Clean Code",
    author: "Uncle Bob",
    tag: "Software",
  },
  {
    id: "2",
    title: "The Pragmatic Programmer",
    author: "Andy Hunt and Dave Thomas",
    tag: "Software",
  },
];
</pre>

However we see VSCode is warning us with an error. I am going to execute `lint`:

```bash
yarn lerna run lint
```

No error was found.

Ok. We are going to link all of our dependencies:

```bash
yarn lerna bootstrap
```

`Already up-to-date.`

We changed it `@mr/types` and `@mr/utils`. We need to rebuild it:

```bash
yarn lerna run build
```

And now errors disappeared. We will want to automate this processo to improve the Developer Experience. I will do it later.

For now, lets go back to our Single Page Application in React and show `tag` for each book. Our `packages/spa/src/App.js`:

<pre>
import { allBooks } from "@mr/utils";

function App() {
  return (
    <div>
      <h1>List of Books</h1>
      <ul>
        {allBooks().map(function renderBook(book) {
          return (
            <li key={book.id}>
              {book.title} from {book.author} about {book.tag || ""}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;

</pre>

And it was updated on `http://localhost:3000`

Next I will try the some for a react-native application.

21th December, 2020

#### Mobile Application

```bash
cd packages
```

```bash
npx react-native init mobile --template react-native-template-typescript
```

Problems in iOS:
NO HOIST

````json
"workspaces": {
"packages": [
"packages/*"
],
"nohoist": [
"**/react-native",
"**/react-native/**"
]
},```

https://classic.yarnpkg.com/blog/2018/02/15/nohoist/

Lets update `packages/spa/package.json` name:

```json
"name": "@mr/mobile",
````

Lets add our internal libraries:

```bash
yarn lerna add @mr/utils --scope=@mr/mobile
```

Followed by

```bash
yarn lerna add @mr/types --scope=@mr/mobile
```

Watchman problem:

Enters WML
https://github.com/wix/wml

wml add packages/utils packages/mobile/node_modules/@mr/utils

wml add packages/types packages/mobile/node_modules/@mr/types

See if I can automate it with
https://www.npmjs.com/package/react-native-yarn-workspaces/v/1.0.8?activeTab=readme

Another solution and easier to mantain is to tell watchman to look for our packages. We can do it updating `metro.config.js`:

<pre>
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');
const watchFolders = [
  //Relative path to packages directory
  path.resolve(__dirname + '/..'),
];

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  watchFolders,
};
</pre>

I have go this ideia [here](https://medium.com/@dushyant_db/how-to-use-lerna-with-react-native-1eaa79b5d8ec)

<pre>
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, ScrollView, View, Text, StatusBar} from 'react-native';

import {allBooks} from '@mr/utils';
import {IBook} from '@mr/types';

const App = () => {
  const books = allBooks();
  console.log('Books: ', books);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          {allBooks().map(function renderBook(book: IBook): JSX.Element {
            return (
              <View key={book.id}>
                <Text>{book.title}</Text>
                <Text>{book.author}</Text>
                <Text>{book.tag}</Text>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;

</pre>
