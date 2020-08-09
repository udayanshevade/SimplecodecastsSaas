$(document).ready(() => {
  // Stripe client
  let stripe = null;
  // Stripe card element
  let cardEl = null;

  // Query the form element
  const getForm = () => {
    const newUserProId = 'newUserPro';
    const form = $(`#${newUserProId}`);
    return form;
  };

  // Query the Pro User registration form submit button
  const getFormSubmit = () => {
    const formSubmitId = 'newUserProId';
    const formSubmitButton = $(`#${formSubmitId}`);
    return formSubmitButton;
  };

  // Disable the Pro User reg form submit button
  const setFormSubmitDisabled = shouldBeDisabled => {
    const formSubmit = getFormSubmit();
    formSubmit.prop('disabled', shouldBeDisabled);
  };

  // Access the stripe public key
  const getStripePublicKey = () => {
    const metaId = 'meta[name="stripe-key"]';
    const metaTag = $(metaId);
    const val = metaTag.attr('content');
    return val;
  };

  // Initialize Stripe functionality
  const initStripe = () => {
    const stripeKey = getStripePublicKey();
    // initialize and assign Stripe client
    stripe = Stripe(stripeKey);

    // init elements API
    const elements = stripe.elements();
    // Stripe-provided card element

    // Create and mount the card field
    const injectStripeCardElement = () => {
      cardEl = elements.create('card');
      const cardElementContainerId = 'cardElementContainer';
      cardEl.mount(`#${cardElementContainerId}`);
    };

    // Queries the container for displaying card errors
    const getCardErrEl = () => {
      const cardErrorsId = 'card-errors';
      const cardErrContainer = $(`#${cardErrorsId}`);
      return cardErrContainer;
    };

    // Handle changes in the card values
    const initCardValChangeHandler = () => {
      // Set/clear displayed err message when the values are updated
      const setCardValError = () => {
        const cardErrContainer = getCardErrEl();
        if (e.error) {
          cardErrContainer.textContent = e.error.message;
        } else {
          cardErrContainer.textContent = '';
        }
      };

      cardEl.on('change', e => {
        setCardValError(e);
      });
    };

    // mount element
    injectStripeCardElement();
    // handle card value changes
    initCardValChangeHandler();
  };

  // Handle the token returned by the Stripe API
  // and finally submit the form to the server
  const stripeTokenHandler = token => {
    const form = getForm();
    const hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);
    // Finally, submit the form
    form.submit();
  };

  // Intercept the Pro User registration form submit action
  const initProUserFormIntercept = () => {
    // Bypass the form submission event
    const handleFormSubmit = e => {
      // stop default submission of form to server
      e.preventDefault();

      if (!cardEl) return; // TODO: handle uninitialized card element

      stripe.createToken(cardEl).then(res => {
        if (res.error) {
          const cardErrContainer = getCardErrEl();
          cardErrContainer.textContent = res.error.message;
        } else {
          stripeTokenHandler(res.token);
        }
      });
    };
    const form = getForm();
    form.submit(handleFormSubmit);
  };

  // initializes the Stripe-related functionality
  const init = () => {
    // by default disable the form submit first
    setFormSubmitDisabled(true);
    initStripe();
    // re-enable form submit once the stripe client is initialized
    // and once the required "card" element is injected in the form
    setFormSubmitDisabled(false);
    // intercept the default form submission,
    // and create a token with the Stripe API
    // and then complete submission to the server
    initProUserFormIntercept();
  };

  init();
});
