From 02:10 to 06:20 UTC, tablesync wrote part of a file to S3 instead of the whole file. This hit some of the tables, not all.

A network change made the largest packet size smaller. Big uploads got cut short, but S3 did not report an error. tablesync read the reply as a success, so it did not try again. Teams that read this data got only part of it.

We undid the network change and ran the missed hours again. We are now adding a checksum on each upload, so tablesync can catch this by itself.
