import { After } from '@badeball/cypress-cucumber-preprocessor';
import accountService from '../../api/account-service';

/**
 * Test data cleanup: every user created by an API scenario is deleted,
 * so the runs do not pollute the shared demoqa database.
 */
After({ tags: '@api' }, function () {
  if (!this.userId) {
    return;
  }

  accountService.generateToken(this.credentials).then(({ body }) => {
    if (body.token) {
      accountService.deleteUser(this.userId, body.token);
    }
  });
});
