tablesync 3.0 uses a new config file format. It puts settings that used to be spread out into one place.

Your old config file will not load. You must change it before you upgrade.

To make this easy, run the migration tool on your old file. It writes a new file for you.

This release also makes the incremental sync faster. And it fixes a bug: a very large table could run out of memory while tablesync built a batch.
