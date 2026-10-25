import BasePage from './base-page';

/** Elements confirmed on https://demoqa.com/sortable */
const SELECTORS = {
  listItems: '#demo-tabpane-list .list-group-item',
};

const ASCENDING_ORDER = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];

class SortablePage extends BasePage {
  /**
   * Puts the list in ascending order with drag and drop.
   * Position by position, the item that belongs there is dragged onto it.
   * @param {number} [movesLeft] - safety limit, so a failed drag never loops forever
   */
  sortAscending(movesLeft = ASCENDING_ORDER.length) {
    cy.get(SELECTORS.listItems).then(($items) => {
      const current = [...$items].map((item) => item.innerText.trim());
      const position = ASCENDING_ORDER.findIndex((text, index) => current[index] !== text);

      if (position === -1) {
        return; // the list is in ascending order
      }
      if (movesLeft === 0) {
        throw new Error(`Could not sort the list. Current order: ${current.join(', ')}`);
      }

      this.dragOnto(ASCENDING_ORDER[position], current[position]);
      this.sortAscending(movesLeft - 1);
    });
  }

  /**
   * Drags an item and drops it on the top half of another one,
   * which moves the dragged item to the target's position.
   * The list uses native HTML5 drag and drop, so these are the events it listens to.
   * @param {string} itemText
   * @param {string} targetText
   */
  dragOnto(itemText, targetText) {
    const dataTransfer = new DataTransfer();

    cy.contains(SELECTORS.listItems, itemText).trigger('dragstart', { dataTransfer });
    cy.contains(SELECTORS.listItems, targetText).trigger('dragenter', 'top', { dataTransfer });
    cy.contains(SELECTORS.listItems, targetText).trigger('dragover', 'top', { dataTransfer });
    cy.contains(SELECTORS.listItems, targetText).trigger('drop', 'top', { dataTransfer });
    cy.contains(SELECTORS.listItems, itemText).trigger('dragend', { dataTransfer });
  }

  /** @param {string[]} order */
  shouldBeInOrder(order) {
    cy.get(SELECTORS.listItems).should(($items) => {
      expect([...$items].map((item) => item.innerText.trim())).to.deep.eq(order);
    });
  }
}

export default new SortablePage();
