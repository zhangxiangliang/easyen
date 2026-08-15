tablesync works in three steps.

The reader opens the database and walks through the table a few rows at a time. This way a huge table never has to fit in memory.

The batcher holds those rows until it has enough, or until enough time has passed. Then it turns them into a file.

The writer sends that file to S3. If a send fails, it waits and tries again, and it waits longer each time.

Each step passes work to the next through a queue with a fixed size. When the writer falls behind, the queue fills up and the reader slows down on its own.
