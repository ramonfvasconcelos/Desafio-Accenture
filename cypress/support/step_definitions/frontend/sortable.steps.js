import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import sortablePage from '../../pages/sortable-page';

/*
 * Steps for: Sortable.
 */

When('I drag and drop the items into ascending order', function () {
  sortablePage.sortAscending();
});

Then('the items should be in the order {string}', function (order) {
  sortablePage.shouldBeInOrder(order.split(', '));
});
