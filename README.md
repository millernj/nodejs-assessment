# Dyno Nodejs Assessment

The intent of this repository is to evaluate a candidate's coding skills, ability 
to capture codebase bad practices and refactoring technique knowledge. 

The codebase, despite being small and straightforward, has errors on it and lacks good typing
since it's using pure Javascript.

The candidate goal is to refactor this application into Typescript code, identify and fix coding
bad practices and code smells. 

# How to Proceed

To be evaluated, the candidate must fork this repo, commit and push your changes, and once finished please upload to the Greenhouse link provided in your email.

---

### Candidate Comments
I placed the original version of the assessment in `/original` and left additional comments in the `userController.js` file with more specific, line-by-line critiques. I’ve included the majority of my overarching design thoughts here.

#### Issue #1: Modularity
The first major issue I found and aimed to fix was that the `userController.js` was responsible for everything user-related, from database file read/writes to serving JSON responses. This becomes more of an issue as other, more complicated models are added to this codebase beyond users. This approach would lead to bloated controllers at best. Without refactoring, it would be difficult to expand any functionality beyond basic CRUD.

To address this, I restructured the code in `src` to be more modular and flexible, allowing more complex features and interactions.

For example, let's say another model was created called "messages," and the feature requirements dictated that every time a message was created, it would update a new field in the User model called 'history,' storing the 10 most recent messages. If we apply the current pattern to that use case, you’d end up with a separate controller for messages that would also read and make updates to the user database as part of the `createMessage` endpoint logic. This adds a lot of unrelated responsibility and knowledge of the User Model to the message controller, which makes maintenance and further feature development more complex.

With my approach, you’d be able to import the user service into a newly created Message Service to make the appropriate updates to the User that posted the message. The Messages service would know how to use the User service to make updates, but it wouldn’t need to know how the User service works to make said updates.

Additionally, breaking out the logic for reading/writing to the `users.json` file into its own repository file has advantages. By design, only the User service should interact with it directly (even if other models were added), so it may seem tempting to make it another part of the User service. However, doing so would firmly entangle the logic of the service to the current database technology, making it far more brittle to data model and database changes (if this library ever wanted to store data outside of a local file, for example).

#### Issue #2: Atomicity
I also noticed that the original `userController.js` wasn’t locking the file it was reading/writing to, which could lead to data corruption if two or more requests came in simultaneously. This isn’t the kind of problem you’d normally encounter when using a traditional database solution like PostgreSQL or MongoDB, but since a single, local JSON file is our database, it takes some extra steps to make database operations atomic. I addressed this by only loading from the file on initialization, thereby pointing all reads to a variable in memory, and locking the file for each write operation to prevent simultaneous file writing. You can see my approach in the `src/api/user/repository.ts` file.

#### Issue #3: Validation

Lastly, the original codebase lacked input validation and error handling. Anything could come into the `getUserById` method through those request parameters, and the server would treat it the same, whether the `id` was a number or not. For the PUT requests, the user body could be anything, and the server would just accept it, happily adding whatever you put for `name`, `email`, or `address` (even `undefined`) right into the database.

To address this, I added the Zod package, a schema validation language designed for TypeScript, to implement validation messages for invalid input parameters and payloads.

#### Issue #4: Breaking Errors

These issues are pointed to directly in `./original`, but I'm listing them here as well. 

* The `usersFilePath` pointed to a folder that didn't exist
* The middleware that enables json payloads on requests `express.json()` was being added to the express `app` _after_ all the endpoints were defined, leaving it unused and breaking json payload parsing.
* The update users endpoint would delete user data if the payload didn't have values for all of the users fields `{name, email, address}`. 