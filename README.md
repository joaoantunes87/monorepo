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
yarn lerna publish
```

Not sure why, but I needed to setup the git repository and before any publish lerna ask me to commit any change, which makes sense.

After trying the command I had some problems authenticating in my local registry, lerna was always trying to publish on npm registry.

After a while I tried the following, explicitly configuring my local registry:

```bash
yarn lerna publish --yes --registry http://localhost:4873
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

#### Create React Native Application

Here I am going to create a react-native application with the typescript template. I should be as easy as:

```bash
cd packages
```

```bash
npx react-native init mobile --template react-native-template-typescript
```

However after this you will see some problems on the ios application. It is not able to install dependencies on ios application.

It happens due to the way workspaces store dependencies, saving the common dependencies on the root `node_modules` and not in each package.

For ios application the configurations for dependencies expect a relative path for node_modules folder, something like:

```

```

After digging a while I found it is a solved problem, with a simples solution. We need to configure react-native dependencies to not be hoisted by our workspace and be stored in the local `node_modules`. This [article](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/), explains it very well..

I changed the `worksapces` property in our root `package.json` to:

<pre>
"workspaces": {
"packages": [
"packages/*"
],
"nohoist": [
"**/react-native",
"**/react-native/**"
]
}
</pre>

And try to create the react nartive application again. After a while it is created and we should be ready to start our new mobile application.

I just update `packages/mobile/package.json` name:

```json
"name": "@mr/mobile",
```

For now I am going to run it directly on `packages/mobile`:

```bash
yarn ios
```

I can see the boilerpla application. I am now going to add our `types` and `utils` libraries to show our books information as we did in our web application [here](react-webapp-monorepo):

```bash
yarn lerna add @mr/utils --scope=@mr/mobile
```

Followed by

```bash
yarn lerna add @mr/types --scope=@mr/mobile
```

After that my application stops working while trying to auto reload, when I change some application code. It happens due to watchman not being able to reload `linked` application with `yarn`, done by lerna when application are installed:

<pre>
error: Error: Unable to resolve module `@babel/runtime/helpers/interopRequireDefault` from `App.tsx`: @babel/runtime/helpers/interopRequireDefault could not be found within the project.

If you are sure the module exists, try these steps:
 1. Clear watchman watches: watchman watch-del-all
 2. Delete node_modules: rm -rf node_modules and run yarn install
 3. Reset Metro's cache: yarn start --reset-cache
 4. Remove the cache: rm -rf /tmp/metro-*
    at ModuleResolver.resolveDependency (/Users/nb24696/Experiments/my-mono-repo/packages/mobile/node_modules/metro/src/node-haste/DependencyGraph/ModuleResolution.js:186:15)
    at ResolutionRequest.resolveDependency (/Users/nb24696/Experiments/my-mono-repo/packages/mobile/node_modules/metro/src/node-haste/DependencyGraph/ResolutionRequest.js:52:18)
    at DependencyGraph.resolveDependency (/Users/nb24696/Experiments/my-mono-repo/packages/mobile/node_modules/metro/src/node-haste/DependencyGraph.js:287:16)
    at Object.resolve (/Users/nb24696/Experiments/my-mono-repo/packages/mobile/node_modules/metro/src/lib/transformHelpers.js:267:42)
    at /Users/nb24696/Experiments/my-mono-repo/packages/mobile/node_modules/metro/src/DeltaBundler/traverseDependencies.js:434:31
    at Array.map (<anonymous>)
    at resolveDependencies (/Users/nb24696/Experiments/my-mono-repo/packages/mobile/node_modules/metro/src/DeltaBundler/traverseDependencies.js:431:18)
    at /Users/nb24696/Experiments/my-mono-repo/packages/mobile/node_modules/metro/src/DeltaBundler/traverseDependencies.js:275:33
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/Users/nb24696/Experiments/my-mono-repo/packages/mobile/node_modules/metro/src/DeltaBundler/traverseDependencies.js:87:24)
    </pre>

I was expecting this problem, because I has happened to me in a project I am working on. There I am using [WML](https://github.com/wix/wml) to solve the problem, and it works very well. However, it required some setup and an external tool:

```bash
wml add packages/utils packages/mobile/node_modules/@mr/utils
```

```bash
wml add packages/utils packages/mobile/node_modules/@mr/types
```

```bash
wml start
```

For this case, I found another solution, that I think it is a better automation here, and improve the developer experience. This solution is easier to mantain.

The solution is to tell `watchman` to look for our packages. We can do it updating `metro.config.js`:

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

I have got this ideia [here](https://medium.com/@dushyant_db/how-to-use-lerna-with-react-native-1eaa79b5d8ec). We will need to restart the application for metro to get those configuration.

After having the application started again, I have changed the `packages/mobile/serc/App.tsx` to use our `@mr/utils` and `@mr/types` packages. The application has reloaded with those modifications well:

<pre>
import React from 'react';
import {SafeAreaView, ScrollView, View, Text, StatusBar} from 'react-native';

import {allBooks} from '@mr/utils';
import {IBook} from '@mr/types';

const App = () => {
  const books = allBooks();
  
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

We are now able to update our `packages` and having it reload immediately. We just need to remember to rebuild `packages` after our changes.

After adding the react-native application I have also found some conflicts on dependency versions in different packages, in this case, in our `spa` in regard to `babel-jest`, when we try to `build` it. Due to the way `create-react-app` works I am not able to change the version of `babel-jest` directly without ejecting it. I havef added `babel-jest` to not be hoisted. I have also removed all `node_modules` manually execute `yarn`.

I have changed the `worksapces` property in our root `package.json` to:

<pre>
"workspaces": {
"packages": [
"packages/*"
],
"nohoist": [
"**/react-native",
"**/react-native/**",
"**/babel-jest"
]
}
</pre>

22nd December, 2020

#### Graph depedencies

https://www.npmjs.com/package/lerna-dependency-graph

No sure why by if I install `lerna-dependency-graph` and try to use it like:

```bash
yarn lerna-dependency-graph
```

I have the following error:

```bash
env: node\r: No such file or directory
```

But if I use the following, it works well:

```
npx lerna-dependency-graph
```

I will use this, so far.

https://www.npmjs.com/package/graphviz-cli

```
yarn add -WD graphviz-cli canvas open-cli
```

<pre>
  "scripts": {
    ...
    "graph:specs": "npx lerna-dependency-graph -o dependency-graph.dot",
    "graph:png": "yarn graphviz -Tpng -odependency-graph.dot.png dependency-graph.dot",
    "graph:preview": "open dependency-graph.dot.png",
    "graph": "yarn graph:specs && yarn graph:png && yarn graph:preview"
  },
</pre>

23rd December, 2020

### React Library with Typescript

### TSDX

https://github.com/formium/tsdx

```bash
npx tsdx create ui-web
```

I going to choose the template:

```
react-with-storybook
```

I will talk about storybook in another post. It will take some time to create the library

**Talk about:**

```
I already ran yarn install for you, so your next steps are:
cd ui-web

To start developing (rebuilds on changes):
yarn start

To build for production:
yarn build

To test your library with Jest:
yarn test
```

Update `packages/ui-web/package.json` name to `@mr/ui-web`:

```json
"name": "@mr/ui-web",
```

### React Web Component

#### Book Card

For now we are going to use the inline css, but it is not the recommended. Since we are using an external lib it will need some more setup to generate an external css to be used on our application, which bundles with webpack. We will let it for another time.

Another solution would be to use CSS in JS, since css is generated with javascript in runtime, it will not need extra setups in regard the build. However, I prefer to use plain css.

Here, I am not taking attention to style:

`src/components/BookCard/index.tsx`

<pre>
import React from &#39;react&#39;;

export default function BookCard({ book }: { book: any }) {  
  return (
    &lt;div&gt;
      &lt;h2&gt;{book.title}&lt;/h2&gt;
      &lt;p&gt;{book.author}&lt;/p&gt;
      &lt;small&gt;{book.tag}&lt;/small&gt;
    &lt;/div&gt;
  );
}
</pre>

Notice, I am using the `book: any`. I will fix it later to use our own `IBook` type.

`src/index.tsx`

<pre>
import BookCard from './components/BookCard';

export { BookCard };
</pre>

#### SPA Build Fix

Started having conflicts with spa application in regard to dependency versions. I have explain it **here**. Now, this happens with `babel-loader` and `jest`. I am going to had it to `nohoist`, clear `node_modules` and execute `yarn`:

<pre>
    "nohoist": [
      "**/react-native",
      "**/react-native/**",
      "**/babel-jest",
      "**/babel-loader",
      "**/jest"
    ]
</pre>

#### Use BookCard

We want to use our new component in our spa application.

```bash
yarn lerna add @mr/ui-web --scope=@mr/spa
```

Lets build all in the root:

```bash
yarn lerna run build
```

Notice, thanks to Lerna our `build` execute in the correct order. It would be a nightmare if we had to do it buy hand.

`packages/spa/App.js`:

<pre>
import React from &quot;react&quot;;

import { allBooks } from &quot;@mr/utils&quot;;
import { BookCard } from &quot;@mr/ui-web&quot;;

function App() {
  return (
    &lt;div&gt;
      &lt;h1&gt;List of Books&lt;/h1&gt;
      &lt;ul&gt;
        {allBooks().map(function renderBook(book) {
          return (
            &lt;li key={book.id}&gt;
              &lt;BookCard book={book} /&gt;
            &lt;/li&gt;
          );
        })}
      &lt;/ul&gt;
    &lt;/div&gt;
  );
}

export default App;
</pre>

Next, I want to create a library for react-native components. And, after that play with `react-native-web`and may find a way to uniform components between web and mobile.

24th December, 2020

### React Native Library with Typescript

At packages:

```bash
npx tsdx create ui-mobile
```

Choose `react` template.

Update `packages/ui-mobile/package.json` name to `@mr/ui-mobile`:

```json
"name": "@mr/ui-mobile",
```

```bash
yarn lerna add react-native --scope=@mr/ui-mobile --dev
```

```bash
yarn lerna add @types/react-native --scope=@mr/ui-mobile --dev
```

`src/components/BookCard/index.tsx`

<pre>
import React from &#39;react&#39;;
import { View, Text } from &#39;react-native&#39;;

export default function BookCard({ book }: { book: any }) {

  return (
    &lt;View&gt;
      &lt;Text&gt;{book.title}&lt;/Text&gt;
      &lt;Text&gt;{book.author}&lt;/Text&gt;
      &lt;Text&gt;{book.tag}&lt;/Text&gt;
    &lt;/View&gt;
  );
}
</pre>

Notice, I am using the `book: any`. I will fix it later to use our own `IBook` type.

`src/index.tsx`

<pre>
import BookCard from './components/BookCard';

export { BookCard };
</pre>

An

```bash
yarn lerna add @mr/ui-mobile --scope=@mr/mobile
```

`packages/mobile/App.tsx`:

<pre>
import React from &quot;react&quot;;

import { allBooks } from &quot;@mr/utils&quot;;
import { BookCard } from &quot;@mr/ui-web&quot;;

function App() {
  return (
    &lt;div&gt;
      &lt;h1&gt;List of Books&lt;/h1&gt;
      &lt;ul&gt;
        {allBooks().map(function renderBook(book) {
          return (
            &lt;li key={book.id}&gt;
              &lt;BookCard book={book} /&gt;
            &lt;/li&gt;
          );
        })}
      &lt;/ul&gt;
    &lt;/div&gt;
  );
}

export default App;
</pre>

Metro watcher with conflits among folders.

**undo metro.config.js**

Geting back to wml:

```bash
wml add packages/utils packages/mobile/node_modules/@mr/utils
```

```bash
wml add packages/utils packages/mobile/node_modules/@mr/types
```

```bash
wml add packages/ui-mobile packages/mobile/node_modules/@mr/ui-mobile
```

```bash
wml start
```

I am with some problems, in some situations:
Solving with wml, similar to

```
[error] unable to resolve root /Users/blah/project: directory /Users/blah/project is not watched
```

https://github.com/wix/wml/issues/1

I had to do something like for two of the links:

```
watchman watch /Users/nb24696/Experiments/my-mono-repo/packages/utils
```

```
watchman watch /Users/nb24696/Experiments/my-mono-repo/packages/ui-mobile
```

And then

```bash
wml start
```

Seems to be working well. It is not a pretty, neither, easy setup, but I think it is a minor price to pay to hot reload with react-native, hot reload is something we do not have on native development for mobile.

**NOTE**
**TRYIED; BUT COULD NOT SOLVE THE PROBLEM**

Review this problem again. Watchman was alerting to problems because we have to packages with "example" name. This happens due to the `tsdx` template, which supplies an `èxample` at `èxample`. The ideia of this project is to be a playground to see how to use the code we are distributing with corresponding library.

Trying to solve it going to each `example/package.json` and updating its `name` and `private` to `true`to avoid it be published by Lerna. For example:
```packages/ui-web/example/package.json`:
"name": "@mr/ui-web-example",
"private": "true",

Put back `metro.configs.js`:

<pre>
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

**TODO: To experiment.**

##### React Native Web

Go to `packages` folder:

´´´
npx tsdx create ui-shared
´´´

React with StoryBook template

Update `/packages/ui-shared/package.json` name:

```json
"name": "@mr/ui-shared",
```

Update `/packages/ui-shared/example/package.json` name:

```json
"name": "@mr/ui-shared-example",
```

External dependency for react-native-web:

```bash
yarn lerna add react-native-web --scope=@mr/ui-shared --dev
```

```bash
yarn lerna add @types/react-native --scope=@mr/ui-shared --dev
```

`src/components/BookCard/index.tsx`

<pre>
import React from &#39;react&#39;;
import { View, Text } from &#39;react-native-web&#39;;

export default function BookCard({ book }: { book: any }) {

  return (
    &lt;View&gt;
      &lt;Text&gt;{book.title}&lt;/Text&gt;
      &lt;Text&gt;{book.author}&lt;/Text&gt;
      &lt;Text&gt;{book.tag}&lt;/Text&gt;
    &lt;/View&gt;
  );
}
</pre>

Notice, I am using the `book: any`. I will fix it later to use our own `IBook` type.

`src/index.tsx`

<pre>
import BookCard from './components/BookCard';

export { BookCard };
</pre>

To avoid having typescript problems with `react-native-web` linked `@types/react-native` this way. On `packages/ui-shared`:

```bash
yarn add -D @types/react-native-web@npm:@types/react-native
```

I have found this suggestion [here](https://github.com/necolas/react-native-web/issues/832#issuecomment-381686680)

#### Storybook

We want to be able to test and visualize our ui compoments idependently, without needing to have a full application. For That we use storybook.

Removed `stories/Things.stories.tsx`.

Created `stories/BookCard.stories.tsx`:

<pre>
import React from 'react';
import { Meta, Story } from '@storybook/react';
import { BookCard } from '../src';

const meta: Meta = {
  title: 'BookCard',
  component: BookCard,
  argTypes: {
    book: {
      title: 'text',
      author: 'text',
      tag: 'text',
      defaultValue: {
        title: "Clean Code", author: 'Uncle Bob', tag: 'software'
      }
    },
  },
  parameters: {    
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<any> = args => <BookCard {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {}; 

</pre>

And start storybook:

```
yarn storybook
```

Now, we clear `examples` project, since we will be using `storybook` to see our components working. Also, removed `packages/ui-shared/test/blah.test.tsx`. It was using some boilerplates not existing anymore.

Removing `react-dom`dependencies, since it is not needed here anymore:

```bash
yarn workspace @mr/ui-shared remove react-dom @types/react-dom
```

#### React Native Web and ui-shared on SPA

```bash
yarn lerna add @mr/ui-shared --scope=@mr/spa
```

We also need to add react-native-web

```bash
yarn lerna add react-native-web --scope=@mr/spa
```

Now we need to update our `packages/spa/index.js`:

<pre>
import "./index.css";

import { AppRegistry } from "react-native";
import App from "./App";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  rootTag: document.getElementById("root"),
});

</pre>

Here we are just following the instructions on `react-native-web` documentation [here](https://github.com/necolas/react-native-web#examples).

And now we update `packages/spa/App.js`:

<pre>
import React from "react";
import "./App.css";

import { allBooks } from "@mr/utils";
import { BookCard } from "@mr/ui-shared";

function App() {
  return (
    <div>
      <h1 className="App">List of Books</h1>
      <ul>
        {allBooks().map(function renderBook(book) {
          return (
            <li key={book.id}>
              <BookCard book={book} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;

</pre>

You can now even remove dependency for `@mr/ui-web`.

The interesting thing here is we are still able to use react-dom components as we can see here with `h1` component.

### React Native Web on Mobile package

yarn lerna add react-native-web --scope=@mr/mobile
yarn lerna add react-dom --scope=@mr/mobile

Is needed to have react-dom installed on react-native app due to react-native-web?

#### TODO

Next, we start trying to use this compoment on our web and mobilwe application. Mobile first. Build libraries:

```bash
yarn lerna run build
```

```bash
yarn lerna add @mr/ui-shared --scope=@mr/mobile
```

WML link

```bash
wml add packages/ui-shared packages/mobile/node_modules/@mr/ui-shared
```

Make sure WML is working. If not execute:

```bash
wml start
```

Also needed to do the following on the root of repository. I seem to be with some problems in regard to `watchman`.

```
watchman watch packages/ui-shared
```

**FIXME**
Estou com vários problemas a linkar as libs no react-native. Sempre que adiciono uma nova lib é um problema. COMO RESOLVER ISTO E FAZER DEVELOPER / USER FRIENDLY

error: Error: Unable to resolve module `react-native-web` from `node_modules/@mr/ui-shared/dist/ui-shared.cjs.production.min.js`: react-native-web could not be found within the project or in these directories:
../../node_modules

Trying the following

- react-native-web moved to dev on ui-shared
- -react-native-web needs to be installed on mobile

Lerna does not have a remove command, the opposite of yarn add :\

Using
yarn workspace @mr/ui-shared remove react-native-web

https://github.com/lerna/lerna/issues/1886

Install on mobile
yarn workspace @mr/mobile add react-native-web

Não estou a conseguir

```bash
yarn lerna add postcss --scope=@mr/mobile
```

#### CSS Modules in components library

**https://github.com/postcss/postcss/wiki/PostCSS-8-for-end-users#rollup**

```bash
yarn lerna add postcss --scope=@mr/ui-web --dev
```

**https://www.npmjs.com/package/rollup-plugin-postcss**

```bash
yarn lerna add rollup-plugin-postcss --scope=@mr/ui-web --dev
```

`packages/ui-web/tsdx.config.js`:

<pre>
const postcss = require('rollup-plugin-postcss');
module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        modules: true,
        extract: true
      })
    );
    return config;
  },
};
</pre>

```bash
yarn lerna run build --scope=@mr/ui-web
```

Nothing happens because css was not added yet.

```bash
rm -rf dist
```

`packages/ui-web/components/BookCard/styles.modules.css`

<pre>
.card {
  border: 2px solid black;
}
</pre>

`packages/ui-web/components/BookCard/index.tsx`

<pre>
import React from 'react';
// @ts-ignore
import styles from './styles.module.css';

export default function BookCard({ book }: { book: any }) {
  return (
    <div className={styles.card}>
      <h2>Test: {book.title}</h2>
      <p>{book.author}</p>
      <small>{book.tag}</small>
    </div>
  );
}
</pre>

We need to configure typescript to handle `styles.module.css`. For now, I am using `\\@ts-ignore`

I use `extract: true`, so a css file is generated on the final build. When we execute:

```bash
yarn lerna run build --scope=@mr/ui-web
```

a file `packages/ui-web/dist/ui-web.cjs.production.min.css` is generated with something like:

<pre>
.styles-modules_card__2yoe0 {
  border: 2px solid black;
}
</pre>

`styles-module_card__2yoe0` is autogenerated and will be the css class added to our component in final build, as we can see at `packages/ui-web/dist/ui-web.cjs.production.min.js`:

```js
return t.createElement("div",{className:"styles-module_card__2yoe0"}
```

Applications using this library should import this css. If we do not want that we could remove `extract:true` and the css will be using through javascript. I think in big projects it could be a performance problem.

### Storybook

Use **https://www.npmjs.com/package/storybook-css-modules-preset**

`pacakges/ui-web/.storybook/main.js`:

<pre>
module.exports = {
  stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-css-modules-preset',
  ],
  // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration
  typescript: {
    check: true, // type-check stories during Storybook build
  },
};

</pre>

### Typescript

for now will do the following:
`packages/ui-web/src/typings.d.ts`:

<pre>
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

</pre>

**https://github.com/formium/tsdx/issues/186#issuecomment-549601364**

But would like to havfe this plugin working:
**https://github.com/mrmckeb/typescript-plugin-css-modules**

#### React Navigation

```bash
yarn lerna add @react-navigation/native --scope=@mr/mobile
```

```bash
yarn lerna add react-native-reanimated --scope=@mr/mobile
```

```bash
yarn lerna add react-native-gesture-handler --scope=@mr/mobile
```

```bash
yarn lerna add react-native-screens --scope=@mr/mobile
```

```bash
yarn lerna add react-native-safe-area-context --scope=@mr/mobile
```

```bash
yarn lerna add @react-native-community/masked-view --scope=@mr/mobile
```

```bash
yarn lerna add @react-navigation/stack --scope=@mr/mobile
```

https://medium.com/@ratebseirawan/react-native-0-63-monorepo-walkthrough-36ea27d95e26

Experimentei esta abordagem:
https://medium.com/@ratebseirawan/react-native-0-63-monorepo-walkthrough-36ea27d95e26

Consigo ter a aplicação a funcionar. Mas quando experimento react-navigation, tenho problemas logo quando tento fazer o
import 'react-native-gesture-handler';

Estou a seguir as instruções do react-navigation.

Está a ser frustrante isto. Próximos passos:

- Experimentar outra biblioteca react-native para ver se acontece o mesmo;
- Pergunta stack overflow
- Experimentar instalar react-navigation numa app limpa para ter a certeza que é algo relacionado com o mono repo

Consegui que funcionasses com styled-components. Vou experimentar outras bibliotecas. No entanto, acontece o hot reload deixar de funcionar. Faço uma alteração, no App.tsx e não faz o reload automáticamente. Mesmo com debug desligado.

Experimentar react-router-native:
https://reactrouter.com/native/guides/quick-start

Rever questão do hot reload numa aplicação externa de raiz

Tenho de experimentar em Android depois também.

yarn add react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view

npx pod-install ios
