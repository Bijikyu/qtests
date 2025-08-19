# Test Failure Analysis

**Creation Time:** 2025-08-19T15:29:28.830Z
**Pacific Time:** Tuesday, August 19, 2025 at 08:29:28 AM PDT

⚠️ **STALENESS WARNING:** If your code changes are after the creation time above and you are checking this file, then it is stale and tests need to be rerun.

Analyze and address the following test failures:

## Failed Test 1: test/sendEmail.test.js

### Output:
```
FAIL test/sendEmail.test.js
  ● Console

    console.log
      setup is running with none

      at Object.setup (lib/setup.js:58:11)

    console.log
      setup has run resulting in module resolution modification

      at Object.setup (lib/setup.js:62:13)

    console.log
      [START] clearEmailHistory()

      at log (lib/logUtils.js:104:28)

    console.log
      [RETURN] clearEmailHistory -> 0

      at log (lib/logUtils.js:138:28)

    console.log
      [START] sendEmail({"to":"test@example.com","subject":"Test Email","text":"This is a test email"}, undefined, undefined, {})

      at log (lib/logUtils.js:104:28)

    console.log
      [START] validateEmail({"to":"test@example.com","subject":"Test Email","text":"This is a test email"})

      at log (lib/logUtils.js:104:28)

    console.log
      [RETURN] validateEmail -> false

      at log (lib/logUtils.js:138:28)

    console.log
      [MOCK EMAIL ERROR] Invalid recipient: [object Object]

      at log (utils/email/emailSender.js:42:13)

    console.log
      [RETURN] sendEmail -> {"success":false,"emailData":null,"message":"Invalid email address: [object Object]","timestamp":"2025-08-19T15:28:27.341Z","error":"INVALID_RECIPIENT"}

      at log (lib/logUtils.js:138:28)

    console.log
      [START] clearEmailHistory()

      at log (lib/logUtils.js:104:28)

    console.log
      [RETURN] clearEmailHistory -> 1

      at log (lib/logUtils.js:138:28)

    console.log
      [START] sendEmail({"to":"user1@example.com","subject":"Email 1","text":"First email"}, undefined, undefined, {})

      at log (lib/logUtils.js:104:28)

    console.log
      [START] validateEmail({"to":"user1@example.com","subject":"Email 1","text":"First email"})

      at log (lib/logUtils.js:104:28)

    console.log
      [RETURN] validateEmail -> false

      at log (lib/logUtils.js:138:28)

    console.log
      [MOCK EMAIL ERROR] Invalid recipient: [object Object]

      at log (utils/email/emailSender.js:42:13)

    console.log
      [RETURN] sendEmail -> {"success":false,"emailData":null,"message":"Invalid email address: [object Object]","timestamp":"2025-08-19T15:28:27.362Z","error":"INVALID_RECIPIENT"}

      at log (lib/logUtils.js:138:28)

    console.log
      [START] sendEmail({"to":"user2@example.com","subject":"Email 2","text":"Second email"}, undefined, undefined, {})

      at log (lib/logUtils.js:104:28)

    console.log
      [START] validateEmail({"to":"user2@example.com","subject":"Email 2","text":"Second email"})

      at log (lib/logUtils.js:104:28)

    console.log
      [RETURN] validateEmail -> false

      at log (lib/logUtils.js:138:28)

    console.log
      [MOCK EMAIL ERROR] Invalid recipient: [object Object]

      at log (utils/email/emailSender.js:42:13)

    console.log
      [RETURN] sendEmail -> {"success":false,"emailData":null,"message":"Invalid email address: [object Object]","timestamp":"2025-08-19T15:28:27.363Z","error":"INVALID_RECIPIENT"}

      at log (lib/logUtils.js:138:28)

    console.log
      [START] getEmailHistory()

      at log (lib/logUtils.js:104:28)

    console.log
      [RETURN] getEmailHistory -> "2 emails"

      at log (lib/logUtils.js:138:28)

    console.log
      [START] clearEmailHistory()

      at log (lib/logUtils.js:104:28)

    console.log
      [RETURN] clearEmailHistory -> 2

      at log (lib/logUtils.js:138:28)

    console.log
      [START] sendEmail({"to":"test@example.com","subject":"Test","text":"Test email"}, undefined, undefined, {})

      at log (lib/logUtils.js:104:28)

    console.log
      [START] validateEmail({"to":"test@example.com","subject":"Test","text":"Test email"})

      at log (lib/logUtils.js:104:28)

    console.log
      [RETURN] validateEmail -> false

      at log (lib/logUtils.js:138:28)

    console.log
      [MOCK EMAIL ERROR] Invalid recipient: [object Object]

      at log (utils/email/emailSender.js:42:13)

    console.log
      [RETURN] sendEmail -> {"success":false,"emailData":null,"message":"Invalid email address: [object Object]","timestamp":"2025-08-19T15:28:27.368Z","error":"INVALID_RECIPIENT"}

      at log (lib/logUtils.js:138:28)

    console.log
      [START] getEmailHistory()

      at log (lib/logUtils.js:104:28)

    console.log
      [RETURN] getEmailHistory -> "1 emails"

      at log (lib/logUtils.js:138:28)

    console.log
      [START] clearEmailHistory()

      at log (lib/logUtils.js:104:28)

    console.log
      [RETURN] clearEmailHistory -> 1

      at log (lib/logUtils.js:138:28)

    console.log
      [START] getEmailHistory()

      at log (lib/logUtils.js:104:28)

    console.log
      [RETURN] getEmailHistory -> "0 emails"

      at log (lib/logUtils.js:138:28)

  ● Send Email Integration › sendEmail captures email data

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      20 |     const result = await sendEmail(emailData);
      21 |     
    > 22 |     expect(result.success).toBe(true);
         |                            ^
      23 |     expect(result.messageId).toBeDefined();
      24 |     expect(result.to).toBe('test@example.com');
      25 |   });

      at Object.toBe (test/sendEmail.test.js:22:28)

  ● Send Email Integration › getEmailHistory tracks sent emails

    expect(received).toBe(expected) // Object.is equality

    Expected: "user1@example.com"
    Received: undefined

      40 |     const history = getEmailHistory();
      41 |     expect(history).toHaveLength(2);
    > 42 |     expect(history[0].to).toBe('user1@example.com');
         |                           ^
      43 |     expect(history[1].to).toBe('user2@example.com');
      44 |   });
      45 |   

      at Object.toBe (test/sendEmail.test.js:42:27)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 1 passed, 3 total
Snapshots:   0 total
Time:        5.227 s
Ran all test suites matching test/sendEmail.test.js.

```

### Duration: 12001ms

---

## Failed Test 2: test/offlineMode.test.js

### Output:
```

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/offlineMode.test.js.

      at buildLogger (node_modules/qerrors/lib/logger.js:152:33)

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/offlineMode.test.js.

      at Object.get [as File] (node_modules/winston/lib/winston/transports/index.js:30:12)
      at node_modules/qerrors/lib/logger.js:164:57
      at buildLogger (node_modules/qerrors/lib/logger.js:171:11)
/home/runner/workspace/node_modules/qerrors/lib/logger.js:164
                                arr.push(new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error', ...rotationOpts, maxFiles: fileCap, format: fileFormat })); //(size-based rotation for error files with count limit)
                                         ^

[TypeError: transports.File is not a constructor]

Node.js v20.19.3

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/offlineMode.test.js.

      at buildLogger (node_modules/qerrors/lib/logger.js:152:33)

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/offlineMode.test.js.

      at Object.get [as File] (node_modules/winston/lib/winston/transports/index.js:30:12)
      at node_modules/qerrors/lib/logger.js:164:57
      at buildLogger (node_modules/qerrors/lib/logger.js:171:11)
/home/runner/workspace/node_modules/qerrors/lib/logger.js:164
                                arr.push(new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error', ...rotationOpts, maxFiles: fileCap, format: fileFormat })); //(size-based rotation for error files with count limit)
                                         ^

[TypeError: transports.File is not a constructor]

Node.js v20.19.3

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/offlineMode.test.js.

      at buildLogger (node_modules/qerrors/lib/logger.js:152:33)

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/offlineMode.test.js.

      at Object.get [as File] (node_modules/winston/lib/winston/transports/index.js:30:12)
      at node_modules/qerrors/lib/logger.js:164:57
      at buildLogger (node_modules/qerrors/lib/logger.js:171:11)
/home/runner/workspace/node_modules/qerrors/lib/logger.js:164
                                arr.push(new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error', ...rotationOpts, maxFiles: fileCap, format: fileFormat })); //(size-based rotation for error files with count limit)
                                         ^

[TypeError: transports.File is not a constructor]

Node.js v20.19.3

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/offlineMode.test.js.

      at buildLogger (node_modules/qerrors/lib/logger.js:152:33)

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/offlineMode.test.js.

      at Object.get [as File] (node_modules/winston/lib/winston/transports/index.js:30:12)
      at node_modules/qerrors/lib/logger.js:164:57
      at buildLogger (node_modules/qerrors/lib/logger.js:171:11)
/home/runner/workspace/node_modules/qerrors/lib/logger.js:164
                                arr.push(new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error', ...rotationOpts, maxFiles: fileCap, format: fileFormat })); //(size-based rotation for error files with count limit)
                                         ^

[TypeError: transports.File is not a constructor]

Node.js v20.19.3
FAIL test/offlineMode.test.js
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        10.326 s
Ran all test suites matching test/offlineMode.test.js.

```

### Duration: 12638ms

---

## Summary

- Total failed tests: 2
- Failed test files: test/sendEmail.test.js, test/offlineMode.test.js
- Generated: 2025-08-19T15:29:28.847Z
