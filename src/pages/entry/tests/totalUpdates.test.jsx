import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Options from '../Options';
import { OrderDetailsProvider } from '../../../contexts/OrderDetails';
import OrderEntry from '../OrderEntry';

test('should update scoop subtotal when scoops change', async () => {
  render(<Options optionType="scoops" />, { wrapper: OrderDetailsProvider });

  // make sure total starts out $0.00
  const scoopsSubtotal = screen.getByText('Scoops total: $', { exact: false });
  expect(scoopsSubtotal).toHaveTextContent('0.00');

  // udpate vanilla scoops to 1 and check the subtotal
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });

  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, '1');
  expect(scoopsSubtotal).toHaveTextContent('2.00');

  // update chocolate scoops to 2 and check subtotal
  const chocolateInput = await screen.findByRole('spinbutton', {
    name: 'Chocolate',
  });

  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, '2');
  expect(scoopsSubtotal).toHaveTextContent('6.00');
});

test('should update toppings subtotal when toppings change', async () => {
  // render parent component
  render(<Options optionType="toppings" />, { wrapper: OrderDetailsProvider });

  // make sure total starts out at $0.00
  const toppingsSubtotal = screen.getByText('Toppings total: $', {
    exact: false,
  });
  expect(toppingsSubtotal).toHaveTextContent('0.00');

  // add cherries and check subtotal
  const cherriesCheckbox = await screen.findByRole('checkbox', {
    name: 'Cherries',
  });
  userEvent.click(cherriesCheckbox);
  expect(toppingsSubtotal).toHaveTextContent('1.50');

  // add hot fudge and check subtotal
  const hotFudgeCheckbox = await screen.findByRole('checkbox', {
    name: 'Hot fudge',
  });
  userEvent.click(hotFudgeCheckbox);
  expect(toppingsSubtotal).toHaveTextContent('3.00');

  // remove hot fudge and check subtotal
  userEvent.click(hotFudgeCheckbox);
  expect(toppingsSubtotal).toHaveTextContent('1.50');
});

describe('grand total', () => {
  test('grand total updates properly if scoop is added first', async () => {
    // render parent component
    render(<OrderEntry />, { wrapper: OrderDetailsProvider });
    render(<Options optionType="scoops" />, { wrapper: OrderDetailsProvider });

    const grandTotal = await screen.findByRole('heading', {
      name: /Grand total: \$/i,
    });

    // grand total starts at $0.00
    expect(grandTotal).toHaveTextContent('$0.00');

    //add a scoop first and check grand total
    const chocolateInput = await screen.findByRole('spinbutton', {
      name: 'Chocolate',
    });

    userEvent.clear(chocolateInput);
    userEvent.type(chocolateInput, '1');
    expect(grandTotal).toHaveTextContent('$2.00');

    // then add toppings and check grand total
    const cherriesCheckbox = await screen.findByRole('checkbox', {
      name: 'Cherries',
    });

    userEvent.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent('$3.50');
  });
  test('grand total updates properly if topping is added first', async () => {
    render(<OrderEntry />, { wrapper: OrderDetailsProvider });
    render(<Options optionType="toppings" />, {
      wrapper: OrderDetailsProvider,
    });

    const grandTotal = await screen.findByRole('heading', {
      name: /Grand total: \$/i,
    });

    // add toppings first and check grand total
    const cherriesCheckbox = await screen.findByRole('checkbox', {
      name: 'Cherries',
    });

    userEvent.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent('$1.50');

    //then add a scoop and check grand total
    const chocolateInput = await screen.findByRole('spinbutton', {
      name: 'Chocolate',
    });

    userEvent.clear(chocolateInput);
    userEvent.type(chocolateInput, '1');
    expect(grandTotal).toHaveTextContent('$3.50');
  });
  test('grand total updates properly if item is removed', async () => {
    render(<OrderEntry />, { wrapper: OrderDetailsProvider });
    render(<Options optionType="toppings" />, {
      wrapper: OrderDetailsProvider,
    });

    const grandTotal = await screen.findByRole('heading', {
      name: /Grand total: \$/i,
    });

    // add toppings and check grand total
    const cherriesCheckbox = await screen.findByRole('checkbox', {
      name: 'Cherries',
    });

    userEvent.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent('$1.50');

    // remove toppings and check grand total
    userEvent.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent('$0.00');
  });
});
