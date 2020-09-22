let newPasswordValue;
let confirmationValue;
const submitBtn = document.getElementById('updateInfo');
const newPassword = document.getElementById('password');
const confirmation = document.getElementById('confirm-password');
const validationMessage = document.getElementById('register-validation-message');
function validatePasswords(message, add, remove) {
		validationMessage.textContent = message;
		validationMessage.classList.add(add);
		validationMessage.classList.remove(remove);
}
confirmation.addEventListener('input', e => {
	e.preventDefault(); //stops default submit behaviour of form
	newPasswordValue = newPassword.value;
	confirmationValue = confirmation.value;
	if (newPasswordValue !== confirmationValue) {
	  validatePasswords('Passwords must match !', 'color-red', 'text-unifiq-blue');
	  submitBtn.setAttribute('disabled', true);
	} else {
		validatePasswords('Passwords match !', 'text-unifiq-blue', 'color-red');
	  submitBtn.removeAttribute('disabled');
	}
});

