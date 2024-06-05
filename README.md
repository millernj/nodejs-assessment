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
I placed the original version of the assessment in `/original` and left some more comments in the `userController.js` file with more specific critiques, but I've included the majority of my thoughts here.

#### Issue #1: Modalarity
The first major issue I found and aimed to fix was that the `userController.js` was responsible for everything user related, from db file read/writes to serving json responses. This is becomes more of an issue as other more complicated models start getting added to this codebase beyond users, and this approach would lead to some pretty bloated controllers at best. Without refactoring, it would be difficult to expand any functionality beyond basic CRUD.

In `src`, I broke things up to be more granualar and flexible, enabling more complex features and interactions.

For example, let's say another model was created called "messages" and the feature requirements were such that every time a message was created, it would update a new field in the User model called "history" that stores the 10 most recent messages. If we apply this pattern to that use case, you'd need a separate controller for messages that would also read and make updates to the user db as part of the createMessage endpoint logic. This adds a lot of unrelated responsibility and knowledge of the User Model to the message controller, which makes maintanence and further feature development more complex.

With my approach, you'd be able to import the user service into a newly created Message Service to make the appropriate update to the User that posted the message. The Messages service would know how to use the User service to make updates, but it wouldn't need to know how the User service works to make said updates. 

Breaking out the logic for read/writing to the users.json file into its own repository file has advantages as well. By design, only the User service should interact with it directly (even if other models were added), and it may seem tempting to make it another part of the User service. However, doing so would firmly entangle the logic of the service to the current database technology, making it far more rigid to data model and database changes (if this library every wanted to store data outside of a local file, for example). 

#### Issue #2: Atomicity
I also noticed that the original `userController.js` wasn't locking the file it was reading/writing to, which could lead to some data corruption problems if two or more requests came in at the same time. This isn't the kind of problem you'd normally encounter when using a traditional database solution like Postgres or MongoDB, but since a single, local JSON file is our database, it takes some extra steps to make database operations atomic. I address this by only loading from the file on initialization thereby pointing all reads to a variable in memory, and by locking the file for each write operation, preventing simultaneous file writing. You can see my approach in the `src/api/user/repository.ts` file.
