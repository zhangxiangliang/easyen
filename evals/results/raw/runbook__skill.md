The sync has stopped and the queue keeps growing. Work through these steps.

First, check the status endpoint. It tells you if the worker is still alive. If the worker is dead, restart the service. That fixes most cases.

If the worker is alive but nothing moves, read the logs. Look for a login or a rights error. This often happens right after someone changes a password.

If the queue holds more than ten thousand items, raise the worker count to catch up. Then tell the data team their data may be old.
